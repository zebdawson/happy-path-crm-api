# Integration Guide
## Multi-Service Home Improvement Lead Generation System

This guide covers integrating your lead gen system with CRMs, email platforms, SMS services, and analytics tools.

---

## 🎯 INTEGRATION OVERVIEW

Your lead generation system needs to connect with:
1. **Form Handler** - Capture leads from website forms
2. **CRM** - Store and manage leads
3. **Email Service** - Automated email sequences
4. **SMS Service** - Text message follow-up
5. **Analytics** - Track conversions and ROI
6. **Call Tracking** - Attribute phone calls to sources

---

## 📋 FORM INTEGRATION OPTIONS

### Option 1: Formspree (Easiest - Recommended for Beginners)

**Setup Time:** 5 minutes
**Cost:** Free (50 submissions/mo), Pro $10/mo (1,000 submissions)

**Steps:**
1. Go to https://formspree.io
2. Sign up for free account
3. Click "New Form"
4. Name it (e.g., "Water Filtration Leads")
5. Copy the form endpoint URL
6. Update in your HTML:

```html
<!-- Before -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">

<!-- After -->
<form action="https://formspree.io/f/xpzgkjvw" method="POST">
```

**Features:**
- Email notifications instantly
- Stores all submissions
- Spam filtering
- Integrates with Zapier, Slack, etc.

**Repeat for each service** (4 forms total).

---

### Option 2: Basin (Similar to Formspree)

**Setup:** https://usebasin.com
**Cost:** Free (100 submissions/mo)

Same process as Formspree - create forms, get endpoints, update HTML.

---

### Option 3: Web3Forms (No Signup Required)

**Setup:** https://web3forms.com
**Cost:** Free (unlimited)

1. Get your access key from website
2. Update form:

```html
<form action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
    <!-- rest of form fields -->
</form>
```

---

### Option 4: Custom Backend

If you have a developer, create a custom endpoint:

**Example Node.js/Express:**
```javascript
app.post('/api/leads', async (req, res) => {
    const {firstName, lastName, email, phone, service} = req.body;

    // Save to database
    await db.leads.create({firstName, lastName, email, phone, service});

    // Send to CRM
    await crm.createContact({email, phone, tags: [service]});

    // Send notification
    await sendEmail({to: 'you@company.com', subject: 'New Lead!'});

    // Redirect to thank you page
    res.redirect(`/thank-you/${service}-thank-you.html`);
});
```

---

## 🗂️ CRM INTEGRATION

### Option 1: GoHighLevel (All-in-One - Recommended)

**Best For:** Managing leads, follow-up, appointments
**Cost:** $97/mo
**Includes:** CRM + Email + SMS + Calendar + Pipelines

**Setup:**
1. Create GoHighLevel account
2. Create custom field for "Service" (Water, Solar, Landscape, Security)
3. Set up 4 pipelines (one per service)
4. Connect forms via webhooks

**Webhook Integration:**
```javascript
// In your form, send data to GHL webhook
fetch('https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        tags: [formData.service]
    })
});
```

**Automation in GHL:**
- Trigger: New contact with tag "Water Filtration"
- Action 1: Send Email #1 (immediately)
- Wait: 1 day
- Action 2: Send Email #2
- Action 3: Send SMS reminder
- Etc.

---

### Option 2: HubSpot CRM

**Best For:** Enterprise, robust reporting
**Cost:** Free (basic CRM), Marketing Hub starts at $45/mo

**Setup:**
1. Create HubSpot account
2. Go to Settings → Marketing → Forms
3. Create embedded form
4. Copy embed code
5. Replace your current forms

**Or use Forms API:**
```javascript
fetch('https://api.hsforms.com/submissions/v3/integration/submit/PORTAL_ID/FORM_GUID', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        fields: [
            {name: 'firstname', value: formData.firstName},
            {name: 'lastname', value: formData.lastName},
            {name: 'email', value: formData.email},
            {name: 'phone', value: formData.phone},
        ]
    })
});
```

---

### Option 3: Salesforce

