# Deployment Guide - Business Exit Calculator

This guide walks you through deploying both the frontend calculator and backend API to production.

## 🎯 Deployment Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │────────▶│   Backend API    │
│   (Vercel)      │         │   (Render)       │
│   calculator.   │         │   api.           │
│   domain.com    │         │   domain.com     │
└─────────────────┘         └──────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│   User Browser  │         │   Email (SMTP)   │
└─────────────────┘         │   GoHighLevel    │
                            └──────────────────┘
```

## 📋 Pre-Deployment Checklist

- [ ] Domain name purchased (optional but recommended)
- [ ] SMTP email credentials ready (Gmail, SendGrid, etc.)
- [ ] GoHighLevel webhook URL (if using)
- [ ] GitHub repository created
- [ ] All sensitive data removed from code
- [ ] Environment variables documented

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Ensure requirements.txt is up to date**
   ```bash
   cd happy-path-crm-api
   cat requirements.txt
   ```
   Should include:
   ```
   Flask
   flask-cors
   ```

2. **Test locally**
   ```bash
   python main.py
   ```

### Step 2: Deploy to Render

1. **Sign up for Render** at https://render.com

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select the repository: `happy-path-crm-api`
   - Configure:
     - Name: `exit-calculator-api`
     - Environment: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `python main.py`

3. **Set Environment Variables** in Render Dashboard:
   ```
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_TO=recipient@yourcompany.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Note your API URL: `https://exit-calculator-api.onrender.com`

### Step 3: Test API

```bash
curl https://your-api-url.onrender.com/
# Should return: "Happy Path CRM API is live!"
```

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update API URL in code**
   ```bash
   cd calculator
   ```

2. **Create .env.production**
   ```
   VITE_API_URL=https://your-api-url.onrender.com
   VITE_GOHIGHLEVEL_WEBHOOK_URL=your-webhook-url
   ```

3. **Test build locally**
   ```bash
   npm run build
   npm run preview
   ```

4. **Customize branding** (if not done yet):
   - Company name in footer
   - Contact information
   - Calendar booking link
   - Logo files

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd calculator
   vercel
   ```

   Follow prompts:
   - Setup and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `exit-readiness-calculator`
   - Directory? `./` (current directory)
   - Override settings? **N**

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-api-url.onrender.com
     VITE_GOHIGHLEVEL_WEBHOOK_URL=your-webhook-url
     ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Your calculator is now live!**
   - URL: `https://exit-readiness-calculator.vercel.app`
   - Or your custom domain

## 🌐 Custom Domain Setup

### For Frontend (Vercel)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain: `calculator.yourdomain.com`

2. **Update DNS Records**
   Add CNAME record in your domain registrar:
   ```
   Type: CNAME
   Name: calculator
   Value: cname.vercel-dns.com
   ```

3. **Wait for SSL**
   - Vercel automatically provisions SSL
   - Usually takes 1-2 minutes

### For Backend (Render)

1. **Add Custom Domain in Render**
   - Go to your web service
   - Settings → Custom Domain
   - Add: `api.yourdomain.com`

