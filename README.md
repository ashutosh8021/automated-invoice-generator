# 🧾 Automated Invoice Generator

<div align="center">

![Invoice Generator](https://img.shields.io/badge/Invoice-Generator-blue)
![Angular](https://img.shields.io/badge/Angular-17-red)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**🚀 [Live Demo](https://automated-invoice-generator80.netlify.app/) 🚀**

*A modern, full-stack invoice generation application that helps businesses create professional invoices with ease.*

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Live Demo](#-live-demo)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Detailed Setup](#-detailed-setup)
- [💼 Usage Guide](#-usage-guide)
- [🏗️ Project Structure](#️-project-structure)
- [🎨 Screenshots](#-screenshots)
- [🔧 Configuration](#-configuration)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🏢 **Company Branding**
- **Customizable Company Information**: Add your business name, address, phone, email, and website
- **Professional Invoice Headers**: Your branding appears on all invoices and PDFs
- **Real-time Preview**: See how your company information looks before saving

### 👥 **Client Management**
- **Complete Client Profiles**: Store client names, emails, addresses, and contact details
- **Easy Client Selection**: Quick client lookup when creating invoices
- **Client History**: View all invoices for each client

### 📄 **Invoice Creation**
- **Professional Invoice Design**: Clean, modern invoice layout
- **Itemized Billing**: Add multiple items with descriptions, quantities, and prices
- **Automatic Calculations**: Total amounts calculated automatically
- **Indian Currency Support**: All amounts displayed in rupees (₹)

### 📱 **PDF Generation**
- **High-Quality PDFs**: Generate professional PDF invoices
- **Company Branding**: Your business information prominently displayed
- **Downloadable**: Save PDFs locally or share with clients
- **Professional Layout**: Clean, print-ready design

### 🎨 **Modern Interface**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Bootstrap 5 UI**: Modern, clean interface
- **Intuitive Navigation**: Easy-to-use dashboard and navigation
- **Real-time Updates**: Live data updates without page refresh

### 🔐 **Data Management**
- **Supabase Integration**: Secure, cloud-based database
- **Real-time Sync**: Data synced across all devices
- **Local Storage**: Company settings saved locally
- **Data Persistence**: All your data is safely stored

---

## 🎯 Live Demo

**🌐 [Try it live: https://automated-invoice-generator80.netlify.app/](https://automated-invoice-generator80.netlify.app/)**

### Quick Demo Steps:
1. Visit the live demo
2. Go to **Settings → Company Settings** to add your business info
3. Navigate to **Dashboard** to add clients
4. Create your first invoice and download as PDF!

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center"><strong>Frontend</strong></td>
<td align="center"><strong>Backend</strong></td>
<td align="center"><strong>Database</strong></td>
<td align="center"><strong>Deployment</strong></td>
</tr>
<tr>
<td>

- **Angular 17**
- **TypeScript**
- **Bootstrap 5**
- **RxJS**
- **HTML5/CSS3**
- **Font Awesome**

</td>
<td>

- **Spring Boot 3**
- **Java 17**
- **Maven**
- **Spring Data JPA**
- **Spring Web**
- **CORS Support**

</td>
<td>

- **Supabase**
- **PostgreSQL**
- **Real-time DB**
- **Row Level Security**
- **Cloud Hosted**

</td>
<td>

- **Netlify** (Frontend)
- **Railway** (Backend)
- **Automatic Deploys**
- **Custom Domain**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Java 17** - [Download](https://adoptium.net/)
- **Maven 3.6+** - [Download](https://maven.apache.org/)

### 🔥 Super Quick Setup (5 minutes)

1. **Clone & Install**
   ```bash
   git clone https://github.com/ashutosh8021/automated-invoice-generator.git
   cd automated-invoice-generator/frontend
   npm install
   ```

2. **Setup Database**
   - Create account at [Supabase](https://supabase.com)
   - Create new project
   - Copy `FRESH_SUPABASE_SCHEMA.sql` content to SQL Editor and run it

3. **Configure Environment**
   ```bash
   # In frontend/src/environments/
   cp environment.example.ts environment.ts
   # Add your Supabase URL and API key
   ```

4. **Run Application**
   ```bash
   npm start
   ```

**🎉 That's it! Visit `http://localhost:4200` and start creating invoices!**

---

## 📖 Detailed Setup

### 🗄️ Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and set project details

2. **Setup Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy entire content from `FRESH_SUPABASE_SCHEMA.sql`
   - Paste and click "RUN"

3. **Get Credentials**
   - Go to Settings → API
   - Copy your `Project URL` and `anon public key`

### ⚙️ Environment Configuration

1. **Frontend Environment**
   ```bash
   cd frontend/src/environments
   cp environment.example.ts environment.ts
   cp environment.prod.example.ts environment.prod.ts
   ```

2. **Update environment.ts**
   ```typescript
   export const environment = {
     production: false,
     supabaseUrl: 'YOUR_SUPABASE_URL',
     supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
     companyName: 'Your Company Name',
     companyAddress: 'Your Address',
     companyPhone: 'Your Phone',
     companyEmail: 'your@email.com',
     companyWebsite: 'www.yoursite.com'
   };
   ```

### 🚀 Running the Application

**Backend Server:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend Server:**
```bash
cd frontend
npm install
npm start
```

**Access Application:**
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080`

---

## 💼 Usage Guide

### 🏢 **1. Setup Company Information**
- Navigate to **Settings → Company Settings**
- Fill in your business details
- See real-time preview
- Click **Save Settings**

### 👥 **2. Add Clients**
- Go to **Dashboard**
- Click **"Add New Client"**
- Enter client details
- Save client information

### 📄 **3. Create Invoice**
- From **Dashboard**, click **"Create Invoice"**
- Select client from dropdown
- Add invoice items:
  - Description
  - Quantity
  - Rate (₹)
- Review total amount
- Click **"Save Invoice"**

### 📱 **4. Generate PDF**
- Open any invoice from **Invoices** list
- Click **"Download PDF"**
- Professional PDF with your branding will download

### 📊 **5. Manage Data**
- **Edit Clients**: Update client information anytime
- **Edit Invoices**: Modify invoice details
- **Delete Records**: Remove unwanted data
- **View History**: Browse all invoices by client

---

## 🏗️ Project Structure

```
automated-invoice-generator/
├── 📁 frontend/                    # Angular Application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 components/      # UI Components
│   │   │   │   ├── 📁 dashboard/   # Main dashboard
│   │   │   │   ├── 📁 invoice-form/    # Invoice creation
│   │   │   │   ├── 📁 invoice-list/    # Invoice listing
│   │   │   │   ├── 📁 invoice-view/    # Invoice details
│   │   │   │   ├── 📁 client-form/     # Client form
│   │   │   │   ├── 📁 client-list/     # Client listing
│   │   │   │   ├── 📁 company-settings/ # Business settings
│   │   │   │   └── 📁 navbar/          # Navigation
│   │   │   ├── 📁 services/        # API Services
│   │   │   │   ├── 📄 client.service.ts
│   │   │   │   ├── 📄 invoice.service.ts
│   │   │   │   ├── 📄 pdf.service.ts
│   │   │   │   └── 📄 supabase.service.ts
│   │   │   ├── 📁 models/          # Data Models
│   │   │   │   ├── 📄 client.model.ts
│   │   │   │   └── 📄 invoice.model.ts
│   │   │   └── 📄 app.module.ts
│   │   ├── 📁 environments/        # Config Files
│   │   └── 📄 styles.css          # Global Styles
│   ├── 📄 package.json
│   └── 📄 angular.json
├── 📁 backend/                     # Spring Boot API
│   └── 📁 src/main/
│       ├── 📁 java/com/invoiceapp/
│       │   ├── 📁 controller/      # REST Controllers
│       │   ├── 📁 service/         # Business Logic
│       │   ├── 📁 entity/          # JPA Entities
│       │   ├── 📁 repository/      # Data Access
│       │   └── 📁 config/          # Configuration
│       └── 📁 resources/
├── 📄 FRESH_SUPABASE_SCHEMA.sql   # Database Schema
└── 📄 README.md                   # Documentation
```

---

## 🎨 Screenshots

### 🏠 **Dashboard**
*Clean, intuitive dashboard with quick access to all features*

### 📄 **Invoice Creation**
*Professional invoice form with real-time calculations*

### 📱 **PDF Generation**
*High-quality PDF output with company branding*

### ⚙️ **Company Settings**
*Easy-to-use settings panel for business customization*

---

## 🔧 Configuration

### 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `supabaseUrl` | Your Supabase project URL | ✅ |
| `supabaseKey` | Supabase anon public key | ✅ |
| `companyName` | Your business name | ❌ |
| `companyAddress` | Business address | ❌ |
| `companyPhone` | Contact phone | ❌ |
| `companyEmail` | Business email | ❌ |
| `companyWebsite` | Company website | ❌ |

### 🎨 Customization

**Colors & Branding:**
- Edit `src/styles.css` for global styling
- Modify component CSS files for specific components
- Update favicon and assets in `src/assets/`

**Features:**
- Add new invoice fields in models
- Extend PDF template in `pdf.service.ts`
- Create additional client fields

---

## 🚀 Deployment

### 📡 **Frontend (Netlify)**

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist/invoice-frontend`

### 🖥️ **Backend (Railway/Heroku)**

1. **Prepare for Deployment**
   ```bash
   cd backend
   mvn clean package
   ```

2. **Deploy**
   - Connect repository to hosting platform
   - Set Java 17 runtime
   - Configure environment variables

### 🔗 **Live Links**
- **Frontend**: [https://automated-invoice-generator80.netlify.app/](https://automated-invoice-generator80.netlify.app/)
- **Backend**: Configured for production API

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
- Use GitHub Issues
- Include steps to reproduce
- Provide environment details

### 💡 **Feature Requests**
- Describe the feature
- Explain use case
- Provide mockups if possible

### 🔧 **Development**

1. **Fork the Repository**
   ```bash
   git fork https://github.com/ashutosh8021/automated-invoice-generator.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Submit Pull Request**
   - Describe changes made
   - Include screenshots for UI changes
   - Reference related issues

---

## 📞 Support

### 🆘 **Need Help?**
- 📧 **Email**: Create an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions
- 📖 **Documentation**: Check this README

### 🐛 **Found a Bug?**
Please create an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

### 💡 **Feature Ideas?**
We'd love to hear them! Create a feature request issue.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📝 **What this means:**
- ✅ Use commercially
- ✅ Modify freely
- ✅ Distribute
- ✅ Private use
- ❌ No liability
- ❌ No warranty

---

## 🎉 Acknowledgments

### 🙏 **Built With Love Using:**
- **Angular Team** - Amazing frontend framework
- **Spring Boot** - Powerful backend framework
- **Supabase** - Excellent database platform
- **Bootstrap** - Beautiful UI components
- **Font Awesome** - Great icons
- **jsPDF** - PDF generation library

### 🌟 **Special Thanks To:**
- Open source community
- All contributors
- Users providing feedback

---

## 👨‍💻 Author

<div align="center">

### **Ashutosh Kumar**
🎓 *Bachelor's in Computer Science at IIT Patna*

[![Email](https://img.shields.io/badge/Email-ashutoshkumarr802152%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:ashutoshkumarr802152@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-ashutosh8021-black?style=for-the-badge&logo=github)](https://github.com/ashutosh8021)
[![IIT Patna](https://img.shields.io/badge/IIT-Patna-orange?style=for-the-badge&logo=academia)](https://www.iitp.ac.in/)

*"Building innovative solutions to make business operations easier and more efficient."*

📧 **Contact**: ashutoshkumarr802152@gmail.com  
🏫 **Institution**: Indian Institute of Technology Patna  
💼 **Focus**: Full-Stack Development, Web Applications

</div>

---

<div align="center">

### 🚀 **Ready to get started?**

**[🌐 Try Live Demo](https://automated-invoice-generator80.netlify.app/)** | **[⭐ Star on GitHub](https://github.com/ashutosh8021/automated-invoice-generator)** | **[🍴 Fork Project](https://github.com/ashutosh8021/automated-invoice-generator/fork)**

---

**Made with ❤️ for businesses everywhere**

*Happy Invoicing! 📄💰*

</div>