**Best For:** Large businesses, complex sales processes
**Cost:** Starts at $25/user/mo

**Web-to-Lead Setup:**
1. Go to Setup → Web-to-Lead
2. Create web form
3. Copy generated HTML
4. Replace form fields

---

### Option 4: Simple Spreadsheet (Start Here)

**Best For:** Testing before investing in CRM
**Cost:** Free

**Using Google Sheets + Zapier:**
1. Create Google Sheet with columns: Date, Name, Email, Phone, Service
2. Create Zapier account (free)
3. Set up Zap: Formspree → Google Sheets
4. Map fields
5. Test

---

## 📧 EMAIL MARKETING INTEGRATION

You have 20 pre-written email templates. Here's how to import them:

### Option 1: Mailchimp

**Cost:** Free (2,000 contacts), $13/mo (50,000 contacts)

**Setup:**
1. Create Mailchimp account
2. Create 4 audiences (or use tags): Water, Solar, Landscape, Security
3. Go to Automations → Create → Custom Customer Journey
4. Name: "Water Filtration Lead Nurture"
5. Trigger: "List/Tag added"
6. Add emails from `email-templates/all-email-sequences.html`

**Email Schedule:**
- Email 1: Immediately
- Email 2: Wait 1 day → Send
- Email 3: Wait 2 days → Send
- Email 4: Wait 2 days → Send
- Email 5: Wait 2 days → Send

**Connect to Forms:**
Use Mailchimp's embedded forms OR connect via Zapier:
- Trigger: New Formspree submission
- Action: Add to Mailchimp list

---

### Option 2: ConvertKit

**Cost:** Free (1,000 subscribers), $29/mo (3,000 subscribers)

**Setup:**
1. Create ConvertKit account
2. Go to Automations → Create Sequence
3. Name: "Water Filtration Sequence"
4. Add emails (copy from templates)
5. Set delays between emails
6. Create form or use API to add subscribers

**API Integration:**
```javascript
fetch('https://api.convertkit.com/v3/forms/FORM_ID/subscribe', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        api_key: 'YOUR_API_KEY',
        email: formData.email,
        first_name: formData.firstName,
        tags: [formData.service]
    })
});
```

---

### Option 3: ActiveCampaign

**Cost:** $29/mo (1,000 contacts)

**Best for:** Advanced automation, CRM + Email combined

**Setup:**
1. Create ActiveCampaign account
2. Create 4 automations
3. Import email templates
4. Connect forms via native integration or Zapier

---

### Option 4: Email in GoHighLevel

If you chose GHL for CRM, use their built-in email:
1. Go to Marketing → Emails
2. Create email templates from your copy
3. Add to workflows
4. Set triggers and delays

---

## 📱 SMS INTEGRATION

You have SMS templates ready in `email-templates/sms-templates.txt`

### Option 1: Twilio (Most Popular)

**Cost:** $1/mo per phone number + $0.0079 per SMS (very affordable)

**Setup:**
1. Create Twilio account: https://twilio.com
2. Buy phone number (get Phoenix area code: 480, 602, or 623)
3. Create messaging service
4. Get Account SID and Auth Token

**Send SMS via API:**
```javascript
// After form submission
const accountSid = 'YOUR_ACCOUNT_SID';
const authToken = 'YOUR_AUTH_TOKEN';
const client = require('twilio')(accountSid, authToken);

client.messages.create({
    body: `Hi ${firstName}! Your FREE water test is confirmed for ${date}. Reply YES to confirm or call: ${phone}`,
    from: '+14805551234', // Your Twilio number
    to: formData.phone
});
```

**Automation:**
Use Twilio Studio to create SMS workflows:
- Message 1: Send immediately
- Message 2: Wait 1 day, send
- Message 3: Wait 1 day before appointment, send
- Etc.

---

### Option 2: SimpleTexting

**Cost:** $29/mo (500 messages)

**Easier interface than Twilio:**
1. Create account: https://simpletexting.com
2. Get phone number
3. Create automated campaigns
4. Use templates from your SMS file

---

### Option 3: SMS in GoHighLevel

