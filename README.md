# Personal Finance Tracker

A privacy-focused personal finance tracker built with Next.js, SQLite, and Prisma. Track your income and bills locally without sharing sensitive data.

## Features

- 💰 **Income Tracking**: Record income from multiple sources with tax deductions
- 💵 **Bill Management**: Track recurring bills with payment status
- 📈 **Monthly Overview**: Dashboard with financial summaries
- 🔒 **Privacy First**: All data stored locally in SQLite database
- 🎨 **Modern UI**: Clean interface with Tailwind CSS and shadcn/ui
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks
- **Icons**: Lucide React

## Getting Started

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
   
   # Push schema to SQLite database
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses three main models:

- **BillTemplate**: Recurring bill templates
- **Bill**: Monthly bill instances with payment status
- **Income**: Income entries with tax calculations

## Privacy & Security

- All data is stored locally in SQLite (`prisma/dev.db`)
- No external API calls for sensitive data
- Database file is automatically gitignored
- Easy to backup/restore your data

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:generate` - Generate Prisma client

### Database Management

Use Prisma Studio for easy database management:
```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your data.

## Deployment

Since this app uses SQLite, it's designed for local use. For deployment:

1. **Local Deployment**: Run on your home server or NAS
2. **Cloud with Volume**: Use services that support persistent storage
3. **Database Migration**: Switch to PostgreSQL for cloud deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Roadmap

- [ ] Bill templates and auto-generation
- [ ] Data export/import functionality
- [ ] Expense categories and budgets
- [ ] Charts and analytics
- [ ] Email/SMS reminders
- [ ] Multi-currency support
- [ ] Mobile app (React Native)

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Note**: This application is designed for personal use. Always backup your data regularly and keep your system secure.