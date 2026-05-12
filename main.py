from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
import os
import re
import sqlite3
import smtplib
from uuid import uuid4

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# SMTP config
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_TO = os.getenv("EMAIL_TO")

DATABASE_URL = os.getenv("FOOD_TRACKER_DB", "food_tracker.db")

LEAN_PROTEINS = {
    "chicken",
    "turkey",
    "salmon",
    "tuna",
    "shrimp",
    "egg",
    "eggs",
    "greek yogurt",
    "cottage cheese",
    "tofu",
    "tempeh",
    "lentils",
    "beans",
    "protein shake",
    "whey",
}

COMMON_ALLERGENS = {
    "milk": ["milk", "cheese", "yogurt", "whey", "butter", "cream"],
    "egg": ["egg", "eggs", "mayonnaise"],
    "fish": ["salmon", "tuna", "cod", "fish"],
    "shellfish": ["shrimp", "crab", "lobster", "shellfish"],
    "tree nuts": ["almond", "walnut", "cashew", "pecan", "pistachio"],
    "peanuts": ["peanut", "peanuts"],
    "wheat": ["wheat", "bread", "pasta", "cracker", "flour"],
    "soy": ["soy", "tofu", "tempeh", "edamame"],
    "sesame": ["sesame", "tahini"],
}