If using GHL:
1. SMS is included
2. Add SMS actions to workflows
3. Use templates
4. Two-way conversations (reply handling)

---

## 📊 ANALYTICS INTEGRATION

### Google Analytics 4

**Setup:**
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (format: G-XXXXXXXXXX)
3. Open `assets/js/analytics.js`
4. Update line 10:
```javascript
GA_MEASUREMENT_ID: 'G-ABC123XYZ', // Your actual ID
```

5. Uncomment GA4 script in each HTML file's `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ');
</script>
```

**Custom Events Already Set Up:**
- Form submissions
- Calculator usage
- Phone clicks
- Resource downloads
- Scroll depth

---

### Facebook Pixel

**Setup:**
1. Go to Facebook Events Manager
2. Create Pixel
3. Copy Pixel ID (e.g., 1234567890)
4. Update `assets/js/analytics.js` line 11:
```javascript
FB_PIXEL_ID: '1234567890', // Your actual Pixel ID
```

5. Uncomment FB Pixel code in HTML files

**Events Tracked:**
- PageView
- Lead (form submission)
- ViewContent
- Custom events (Calculator usage, etc.)

**Create Custom Conversions:**
In Facebook Events Manager:
- Lead → Water Filtration (URL contains water-filtration.html)
- Lead → Solar (URL contains solar.html)
- Etc.

---

### Call Tracking

**Recommended: CallRail**
**Cost:** $45/mo (unlimited calls)

**Setup:**
1. Create CallRail account
2. Buy tracking numbers (one per service recommended)
3. Set call forwarding to your real number
4. Replace numbers in HTML:

```html
<!-- Water page -->
<a href="tel:4805551234">(480) 555-1234</a> <!-- Tracking number -->

<!-- Solar page -->
<a href="tel:4805552345">(480) 555-2345</a> <!-- Different tracking number -->
```

**Benefits:**
- Know which page drove the call
- Record calls
- See which ads work
- Integration with Google Ads

**Alternative: Marchex, DialogTech**

---

## 🔗 ZAPIER INTEGRATIONS

Zapier connects everything together without code.

**Common Zaps:**

### Zap 1: Form → CRM
- Trigger: New Formspree submission
- Action: Create contact in HubSpot/Salesforce
- Action: Add to Google Sheets
- Action: Send Slack notification

### Zap 2: Form → Email Marketing
- Trigger: New form submission
- Action: Add to Mailchimp list
- Action: Tag with service type

### Zap 3: Form → SMS
- Trigger: New form submission
- Action: Send SMS via Twilio
- Action: Create reminder SMS (1 day delay)

### Zap 4: Call → CRM
- Trigger: New call (CallRail)
- Action: Create activity in CRM
- Action: Send notification

**Zapier Pricing:**
- Free: 100 tasks/mo (5 Zaps)
- Starter: $19.99/mo (750 tasks, unlimited Zaps)

---

## 🗓️ CALENDAR/SCHEDULING INTEGRATION

### Calendly

**Free for 1 event type**

**Setup:**
1. Create Calendly account
2. Set availability
3. Get embed code
4. Add to thank you pages:

```html
<!-- In thank-you pages -->
<div class="calendly-inline-widget"
     data-url="https://calendly.com/yourname/water-consultation"
     style="min-width:320px;height:630px;">
</div>
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

**Replace placeholder in:**
- water-thank-you.html
- solar-thank-you.html
- landscaping-thank-you.html
- security-thank-you.html

### Alternatives:
- **Acuity Scheduling** ($16/mo)
- **ScheduleOnce** ($10/user/mo)
- **GoHighLevel Calendar** (if using GHL)

---

## 💳 PAYMENT PROCESSING (Optional)

For collecting deposits or down payments:

### Stripe

**Setup:**
1. Create Stripe account
2. Get publishable & secret keys
3. Add payment form to pages

