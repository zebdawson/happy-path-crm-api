# Happy Path CRM API + Exit Readiness Calculator

A comprehensive business solution combining a Flask-based CRM API with a professional Business Exit Readiness & Valuation Calculator.

## 🎯 Project Overview

This repository contains two main components:

### 1. CRM API (Backend)
A Flask-based REST API that handles:
- Lead collection and management
- Email notifications via SMTP
- Calculator assessment data storage
- Integration with GoHighLevel CRM

### 2. Exit Readiness Calculator (Frontend)
A React-based web application that:
- Assesses business exit readiness (0-100 score)
- Calculates estimated business valuation
- Generates professional PDF reports
- Captures and qualifies leads
- Provides personalized recommendations

## 📁 Repository Structure

```
happy-path-crm-api/
├── main.py                    # Flask backend API
├── requirements.txt           # Python dependencies
├── openapi.yaml              # API documentation
├── DEPLOYMENT.md             # Deployment guide
├── calculator/               # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── ...
│   ├── package.json
│   ├── README.md            # Calculator documentation
│   └── ...
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- SMTP email credentials

### Backend Setup

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables**
   ```bash
   export SMTP_USERNAME="your-email@gmail.com"
   export SMTP_PASSWORD="your-app-password"
   export EMAIL_TO="recipient@company.com"
   ```

3. **Run the API**
   ```bash
   python main.py
   ```
   API will be available at http://localhost:5000

### Frontend Setup

1. **Navigate to calculator directory**
   ```bash
   cd calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   App will be available at http://localhost:3000

## 📚 Documentation

- **[Calculator README](calculator/README.md)** - Detailed calculator documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[OpenAPI Spec](openapi.yaml)** - API documentation

## 🔌 API Endpoints

### Lead Management
- `POST /leads` - Submit new lead
- `POST /assessments` - Save calculator assessment
- `POST /send-results` - Send results email to user

### Example Request
```bash
curl -X POST http://localhost:5000/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "businessName": "Acme Corp",
    "source": "Exit Readiness Calculator"
  }'
```

## 🎨 Calculator Features

### Assessment Process
1. **Business Profile** - Contact info, industry, company size
2. **Financial Metrics** - Revenue, profitability, growth
3. **Systems & Transferability** - Processes, owner dependency
4. **Market Position** - Competition, retention, contracts

### Results Provided
- Exit Readiness Score (0-100)
- Estimated valuation range
- Category breakdowns
- Top 3 strengths
- Critical value gaps
- Personalized recommendations
- Professional PDF report

### Calculation Methodology
- Industry-adjusted revenue multiples (2x-6x)
- 20+ weighted business factors
- 4 core categories (Financial, Transferability, Market, Risk)
- Proprietary scoring algorithm

## 🔐 Security

- Environment variables for sensitive data
- CORS enabled for API
- Input validation on all endpoints
- HTTPS recommended for production
- Rate limiting recommended

## 📊 Lead Capture & CRM Integration

### Automatic Lead Tagging
Based on exit readiness score:
- **0-40**: "Needs Significant Work"
- **41-70**: "Good Foundation"
- **71-100**: "Exit Ready"

### GoHighLevel Integration
- Webhook support for automatic contact creation
- Custom field mapping
- Tag-based automation workflows
- Follow-up email sequences

## 🚀 Deployment

### Recommended Stack
- **Frontend**: Vercel
- **Backend**: Render
- **Domain**: Custom domain with SSL

### Quick Deploy

**Backend (Render):**
1. Connect GitHub repo
2. Set environment variables
3. Deploy from `main` branch

**Frontend (Vercel):**
```bash
cd calculator
vercel --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Backend
```bash
python -m pytest  # If tests are added
# or manual testing:
curl http://localhost:5000/
```

### Frontend
```bash
cd calculator
npm run build  # Test production build
npm run preview  # Preview production build
```

## 📈 Analytics & Tracking

Supports integration with:
- Google Analytics 4
- Facebook Pixel
- Custom event tracking
- Conversion tracking

## 🛠️ Customization

### Branding
- Update colors in `calculator/tailwind.config.js`
- Replace company name in headers/footers
- Customize email templates in `main.py`
- Add logo files to `calculator/public/`

### Calculations
- Adjust industry multipliers in `calculator/src/utils/calculations.js`
- Modify score weights
- Customize valuation formulas
- Update gap thresholds

### Content
- Landing page copy in `calculator/src/pages/LandingPage.jsx`
- Form questions in step components
- PDF report content in `calculator/src/utils/pdfGenerator.js`

## 🔄 Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and test**
   - Backend: Run `python main.py` and test endpoints
   - Frontend: Run `npm run dev` and test in browser

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature
   ```

4. **Deploy**
   - Merge to `main` branch
   - Automatic deployment via Vercel/Render webhooks

## 📝 Environment Variables

### Backend
```bash
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_TO=recipient@company.com
```

### Frontend
```bash
VITE_API_URL=http://localhost:5000
VITE_GOHIGHLEVEL_WEBHOOK_URL=https://webhook-url
```

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**
- Verify `flask-cors` is installed
- Check API URL in frontend .env

**Email Not Sending**
- Verify SMTP credentials
- Enable "App Passwords" for Gmail
- Check spam folder

**Build Errors**
- Delete `node_modules` and reinstall
- Check Node.js version (16+)
- Verify all environment variables set

## 📞 Support

For issues or questions:
- Check documentation in each component's README
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Check API spec in [openapi.yaml](openapi.yaml)

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

Built with:
- Flask & Flask-CORS
- React & Vite
- Tailwind CSS
- Recharts
- jsPDF
- Framer Motion

---

**Version**: 1.0.0
**Last Updated**: 2024-11-23
**Maintained by**: Happy Path Marketing
