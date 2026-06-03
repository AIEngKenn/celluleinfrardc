# Cellule Infrastructures RDC

Official platform for the Infrastructure Unit of the Democratic Republic of Congo.

## 🎯 Project Overview

This is a production-ready, government-grade institutional platform designed to:

- Inform citizens about infrastructure projects
- Publish procurement opportunities
- Provide public transparency
- Manage official reports and studies
- Share environmental and social documents
- Offer geospatial project information
- Handle citizen complaints
- Support multilingual access (French primary, English secondary)

## 🛠 Technology Stack

### Frontend

- **Next.js 15** (App Router)
- **TypeScript** (Strict mode)
- **React 19** (Server Components)
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **Lucide Icons**

### CMS

- **Sanity CMS** (Headless CMS with French labels)

### Maps

- **Leaflet**
- **React Leaflet**
- **OpenStreetMap**

### Other Tools

- **next-intl** (Internationalization)
- **TanStack Table** (Data tables)
- **PDF.js** (PDF viewing)
- **date-fns** (Date formatting)
- **Zod** (Validation)
- **React Hook Form** (Forms)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Update the following variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`

3. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🌍 Internationalization

The platform supports two languages:

- **French (fr)** - Primary language
- **English (en)** - Secondary language

All URLs are prefixed with the language code:

- French: `/fr/projets`, `/fr/actualites`, etc.
- English: `/en/projects`, `/en/news`, etc.

## 🎨 Design System

### RDC Government Colors

```css
Blue:   #007FFF  (Primary)
Yellow: #F7D618  (Accent)
Red:    #CE1021  (Accent/Alerts)
```

### Typography

- **Font**: Inter (Variable)
- **Headings**: Bold, tight tracking
- **Body**: Regular, optimized for readability

### Components

All components follow:

- WCAG 2.2 AA accessibility standards
- Mobile-first responsive design
- Government design principles

## 📁 Project Structure

```
celluleinfrardc/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── projets/       # Projects
│   │   │   ├── actualites/    # News
│   │   │   ├── appels-offres/ # Procurement
│   │   │   ├── publications/  # Publications
│   │   │   ├── mediatheque/   # Media center
│   │   │   ├── geomatique/    # Maps
│   │   │   ├── plaintes/      # Complaints
│   │   │   └── contact/       # Contact
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── home/              # Homepage sections
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   ├── i18n.ts                # i18n configuration
│   └── middleware.ts          # Next.js middleware
├── messages/
│   ├── fr.json                # French translations
│   └── en.json                # English translations
├── public/                    # Static assets
└── studio/                    # Sanity Studio (to be created)
```

## 🔒 Security

The platform implements:

- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Input Validation**: Zod schemas
- **CSRF Protection**
- **Rate Limiting**
- **XSS Prevention**

## ♿ Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation support
- Screen reader optimized
- Semantic HTML
- ARIA labels
- Focus management

## 🎯 Performance

Target metrics:

- **Lighthouse Score**: 95+
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **INP**: < 200ms

Optimizations:

- Server Components
- Image optimization (next/image)
- Static Generation with ISR
- Code splitting
- Lazy loading
- Font optimization

## 📱 Responsive Design

Breakpoints:

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large: 1440px+

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Prettier**: Code formatting (to be configured)

## 🚢 Deployment

Recommended platform: **Vercel**

### Deploy to Vercel

```bash
vercel
```

Or connect your Git repository to Vercel for automatic deployments.

### Environment Variables

Ensure all environment variables from `.env.example` are configured in your deployment platform.

## 📊 Analytics

- Google Analytics 4
- Google Search Console
- Custom event tracking

## 🗺 Features Roadmap

### Phase 1 (Current)

- ✅ Project setup
- ✅ Design system
- ✅ Homepage
- 🚧 Sanity CMS integration
- 🚧 Projects system
- 🚧 News system
- 🚧 Procurement system

### Phase 2

- Publications library
- Media center
- Interactive maps
- Search system (Cmd+K)

### Phase 3

- Complaint management
- Content migration
- SEO optimization
- Performance optimization

### Future

- Citizen portal
- Authentication
- Public APIs
- Mobile app

## 📝 License

© 2024 Cellule Infrastructures - République Démocratique du Congo

## 🤝 Support

For support and questions:

- Email: contact@celluleinfra.cd
- Website: https://www.celluleinfra.org

---

Built with ❤️ for the Democratic Republic of Congo