```html
<script src="https://js.stripe.com/v3/"></script>
<button id="checkout-button">Pay Deposit - $99</button>

<script>
const stripe = Stripe('pk_test_YOUR_KEY');
document.getElementById('checkout-button').addEventListener('click', () => {
    stripe.redirectToCheckout({
        lineItems: [{price: 'price_XXXXX', quantity: 1}],
        mode: 'payment',
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/cancel',
    });
});
</script>
```

---

## 🧪 TESTING YOUR INTEGRATIONS

### Test Checklist:

**Forms:**
- [ ] Submit test lead from each service page
- [ ] Verify email notification received
- [ ] Check lead appears in CRM
- [ ] Confirm email sequence triggers
- [ ] Verify SMS sent (if configured)
- [ ] Check analytics event fires

**Phone Tracking:**
- [ ] Call each tracking number
- [ ] Verify it forwards correctly
- [ ] Check call logging in CallRail

**Emails:**
- [ ] Receive Email #1 immediately
- [ ] Receive Email #2 after delay (1 day)
- [ ] Check all links work
- [ ] Test on mobile device

**Analytics:**
- [ ] Check GA4 real-time reports
- [ ] Verify Facebook Pixel (use Pixel Helper extension)
- [ ] Test conversion tracking

---

## 🚨 COMMON ISSUES & SOLUTIONS

### "Forms not submitting"
- Check form action URL
- Verify Formspree/form service is active
- Check browser console for JavaScript errors
- Disable ad blockers (can block form services)

### "Not receiving email notifications"
- Check spam folder
- Verify email address in form service settings
- Test with different email provider

### "Leads not appearing in CRM"
- Verify Zapier is turned ON (not paused)
- Check Zap history for errors
- Confirm API keys are correct
- Test API connection

### "Analytics not tracking"
- Verify Measurement ID is correct
- Check that scripts are loaded (view page source)
- Disable ad blockers
- Wait 24-48 hours for data to appear

---

## 📊 RECOMMENDED TECH STACK BY BUDGET

### Budget: $0-50/mo (Startup)
- Forms: **Formspree** (free)
- CRM: **Google Sheets** + Zapier (free + $20/mo)
- Email: **Mailchimp** (free)
- SMS: **Twilio** (~$10/mo)
- Analytics: **Google Analytics** (free)
- Total: **~$30/mo**

### Budget: $100-200/mo (Small Business)
- Forms: **Formspree Pro** ($10/mo)
- CRM: **GoHighLevel** ($97/mo) [includes email + SMS]
- Analytics: **Google Analytics** (free)
- Call Tracking: **CallRail** ($45/mo)
- Total: **~$152/mo**

### Budget: $500+/mo (Scaling)
- Forms: Custom backend
- CRM: **Salesforce** or **HubSpot Pro**
- Email: **ActiveCampaign** ($290/mo for 10K contacts)
- SMS: **Twilio** (volume pricing)
- Call Tracking: **CallRail Pro**
- Total: **$500-1000/mo** (scales with volume)

---

## 🎯 QUICK START RECOMMENDATION

**For Les (starting from zero):**

1. **Week 1:** Forms + CRM
   - Set up Formspree (5 min)
   - Connect to Google Sheets via Zapier (10 min)
   - Test all 4 service forms

2. **Week 2:** Email Marketing
   - Set up Mailchimp (free)
   - Import email templates
   - Create 4 sequences
   - Connect to forms

3. **Week 3:** SMS
   - Get Twilio account
   - Buy phone number
   - Set up first SMS sequence (water)
   - Test

4. **Week 4:** Analytics & Optimization
   - Install GA4
   - Install FB Pixel
   - Start running ads
   - Track conversions

**Total Cost:** ~$30/mo to start
**Time to Launch:** 1 week minimum

---

## 📞 NEED HELP?

**Documentation:**
- Formspree: https://formspree.io/docs
- Mailchimp: https://mailchimp.com/help
- Zapier: https://zapier.com/learn
- Twilio: https://twilio.com/docs

**Video Tutorials:**
Search YouTube for:
- "Formspree setup"
- "Mailchimp email automation"
- "Zapier for beginners"
- "GoHighLevel tutorial"

---

**Good luck with your integrations! 🚀**
