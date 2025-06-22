# Personal Finance Tracker 💰

A comprehensive, privacy-focused personal finance tracker built with Next.js, SQLite, and Prisma. Track your income and bills locally without sharing sensitive data with external services.

## ✨ Features

### 📊 **Dashboard**
- Monthly financial overview with key metrics
- Income vs bills analysis with health indicators
- Recent activity feed
- Quick action shortcuts
- Financial health scoring

### 💳 **Bill Management**
- Add, edit, and delete bills
- Mark bills as paid/unpaid with one click
- Automatic overdue detection
- Category-based organization
- Search and filter functionality
- Monthly bill tracking with status indicators

### 💰 **Income Tracking**
- Record income from multiple sources
- **Percentage-based tax calculations** (customizable tax rates)
- Gross and net amount tracking
- Category-based income organization
- Search and filter capabilities
- Tax deduction summaries

### 📈 **Analytics & Insights**
- Month-over-month comparison
- Category breakdown for bills and income
- Financial ratios and trends
- Visual progress indicators
- Income coverage analysis

### 📤 **Data Export**
- Export to JSON (complete data) or CSV (spreadsheet)
- Current month or all-time data options
- Privacy-focused local downloads
- Backup and restore capabilities

### ⚙️ **Settings & Customization**
- Currency selection (USD, EUR, GBP, JPY, PHP)
- Date format preferences
- Default tax rate configuration
- Database backup/restore
- Complete data management

### 🔐 **Privacy & Security**
- **100% Local Storage** - All data stays on your device
- SQLite database (never committed to git)
- No external API calls for sensitive data
- Open source and transparent
- Easy backup and migration

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

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Prisma ORM** - Type-safe database access
- **SQLite** - Lightweight, local database
- **Next.js API Routes** - Serverless API endpoints

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 User Interface

### Responsive Design
- **Mobile-first** approach
- **Tablet and desktop** optimized
- **Sticky navigation** for easy access
- **Toast notifications** for user feedback

### Modern UX Features
- **Search and filtering** across all data
- **Month/year navigation** with dropdown
- **Quick action buttons** for common tasks
- **Contextual delete confirmations**
- **Real-time calculation** preview
- **Status indicators** with color coding

## 🗄️ Database Schema

### Core Models
```sql
-- Bills management
BillTemplate  # Recurring bill templates
Bill         # Individual bill instances

-- Income tracking  
Income       # Income entries with tax calculations

-- Enums
BillStatus   # PAID, UNPAID, OVERDUE, PARTIAL
```

### Key Features
- **Automatic timestamps** (createdAt, updatedAt)
- **Category organization** for bills and income
- **Flexible remarks** system
- **Month/year indexing** for efficient queries
- **Tax calculation** with percentage-based deductions

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:generate  # Generate Prisma client
```

## 💾 Data Management

### Local Database
- SQLite file: `prisma/dev.db`
- Automatically excluded from git
- Easy to backup and restore
- Can be viewed with Prisma Studio

### Backup Strategy
1. **Manual Export** - Use the export feature in the app
2. **Database File** - Copy `prisma/dev.db` to safe location
3. **Settings Backup** - Export complete backup from settings

### Migration
- Database file is portable between installations
- Export/import functionality for data transfer
- JSON format preserves all relationships

## 🚀 Deployment Options

### Local Deployment (Recommended)
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Docker Deployment
```dockerfile
# Example Dockerfile (create as needed)
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
- **Vercel/Netlify**: Requires PostgreSQL for production
- **VPS/Server**: Perfect for SQLite with persistent storage
- **Home Server**: Ideal for private financial tracking

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS utility classes
- Maintain responsive design
- Add proper error handling
- Include loading states
- Test on multiple screen sizes

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Dashboard with overview
- [x] Bill management with CRUD operations
- [x] Income tracking with tax calculations
- [x] Search and filtering
- [x] Data export functionality
- [x] Settings and customization

### Phase 2: Enhanced Features
- [ ] **Recurring bill templates**
- [ ] **Budget planning and tracking**
- [ ] **Expense categories and subcategories**
- [ ] **Multi-currency support**
- [ ] **Data visualization charts**
- [ ] **Notification system**

### Phase 3: Advanced Features
- [ ] **Bank account reconciliation**
- [ ] **Receipt scanning and OCR**
- [ ] **Investment tracking**
- [ ] **Financial goal setting**
- [ ] **Report generation (PDF)**
- [ ] **API for external integrations**

### Phase 4: AI Integration 🤖
- [ ] **Smart categorization**
- [ ] **Spending pattern analysis**
- [ ] **Financial advice suggestions**
- [ ] **Automated bill detection**
- [ ] **Predictive budgeting**

## 🔒 Security & Privacy

### Data Protection
- **No telemetry** or tracking
- **No external dependencies** for sensitive operations
- **Local-only storage** with SQLite
- **Gitignore protection** for database files
- **No cloud synchronization** by default

### Best Practices
- Regular database backups
- Secure file permissions
- HTTPS in production
- Environment variable protection
- Regular security updates

## 📞 Support

### Getting Help
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Questions and community support
- **Documentation** - In-code comments and README

### Common Issues
- **Database connection** - Ensure Prisma client is generated
- **Missing data** - Check month/year filter settings
- **Build errors** - Verify Node.js version compatibility

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful, accessible components
- **Prisma** for excellent database tooling
- **Next.js team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **Lucide** for clean, consistent icons

---

**Built with ❤️ for privacy-conscious individuals who want full control over their financial data.**

> **Note**: This application is designed for personal use. Always backup your data regularly and keep your system secure.