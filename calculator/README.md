# Business Exit Readiness & Valuation Calculator

A professional, interactive web application that assesses service-based businesses and provides instant exit readiness scores with estimated valuation ranges. Built as a high-value lead magnet for business exit consultants.

## 🎯 Features

### Core Functionality
- **Multi-Step Assessment**: 4-step questionnaire covering business profile, financials, systems, and market position
- **Exit Readiness Score**: 0-100 score based on 20+ weighted factors across 4 categories
- **Valuation Estimate**: Industry-adjusted revenue multiple methodology
- **Gap Analysis**: Identifies top 3 strengths and critical value gaps
- **Personalized Recommendations**: Actionable strategies to increase business value
- **Professional PDF Report**: Comprehensive, branded report with all findings
- **Lead Capture**: Integrated with backend CRM for lead management

### User Experience
- Modern, professional design with Tailwind CSS
- Smooth animations with Framer Motion
- Fully responsive (mobile, tablet, desktop)
- Progress tracking throughout assessment
- Interactive visualizations with Recharts
- Instant results calculation

### Technical Features
- React 18 with functional components and hooks
- Vite for fast development and optimized builds
- API integration ready (leads, assessments, email)
- Environment variable configuration
- PDF generation with jsPDF
- Form validation and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for backend API)
- SMTP credentials for email functionality

### Installation

1. **Clone the repository**
   ```bash
   cd happy-path-crm-api/calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the calculator directory:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_GOHIGHLEVEL_WEBHOOK_URL=your_webhook_url_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

5. **Start backend API** (in separate terminal)
   ```bash
   cd ..
   python main.py
   ```
   The API will run on http://localhost:5000

## 📁 Project Structure

```
calculator/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ProgressBar.jsx
│   │   ├── Step1Profile.jsx
│   │   ├── Step2Financial.jsx
│   │   ├── Step3Systems.jsx
│   │   └── Step4Market.jsx
│   ├── pages/             # Page components
│   │   ├── LandingPage.jsx
│   │   ├── CalculatorPage.jsx
│   │   └── ResultsPage.jsx
│   ├── utils/             # Utilities
│   │   ├── calculations.js    # Valuation & scoring logic
│   │   ├── pdfGenerator.js    # PDF report generation
│   │   └── api.js             # API integration
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🧮 Calculation Methodology

### Exit Readiness Score (0-100)
Weighted across 4 categories:
- **Financial Health (30%)**: Revenue size, profitability, growth rate
- **Transferability (30%)**: Systems, owner dependency, management team
- **Market Position (20%)**: Competitive advantage, customer retention
- **Risk Management (20%)**: Customer concentration, recurring revenue, contracts

### Valuation Calculation
```
Base Valuation = Annual Revenue × Industry Multiple

Industry multiples range from 2x-6x for service businesses, adjusted by:
- EBITDA margin (higher is better)
- Growth rate (20%+ adds 0.5-1.5x)
- Owner dependency (high reduces by 1-2x)
- Recurring revenue (70%+ adds 0.5-1x)
- Process documentation (strong adds 0.25-0.5x)
- Customer concentration (>30% from one client reduces by 0.5x)
```

## 🎨 Customization

### Branding
1. Update colors in `tailwind.config.js`
2. Replace company name in footer and headers
3. Add your logo to `public/` directory
4. Update contact information in PDF generator

### Calculation Logic
Adjust multipliers and weights in `src/utils/calculations.js`:
- Industry multipliers
- Score weights
- Valuation adjustments
- Gap thresholds

### Content
- Landing page copy: `src/pages/LandingPage.jsx`
- Form questions: Individual step components
- Email templates: `main.py` backend

## 🔌 API Integration

### Endpoints Used
```
POST /leads              - Submit lead information
POST /assessments        - Save assessment data
POST /send-results       - Send results email to user
```

### GoHighLevel CRM Webhook
Set up webhook in your GoHighLevel account and add URL to `.env`:
```javascript
// Automatic lead tagging based on score
0-40: "Needs Significant Work"
41-70: "Good Foundation"
71-100: "Exit Ready"
```

## 📊 Lead Follow-Up Sequences

Recommended email sequences based on score:

**Low Score (0-40)**
- Day 1: Education on increasing business value
- Day 3: Case study of similar transformation
- Day 7: Offer free audit call

**Medium Score (41-70)**
- Day 1: Congratulations + focus on gaps
- Day 4: Success stories
- Day 10: Limited-time consultation offer

**High Score (71-100)**
- Day 1: "Ready for exit?" message
- Day 3: Market timing insights
- Day 7: Buyer introduction service

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

#### Option 3: Custom Domain
1. Build the app: `npm run build`
2. Upload `dist/` contents to your web server
3. Configure HTTPS and domain
4. Set environment variables on server

## 🔒 Security Notes

- Never commit API keys or credentials
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Validate all user inputs
- Rate limit API endpoints
- Sanitize data before database storage

## 📝 Environment Variables

Required for full functionality:

```bash
# Frontend (.env in calculator/)
VITE_API_URL=https://your-api-domain.com
VITE_GOHIGHLEVEL_WEBHOOK_URL=https://your-webhook-url

# Backend (set in hosting environment)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAIL_TO=recipient@company.com
```

## 🧪 Testing Checklist

- [ ] All form steps validate correctly
- [ ] Calculations produce accurate results
- [ ] PDF downloads successfully
- [ ] Email notifications send
- [ ] CRM webhook triggers
- [ ] Mobile responsive on all devices
- [ ] Browsers: Chrome, Firefox, Safari, Edge
- [ ] Error handling works
- [ ] Loading states display properly
- [ ] Analytics tracking fires

## 🎯 Conversion Optimization Tips

1. **A/B Test Headlines**: Try different value propositions
2. **Social Proof**: Add more testimonials with photos
3. **Urgency**: "Limited spots available this month"
4. **Video**: Add explainer video to landing page
5. **Exit Intent**: Popup offering report when user tries to leave
6. **Retargeting**: Pixel for Facebook/Google ads
7. **Follow-up**: Automated email sequence
8. **Calendar Integration**: Direct booking from results page

## 🐛 Troubleshooting

### Issue: API calls failing
- Check VITE_API_URL in .env
- Verify backend is running
- Check browser console for CORS errors

### Issue: PDF not generating
- Check browser console for jsPDF errors
- Verify all required data is present
- Test in different browsers

### Issue: Emails not sending
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure app access" (Gmail) or use app-specific password

### Issue: Calculator shows wrong values
- Clear browser cache
- Check calculations.js for formula errors
- Verify input data types (number vs string)

## 📞 Support

For issues or questions:
- Email: support@yourcompany.com
- Documentation: https://docs.yourcompany.com
- GitHub Issues: https://github.com/yourcompany/calculator/issues

## 📄 License

Proprietary - All rights reserved

## 🙏 Credits

Built with:
- React
- Tailwind CSS
- Recharts
- Framer Motion
- jsPDF
- Vite

---

**Version**: 1.0.0
**Last Updated**: 2024-11-23