2. **Update DNS**
   Add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: [provided by Render]
   ```

3. **Update Frontend .env**
   ```
   VITE_API_URL=https://api.yourdomain.com
   ```

4. **Redeploy frontend**
   ```bash
   vercel --prod
   ```

## 📧 Email Configuration

### Option 1: Gmail (Simple)

1. **Enable 2-Factor Authentication** on your Google account

2. **Generate App Password**
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other"
   - Copy the 16-character password

3. **Set in Render**
   ```
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_TO=leads@yourcompany.com
   ```

### Option 2: SendGrid (Scalable)

1. **Sign up** at https://sendgrid.com

2. **Create API Key**
   - Settings → API Keys → Create API Key
   - Full Access permissions

3. **Update main.py** to use SendGrid:
   ```python
   # Replace SMTP code with SendGrid
   from sendgrid import SendGridAPIClient
   from sendgrid.helpers.mail import Mail

   # Use SENDGRID_API_KEY environment variable
   ```

4. **Set in Render**
   ```
   SENDGRID_API_KEY=your-api-key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_TO=leads@yourcompany.com
   ```

## 🔗 GoHighLevel Integration

### Step 1: Create Webhook in GoHighLevel

1. **Login to GoHighLevel**

2. **Create Custom Webhook**
   - Settings → Integrations → Webhooks
   - Create New Webhook
   - Copy webhook URL

3. **Configure Webhook to Create Contact**
   - Trigger: Incoming Webhook
   - Action: Create/Update Contact
   - Map fields:
     ```
     name → Full Name
     email → Email
     phone → Phone
     tag → Custom Field (score-based tag)
     ```

### Step 2: Set Up Automation

Create 3 workflows based on tags:

1. **"Needs Significant Work" Tag** (Score 0-40)
   - Email Day 1: Education sequence
   - Email Day 3: Case study
   - Email Day 7: Free audit offer

2. **"Good Foundation" Tag** (Score 41-70)
   - Email Day 1: Congratulations + gaps focus
   - Email Day 4: Success story
   - Email Day 10: Consultation offer

3. **"Exit Ready" Tag** (Score 71-100)
   - Email Day 1: "Ready to talk buyers?"
   - Email Day 3: Market timing
   - Email Day 7: Premium service intro

### Step 3: Add Webhook to App

Update calculator `.env`:
```
VITE_GOHIGHLEVEL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
```

Redeploy frontend.

## 📊 Analytics Setup

### Google Analytics

1. **Create GA4 Property**
   - analytics.google.com
   - Create Property
   - Copy Measurement ID (G-XXXXXXXXXX)

2. **Add to Frontend**

   Install package:
   ```bash
   npm install react-ga4
   ```

   Update `src/main.jsx`:
   ```javascript
   import ReactGA from 'react-ga4'

   ReactGA.initialize('G-XXXXXXXXXX')
   ```

3. **Track Events**
   ```javascript
   // Track calculator start
   ReactGA.event({
     category: 'Calculator',
     action: 'Started Assessment'
   })

   // Track completion
   ReactGA.event({
     category: 'Calculator',
     action: 'Completed Assessment',
     label: `Score: ${score}`
   })
   ```

### Facebook Pixel (Optional)

1. **Create Pixel** in Facebook Events Manager

2. **Add to `index.html`**
   ```html
   <script>
     !function(f,b,e,v,n,t,s)
     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
     n.queue=[];t=b.createElement(e);t.async=!0;
     t.src=v;s=b.getElementsByTagName(e)[0];
     s.parentNode.insertBefore(t,s)}(window, document,'script',
     'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', 'YOUR_PIXEL_ID');
     fbq('track', 'PageView');
   </script>
   ```

3. **Track Conversions**
   ```javascript
   // After assessment completion
   fbq('track', 'Lead', {
     value: estimatedValue,
     currency: 'USD'
   })
   ```

## 🔒 Security Hardening

### Backend Security

1. **Rate Limiting**
   ```bash
   pip install flask-limiter
   ```

   Update `main.py`:
   ```python
   from flask_limiter import Limiter

   limiter = Limiter(app, key_func=get_remote_address)

   @app.route('/leads', methods=['POST'])
   @limiter.limit("10 per minute")
   def collect_lead():
       # ...
   ```

2. **Input Validation**
   ```python
   from flask import request, abort

   @app.before_request
   def validate_json():
       if request.method == 'POST':
           if not request.is_json:
               abort(400, 'Content-Type must be application/json')
   ```

3. **HTTPS Only**
   - Render provides automatic HTTPS
   - Force redirect in `main.py`:
   ```python
   @app.before_request
   def before_request():
       if not request.is_secure and os.getenv('FLASK_ENV') == 'production':
           return redirect(request.url.replace('http://', 'https://'))
   ```

### Frontend Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use VITE_ prefix for public variables
   - Store sensitive keys backend-only

2. **CSP Headers**
   Add to `index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net">
   ```

## 🧪 Post-Deployment Testing

### Automated Tests

Run through this checklist:

- [ ] Visit landing page
- [ ] Click "Start Assessment"
- [ ] Complete all 4 steps
- [ ] Verify score calculation
- [ ] Download PDF report
- [ ] Check email received (both admin and user)
- [ ] Verify GoHighLevel contact created
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Check all analytics firing

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API endpoint
ab -n 100 -c 10 https://your-api.onrender.com/
```

## 📈 Monitoring

### Uptime Monitoring

1. **UptimeRobot** (Free)
   - Create account at uptimerobot.com
   - Add monitors for:
     - Frontend: `https://calculator.yourdomain.com`
     - Backend: `https://api.yourdomain.com`
   - Set up email/SMS alerts

### Error Tracking

1. **Sentry** (Recommended)

   Frontend:
   ```bash
   npm install @sentry/react
   ```

   ```javascript
   import * as Sentry from "@sentry/react"

   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production"
   })
   ```

2. **Backend Logging**
   ```python
   import logging

   logging.basicConfig(
       filename='app.log',
       level=logging.INFO,
       format='%(asctime)s %(levelname)s: %(message)s'
   )
   ```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Vercel CLI
        run: npm install --global vercel
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🆘 Troubleshooting

### Common Issues

**Issue**: API calls return CORS errors
- **Fix**: Verify CORS is enabled in `main.py`
- Check `VITE_API_URL` is correct in frontend

**Issue**: Emails not sending
- **Fix**: Check SMTP credentials
- Test with: `python -m smtplib`
- Verify less secure apps enabled (Gmail)

**Issue**: PDF download fails
- **Fix**: Check browser console
- Verify jsPDF loaded correctly
- Test in incognito mode

**Issue**: Build fails on Vercel
- **Fix**: Check build logs
- Verify all dependencies in package.json
- Test `npm run build` locally

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ✅ Post-Launch Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API responding
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] Emails sending successfully
- [ ] GoHighLevel integration working
- [ ] Analytics tracking
- [ ] Uptime monitoring active
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on system

**Congratulations! Your Exit Readiness Calculator is now live! 🎉**

For ongoing support, monitor your analytics and gradually optimize based on user behavior and conversion rates.
