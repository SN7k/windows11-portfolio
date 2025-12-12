# Windows 11 Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A pixel-perfect, fully interactive Windows 11 desktop experience built with Next.js, featuring draggable windows, glassmorphism effects, and authentic system animations.

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ✨ Features

- 🎨 **Authentic Windows 11 UI** - Fluent Design with glassmorphism and backdrop blur
- 🪟 **Complete Window System** - Draggable, resizable windows with minimize/maximize/close
- 📱 **Fully Responsive** - Optimized for all screen sizes
- 🚀 **High Performance** - Built with Next.js 14 App Router
- 🎵 **Interactive Elements** - Functional Start Menu, Taskbar, and system sounds

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React 18** - Modern UI library
- **Sass** - Advanced CSS preprocessing

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/SN7k/windows11-portfolio.git
cd windows11-portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── Desktop/     # Desktop UI
│   ├── StartMenu/   # Start menu system
│   ├── Taskbar/     # Taskbar components
│   └── Windows/     # Window applications
├── contexts/        # State management
├── data/            # Configuration files
└── layouts/         # Layout components
```

## 🌐 Deployment

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Vercel
```bash
npx vercel
```

### Docker
```bash
docker build -t win11-portfolio .
docker run -p 3000:3000 win11-portfolio
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/SN7k/windows11-portfolio/blob/main/LICENSE) file for details.

## 👤 Author

**SNK**

- Portfolio: [portfolio.snk.com](https://portfolio.snk.com)
- GitHub: [@SN7k](https://github.com/SN7k)

---