MEAL_IDEAS = [
    {
        "name": "Grilled chicken power bowl",
        "tags": ["chicken", "rice", "vegetables"],
        "protein_grams": 42,
        "why": "High-protein, balanced carbs, and easy to prep in bulk.",
    },
    {
        "name": "Salmon, sweet potato, and greens",
        "tags": ["salmon", "sweet potato", "greens"],
        "protein_grams": 38,
        "why": "Supports lean muscle with protein plus omega-3 fats.",
    },
    {
        "name": "Turkey lettuce tacos",
        "tags": ["turkey", "lettuce", "avocado"],
        "protein_grams": 36,
        "why": "Lean protein with flexible toppings and lower refined carbs.",
    },
    {
        "name": "Tofu vegetable stir fry",
        "tags": ["tofu", "vegetables", "rice"],
        "protein_grams": 30,
        "why": "Plant-forward protein meal with lots of micronutrients.",
    },
    {
        "name": "Greek yogurt berry parfait",
        "tags": ["greek yogurt", "berries", "oats"],
        "protein_grams": 28,
        "why": "Fast meal or snack that helps hit daily protein targets.",
    },
]


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def get_db():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT,
                goals TEXT NOT NULL,
                allergies TEXT NOT NULL,
                favorite_stores TEXT NOT NULL,
                notification_preferences TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS food_entries (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                spoken_text TEXT NOT NULL,
                parsed_foods TEXT NOT NULL,
                photo_url TEXT,
                photo_status TEXT NOT NULL,
                confirmed_foods TEXT NOT NULL,
                liked INTEGER,
                meal_time TEXT NOT NULL,
                location TEXT,
                estimated_nutrition TEXT NOT NULL,
                allergy_warnings TEXT NOT NULL,
                notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS favorite_foods (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                food_name TEXT NOT NULL,
                store_preferences TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(user_id, food_name),
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS sales (
                id TEXT PRIMARY KEY,
                food_name TEXT NOT NULL,
                store_name TEXT NOT NULL,
                store_location TEXT,
                price TEXT,
                sale_ends_at TEXT,
                source_url TEXT,
                created_at TEXT NOT NULL
            );
            """
        )


def row_to_dict(row):
    item = dict(row)
    for key in (
        "goals",
        "allergies",
        "favorite_stores",
        "notification_preferences",
        "parsed_foods",
        "confirmed_foods",
        "estimated_nutrition",
        "allergy_warnings",
        "store_preferences",
    ):
        if key in item and isinstance(item[key], str):
            item[key] = json.loads(item[key])
    if "liked" in item and item["liked"] is not None:
        item["liked"] = bool(item["liked"])
    return item


def normalize_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip().lower() for item in value if str(item).strip()]
    return [str(value).strip().lower()] if str(value).strip() else []


def parse_foods(spoken_text):
    text = spoken_text.lower()
    text = re.sub(r"\b(i ate|i had|i am eating|i'm eating|for breakfast|for lunch|for dinner)\b", "", text)
    text = re.sub(r"\b(a plate of|a bowl of|some|with|and)\b", ",", text)
    foods = [part.strip(" .") for part in text.split(",") if part.strip(" .")]
    return foods or [spoken_text.strip()]


def estimate_nutrition(parsed_foods):
    text = " ".join(parsed_foods).lower()
    protein = 0
    calories = 0
    for protein_food in LEAN_PROTEINS:
        if protein_food in text:
            protein += 25
            calories += 180
    calories += max(len(parsed_foods), 1) * 120
    return {
        "calories": calories or None,
        "protein_grams": protein or None,
        "confidence": "rough_estimate",
        "needs_photo_confirmation": True,
    }


def detect_allergy_warnings(foods, allergies):
    warnings = []
    food_text = " ".join(foods).lower()
    for allergy in allergies:
        allergy_name = allergy.lower()
        terms = COMMON_ALLERGENS.get(allergy_name, [allergy_name])
        matches = [term for term in terms if term in food_text]
        if matches:
            warnings.append(
                {
                    "allergy": allergy,
                    "matched_terms": matches,
                    "message": f"Possible {allergy} allergen detected. Confirm ingredients before eating.",
                }
            )
    return warnings


def get_user_or_404(user_id):
    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return row_to_dict(user) if user else None


@app.route("/", methods=["GET"])
def root():
    return "Happy Path CRM API is live! Food tracker endpoints are available under /food."


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "happy-path-crm-api", "timestamp": now_iso()})


@app.route("/leads", methods=["POST"])
def collect_lead():
    print("🔔 /leads endpoint hit")
    data = request.json or {}
    print("📨 Received data:", data)

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    source = data.get("source", "ChatGPT Assistant")

    msg = MIMEMultipart()
    msg["From"] = SMTP_USERNAME
    msg["To"] = EMAIL_TO
    msg["Subject"] = f"New Lead from {source}"

    body = f"""
    You received a new lead:

    Name: {name}
    Email: {email}
    Phone: {phone}
    Source: {source}
    """
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        print("✅ Email sent successfully to:", EMAIL_TO)
        return jsonify({"message": "Lead submitted successfully"}), 201
    except Exception as e:
        print("❌ Email sending failed:", e)
        return jsonify({"error": "Failed to send lead"}), 500


@app.route("/food/users", methods=["POST"])
def create_food_user():
    data = request.json or {}
    name = data.get("name")
    if not name:
        return jsonify({"error": "name is required"}), 400

    timestamp = now_iso()
    user = {
        "id": str(uuid4()),
        "name": name,
        "email": data.get("email"),
        "goals": data.get("goals", {"primary": "gain lean muscle"}),
        "allergies": normalize_list(data.get("allergies")),
        "favorite_stores": data.get("favorite_stores", []),
        "notification_preferences": data.get(
            "notification_preferences",
            {"channels": ["email"], "sale_alerts": True, "meal_reminders": True},
        ),
        "created_at": timestamp,
        "updated_at": timestamp,
    }

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO users (id, name, email, goals, allergies, favorite_stores,
                notification_preferences, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                user["name"],
                user["email"],
                json.dumps(user["goals"]),
                json.dumps(user["allergies"]),
                json.dumps(user["favorite_stores"]),
                json.dumps(user["notification_preferences"]),
                user["created_at"],
                user["updated_at"],
            ),
        )
    return jsonify(user), 201


@app.route("/food/users/<user_id>", methods=["GET"])
def get_food_user(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify(user)


@app.route("/food/entries", methods=["POST"])
def create_food_entry():
    data = request.json or {}
    user_id = data.get("user_id")
    spoken_text = data.get("spoken_text")
    if not user_id or not spoken_text:
        return jsonify({"error": "user_id and spoken_text are required"}), 400

    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    parsed_foods = normalize_list(data.get("parsed_foods")) or parse_foods(spoken_text)
    confirmed_foods = normalize_list(data.get("confirmed_foods"))
    allergy_warnings = detect_allergy_warnings(parsed_foods + confirmed_foods, user["allergies"])
    timestamp = now_iso()
    photo_url = data.get("photo_url")
    entry = {
        "id": str(uuid4()),
        "user_id": user_id,
        "spoken_text": spoken_text,
        "parsed_foods": parsed_foods,
        "photo_url": photo_url,
        "photo_status": "provided" if photo_url else "requested",
        "confirmed_foods": confirmed_foods,
        "liked": data.get("liked"),
        "meal_time": data.get("meal_time", timestamp),
        "location": data.get("location"),
        "estimated_nutrition": data.get("estimated_nutrition", estimate_nutrition(parsed_foods)),
        "allergy_warnings": allergy_warnings,
        "notes": data.get("notes"),
        "created_at": timestamp,
        "updated_at": timestamp,
    }

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO food_entries (id, user_id, spoken_text, parsed_foods, photo_url,
                photo_status, confirmed_foods, liked, meal_time, location, estimated_nutrition,
                allergy_warnings, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                entry["id"],
                entry["user_id"],
                entry["spoken_text"],
                json.dumps(entry["parsed_foods"]),
                entry["photo_url"],
                entry["photo_status"],
                json.dumps(entry["confirmed_foods"]),
                int(entry["liked"]) if entry["liked"] is not None else None,
                entry["meal_time"],
                entry["location"],
                json.dumps(entry["estimated_nutrition"]),
                json.dumps(entry["allergy_warnings"]),
                entry["notes"],
                entry["created_at"],
                entry["updated_at"],
            ),
        )

    return jsonify({"entry": entry, "next_prompt": "Please add a meal photo so I can confirm what you ate."}), 201


@app.route("/food/entries/<entry_id>/photo-confirmation", methods=["POST"])
def confirm_food_entry_photo(entry_id):
    data = request.json or {}
    confirmed_foods = normalize_list(data.get("confirmed_foods"))
    if not confirmed_foods:
        return jsonify({"error": "confirmed_foods is required"}), 400

    with get_db() as conn:
        entry = conn.execute("SELECT * FROM food_entries WHERE id = ?", (entry_id,)).fetchone()
        if not entry:
            return jsonify({"error": "entry not found"}), 404
        user = conn.execute("SELECT * FROM users WHERE id = ?", (entry["user_id"],)).fetchone()
        user_dict = row_to_dict(user)
        allergy_warnings = detect_allergy_warnings(confirmed_foods, user_dict["allergies"])
        conn.execute(
            """
            UPDATE food_entries
            SET photo_url = COALESCE(?, photo_url), photo_status = ?, confirmed_foods = ?, liked = ?,
                estimated_nutrition = ?, allergy_warnings = ?, notes = COALESCE(?, notes), updated_at = ?
            WHERE id = ?
            """,
            (
                data.get("photo_url"),
                "confirmed",
                json.dumps(confirmed_foods),
                int(data["liked"]) if "liked" in data else entry["liked"],
                json.dumps(data.get("estimated_nutrition", estimate_nutrition(confirmed_foods))),
                json.dumps(allergy_warnings),
                data.get("notes"),
                now_iso(),
                entry_id,
            ),
        )
        updated = conn.execute("SELECT * FROM food_entries WHERE id = ?", (entry_id,)).fetchone()

    return jsonify(row_to_dict(updated))


@app.route("/food/users/<user_id>/entries", methods=["GET"])
def list_food_entries(user_id):
    if not get_user_or_404(user_id):
        return jsonify({"error": "user not found"}), 404
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM food_entries WHERE user_id = ? ORDER BY meal_time DESC", (user_id,)
        ).fetchall()
    return jsonify({"entries": [row_to_dict(row) for row in rows]})


@app.route("/food/users/<user_id>/favorites", methods=["POST"])
def create_favorite_food(user_id):
    data = request.json or {}
    food_name = str(data.get("food_name", "")).strip().lower()
    if not food_name:
        return jsonify({"error": "food_name is required"}), 400
    if not get_user_or_404(user_id):
        return jsonify({"error": "user not found"}), 404

    favorite_id = str(uuid4())
    with get_db() as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO favorite_foods (id, user_id, food_name, store_preferences, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (favorite_id, user_id, food_name, json.dumps(data.get("store_preferences", [])), now_iso()),
        )
        row = conn.execute(
            "SELECT * FROM favorite_foods WHERE user_id = ? AND food_name = ?", (user_id, food_name)
        ).fetchone()
    return jsonify(row_to_dict(row)), 201


@app.route("/food/users/<user_id>/favorites", methods=["GET"])
def list_favorite_foods(user_id):
    if not get_user_or_404(user_id):
        return jsonify({"error": "user not found"}), 404
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM favorite_foods WHERE user_id = ? ORDER BY food_name", (user_id,)
        ).fetchall()
    return jsonify({"favorites": [row_to_dict(row) for row in rows]})


@app.route("/food/sales", methods=["POST"])
def create_sale():
    data = request.json or {}
    if not data.get("food_name") or not data.get("store_name"):
        return jsonify({"error": "food_name and store_name are required"}), 400
    sale = {
        "id": str(uuid4()),
        "food_name": data["food_name"].strip().lower(),
        "store_name": data["store_name"],
        "store_location": data.get("store_location"),
        "price": data.get("price"),
        "sale_ends_at": data.get("sale_ends_at"),
        "source_url": data.get("source_url"),
        "created_at": now_iso(),
    }
    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO sales (id, food_name, store_name, store_location, price, sale_ends_at, source_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            tuple(sale.values()),
        )
    return jsonify(sale), 201


@app.route("/food/users/<user_id>/sale-alerts", methods=["GET"])
def get_sale_alerts(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    favorite_stores = [store.lower() for store in user.get("favorite_stores", [])]
    with get_db() as conn:
        favorites = [
            row["food_name"]
            for row in conn.execute("SELECT food_name FROM favorite_foods WHERE user_id = ?", (user_id,))
        ]
        entries = conn.execute(
            "SELECT confirmed_foods, parsed_foods FROM food_entries WHERE user_id = ? AND liked = 1", (user_id,)
        ).fetchall()
        for entry in entries:
            favorites.extend(json.loads(entry["confirmed_foods"]) or json.loads(entry["parsed_foods"]))
        favorites = sorted(set(favorites))
        sales = conn.execute("SELECT * FROM sales ORDER BY created_at DESC").fetchall()

    alerts = []
    for sale in sales:
        sale_dict = row_to_dict(sale)
        store_match = not favorite_stores or sale_dict["store_name"].lower() in favorite_stores
        food_match = any(food in sale_dict["food_name"] or sale_dict["food_name"] in food for food in favorites)
        if store_match and food_match:
            alerts.append(
                {
                    "message": f"{sale_dict['food_name']} is on sale at {sale_dict['store_name']}.",
                    "sale": sale_dict,
                }
            )
    return jsonify({"alerts": alerts, "favorite_foods_checked": favorites})


@app.route("/food/users/<user_id>/meal-suggestions", methods=["GET"])
def get_meal_suggestions(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    allergies = user["allergies"]
    liked_terms = []
    with get_db() as conn:
        rows = conn.execute(
            "SELECT confirmed_foods, parsed_foods FROM food_entries WHERE user_id = ? AND liked = 1", (user_id,)
        ).fetchall()
    for row in rows:
        liked_terms.extend(json.loads(row["confirmed_foods"]) or json.loads(row["parsed_foods"]))

    suggestions = []
    for meal in MEAL_IDEAS:
        warnings = detect_allergy_warnings(meal["tags"], allergies)
        if warnings:
            continue
        affinity = sum(1 for term in liked_terms if any(tag in term or term in tag for tag in meal["tags"]))
        suggestions.append({**meal, "personalization_score": affinity})

    suggestions.sort(key=lambda item: (item["personalization_score"], item["protein_grams"]), reverse=True)
    return jsonify({"suggestions": suggestions[:5]})


@app.route("/food/users/<user_id>/coach", methods=["GET"])
def get_food_coach(user_id):
    user = get_user_or_404(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM food_entries WHERE user_id = ? ORDER BY meal_time DESC LIMIT 20", (user_id,)
        ).fetchall()
    entries = [row_to_dict(row) for row in rows]
    total_protein = sum((entry["estimated_nutrition"].get("protein_grams") or 0) for entry in entries)
    warnings = [warning for entry in entries for warning in entry["allergy_warnings"]]
    protein_tip = "Add a lean protein serving to your next meal."
    if entries and total_protein / len(entries) >= 30:
        protein_tip = "Your recent meals are protein-forward. Keep pairing protein with fiber-rich carbs."
    coaching = {
        "goal": user["goals"],
        "recent_entries_analyzed": len(entries),
        "average_protein_per_entry": round(total_protein / len(entries), 1) if entries else 0,
        "allergy_warning_count": len(warnings),
        "recommendations": [
            protein_tip,
            "Use photo confirmation to improve meal recognition and coaching accuracy.",
            "Mark meals you like so future suggestions match your preferences.",
        ],
        "disclaimer": "Nutrition coaching is informational and should not replace medical advice.",
    }
    if warnings:
        coaching["recommendations"].insert(0, "Review allergy warnings before repeating similar meals.")
    return jsonify(coaching)


init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
