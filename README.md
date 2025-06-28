# Personal Finance Tracker 💰

A comprehensive, privacy-focused personal finance tracker with **recurring bills**, **dynamic currency support**, and **modern UX features**. Built with Next.js, SQLite, and Prisma for complete local control of your financial data.

## ✨ New Features (v1.2.0)

### 🌏 **Dynamic Currency System**
- **10 Supported Currencies**: USD, EUR, GBP, JPY, PHP, AUD, CAD, CHF, CNY, INR
- **Real-time Switching**: Change currency instantly with live UI updates
- **Smart Formatting**: Proper currency symbols and decimal handling
- **Currency Indicator**: Always visible in navigation bar

### 🔁 **Recurring Bills Management**
- **Bill Templates**: Create templates for monthly recurring bills
- **Auto-Generation**: Generate next month's bills with one click
- **Smart Scheduling**: Handles month-end dates (31st → 30th/28th)
- **Visual Indicators**: See which bills are recurring vs one-time
- **Flexible Control**: Pause/activate templates as needed

### 🎨 **Dark Mode & Themes**
- **Three Modes**: Light, Dark, and System (auto-detection)
- **Smooth Transitions**: Beautiful theme switching animations
- **Complete Coverage**: All components optimized for dark mode
- **System Integration**: Follows your OS theme preferences

### 🚀 **Welcome Wizard**
- **Guided Onboarding**: Step-by-step setup for new users
- **Personalization**: Set name, currency, and default tax rate
- **Privacy Education**: Learn about local-first approach
- **Smart Detection**: Only shows for first-time users

### ⌨️ **Keyboard Shortcuts**
- **Navigation**: `g` + `d/b/i/a/e/s` (Dashboard/Bills/Income/Analytics/Export/Settings)
- **Quick Actions**: `n` + `b/i` (New Bill/Income)
- **Help**: `?` (Show all shortcuts)
- **Visual Feedback**: See shortcut sequences as you type

### 💱 **Enhanced Tax Calculations**
- **Percentage-Based**: Enter tax as percentage, not fixed amount
- **Real-time Preview**: See gross, tax, and net amounts instantly
- **Smart Defaults**: Uses your configured default tax rate
- **Tax Insights**: View average tax rates and total deductions

---

## 📈 Core Features

### 📄 **Dashboard**
- Monthly financial overview with key metrics
- Personalized greetings and smart tips
- Financial health scoring and insights
- Recent activity feed with status updates
- Quick action shortcuts to main features

### 💵 **Bill Management**
- Add, edit, delete bills with full CRUD operations
- One-click payment status toggle (Paid/Unpaid)
- Automatic overdue detection based on due dates
- Category organization with filtering
- Search across names, categories, and remarks
- Visual status indicators with color coding
- Recurring bill templates with auto-generation

### 💰 **Income Tracking**
- Record income from multiple sources
- Percentage-based tax calculations with preview
- Gross and net amount tracking
- Category-based organization (Salary, Freelance, etc.)
- Tax deduction summaries and insights
- Search and filter capabilities

### 📈 **Analytics & Insights**
- Month-over-month comparison charts
- Category breakdown for bills and income
- Financial ratios and health indicators
- Visual progress bars and trends
- Income coverage analysis
- Tax rate insights and averages

### 📤 **Data Export**
- Export to JSON (complete data) or CSV (spreadsheet)
- Current month or all-time data options
- Privacy-focused local downloads only
- Backup and restore capabilities
- Settings export for easy migration

### ⚙️ **Settings & Customization**
- **Currency**: Choose from 10 supported currencies
- **Date Format**: US, EU, or ISO formats
- **Default Tax Rate**: Set your standard tax percentage
- **Theme**: Light, dark, or system preference
- **Data Management**: Backup, restore, and clear options

### 🔐 **Privacy & Security**
- **100% Local Storage** - All data stays on your device
- **No Cloud Dependencies** - Zero external servers involved
- **SQLite Database** - Portable and secure local storage
- **Git Protection** - Database files never committed
- **Open Source** - Transparent and auditable code
- **No Telemetry** - Zero tracking or analytics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mocsid/personal-finance-tracker.git
   cd personal-finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Create and initialize database
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Complete the welcome wizard**
   - Set your name and preferences
   - Choose your currency
   - Configure default tax rate
   - Start tracking!

---

## ⚡️ One-Click Start (Windows)

For the easiest setup on Windows, just double-click the `personal-income-tracker.bat` file in the project root. This will:
- Install dependencies (if needed)
- Set up the database (if needed)
- Start the development server automatically

**No terminal required!**

For Mac/Linux or advanced users, you can also run:
```bash
npm run start-app
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern, accessible components
- **Lucide React** - Beautiful, consistent icons

### Backend & Database
- **Prisma ORM** - Type-safe database operations
- **SQLite** - Lightweight, local database
- **Next.js API Routes** - Serverless endpoints

### State Management
- **React Context** - Currency and theme providers
- **Local Storage** - Settings and preferences
- **Custom Hooks** - Reusable state logic

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `g` `d` | Go to Dashboard |
| `g` `b` | Go to Bills |
| `g` `i` | Go to Income |
| `g` `a` | Go to Analytics |
| `g` `e` | Go to Export |
| `g` `s` | Go to Settings |
| `n` `b` | New Bill (on bills page) |
| `n` `i` | New Income (on income page) |
| `?` | Show keyboard shortcuts |

*Press keys in sequence. Visual indicators show your progress.*

---

## 📱 User Interface

### Modern Design Features
- **Responsive Design** - Mobile-first approach with tablet/desktop optimization
- **Dark Mode Support** - System preference detection with manual override
- **Tooltips & Hints** - Contextual help throughout the interface
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Smooth transitions and progress indicators
- **Visual Status** - Color-coded indicators for bills, income, and health

### Accessibility
- **Keyboard Navigation** - Full keyboard support with shortcuts
- **Screen Reader Friendly** - Semantic HTML and ARIA labels
- **High Contrast** - Optimized colors for visibility
- **Focus Management** - Clear focus indicators and tab order

---

## 🗄️ Database Schema

### Core Models
```sql
-- Bill management
BillTemplate  # Recurring bill templates with scheduling
Bill         # Individual bill instances with status tracking

-- Income tracking  
Income       # Income entries with tax calculations

-- Status enums
BillStatus   # PAID, UNPAID, OVERDUE, PARTIAL
```

### Key Features
- **Automatic Timestamps** - Created/updated tracking
- **Category Organization** - Flexible categorization system
- **Flexible Remarks** - Custom notes and descriptions
- **Monthly Indexing** - Efficient querying by time period
- **Template Linking** - Bills connected to recurring templates
- **Tax Calculations** - Percentage-based deductions

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build optimized production bundle
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Database
npm run db:push      # Push schema changes to SQLite
npm run db:studio    # Open Prisma Studio (visual database editor)
npm run db:generate  # Generate TypeScript client from schema
```

---

## 💾 Data Management

### Local Database
- **File**: `prisma/dev.db` (SQLite)
- **Protection**: Automatically excluded from version control
- **Portability**: Easily backup and restore
- **GUI**: Accessible via Prisma Studio

### Backup Strategy
1. **App Export** - Use built-in export feature (JSON/CSV)
2. **Database Copy** - Copy `prisma/dev.db` to safe location
3. **Settings Backup** - Export complete configuration
4. **Regular Backups** - Set up automated local backups

### Migration Between Devices
1. Export data from old device
2. Copy database file or use export feature
3. Import on new device
4. All relationships and settings preserved

---

## 🚀 Deployment Options

### Local Development (Recommended)
```bash
npm run build && npm run start
```

### Self-Hosted (VPS/Home Server)
```dockerfile
# Example Docker setup
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Vercel/Netlify**: Requires PostgreSQL migration
- **Railway/Render**: SQLite-compatible with persistent storage
- **DigitalOcean**: Perfect for self-hosting with backups

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow existing code patterns and TypeScript standards
4. Test on multiple screen sizes and themes
5. Submit pull request with clear description

### Guidelines
- **Privacy First** - Never add external analytics or tracking
- **Local Storage** - Keep all sensitive data local
- **Accessibility** - Maintain keyboard navigation and screen reader support
- **Performance** - Optimize for fast loading and smooth interactions
- **Design Consistency** - Follow established UI patterns

---

## 🗺️ Roadmap

### 🆕 Completed (v1.2.0)
- ✅ Dynamic currency system (10 currencies)
- ✅ Recurring bills with templates
- ✅ Dark mode and theme system
- ✅ Welcome wizard for onboarding
- ✅ Keyboard shortcuts
- ✅ Enhanced tax calculations
- ✅ Improved search and filtering
- ✅ Mobile optimizations

### 🕰️ Next Release (v1.3.0)
- 🤖 **AI-Powered Food Tracking** integration
- 📋 **Budget Planning** with spending limits
- 📈 **Advanced Charts** with interactive visualizations
- 🔔 **Smart Notifications** for due dates and budgets
- 📷 **Receipt Scanning** with OCR technology

### 🔮 Future Releases (v1.4.0+)
- 🏦 **Bank Integration** for transaction import
- 📈 **Investment Tracking** for portfolios
- 🎯 **Financial Goals** with progress tracking
- 📄 **PDF Reports** generation
- 📱 **Mobile App** (React Native)
- 🔌 **API Access** for third-party integrations

---

## 🔒 Security & Privacy

### Data Protection
- **Zero External Calls** - No telemetry, analytics, or tracking
- **Local-Only Storage** - SQLite database never leaves your device
- **Git Protection** - Sensitive files automatically excluded
- **No Dependencies** - Core functionality works offline
- **User Control** - Complete ownership of all financial data

### Best Practices
- **Regular Backups** - Export data frequently
- **Secure Environment** - Keep your system updated
- **File Permissions** - Protect database file access
- **HTTPS in Production** - Use secure connections
- **Environment Variables** - Protect configuration data

---

## 📞 Support & Community

### Getting Help
- **🐛 Issues** - Report bugs and request features on GitHub
- **💬 Discussions** - Ask questions and share tips
- **📝 Documentation** - Comprehensive guides and examples

### Common Solutions
- **Database Issues** - Run `npm run db:generate && npm run db:push`
- **Build Errors** - Clear `node_modules` and reinstall
- **Missing Data** - Check month/year filter settings
- **Theme Problems** - Clear browser storage and restart

---

## 📄 License

**MIT License** - Feel free to use, modify, and distribute for personal or commercial projects.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful, accessible component library
- **Prisma** - Excellent database toolkit and ORM
- **Next.js Team** - Outstanding React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Clean, consistent icon set
- **Community** - Contributors and feature suggestions

---

**🎆 Built with ❤️ for privacy-conscious individuals who want complete control over their financial data.**

> **📝 Note**: This application prioritizes privacy and local storage. Your financial data never leaves your device, ensuring complete confidentiality and security.

---

### 🔗 Quick Links

- [**🚀 Live Demo**](https://github.com/Mocsid/personal-finance-tracker) - Try it yourself
- [**📈 Changelog**](CHANGELOG.md) - See what's new
- [**📝 Issues**](https://github.com/Mocsid/personal-finance-tracker/issues) - Report bugs or request features
- [**💬 Discussions**](https://github.com/Mocsid/personal-finance-tracker/discussions) - Community support

**Ready to take control of your finances? Clone and start tracking today! 💪💰**