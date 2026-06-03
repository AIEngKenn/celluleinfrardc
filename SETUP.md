# SETUP GUIDE - Cellule Infrastructures RDC

Complete step-by-step guide to set up and deploy the platform.

## 📋 Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **npm**: Version 10.0.0 or higher
- **Git**: For version control
- **Sanity Account**: Free account at https://www.sanity.io

## 🚀 Initial Setup

### Step 1: Install Dependencies

```bash
# Install project dependencies
npm install

# Install Sanity Studio dependencies
cd sanity
npm install
cd ..
```

### Step 2: Create Sanity Project

1. Go to https://www.sanity.io and create a free account
2. Create a new project:
   - Name: "Cellule Infrastructures RDC"
   - Dataset: "production"
   - Note your Project ID

3. Generate API tokens:
   - Go to Project Settings → API → Tokens
   - Create Read token (for frontend)
   - Create Write token (for migrations)

### Step 3: Configure Environment Variables

Create `.env.local` in the root directory:

```bash
# Copy from example
cp .env.example .env.local
```

Edit `.env.local` with your Sanity credentials:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-03
SANITY_API_READ_TOKEN=your-read-token
SANITY_API_WRITE_TOKEN=your-write-token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
# Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 5: Run Sanity Studio

In a new terminal:

```bash
# Start Sanity Studio
cd sanity
npm run dev
```

Visit [http://localhost:3333](http://localhost:3333)

## 📊 Populate Initial Data

### Option A: Manual Entry

1. Open Sanity Studio at http://localhost:3333
2. Create provinces (all 26 RDC provinces)
3. Create news categories
4. Add sample projects, news, etc.

### Option B: Import Sample Data

```bash
# Import sample data (to be created)
npm run sanity:import
```

### Option C: Migrate from Existing Website

See [Migration Guide](./scripts/migration/README.md)

```bash
# Full migration
npm run migrate:full
```

## 🗺 RDC Provinces Data

Create these 26 provinces in Sanity Studio:

1. Kinshasa
2. Kongo Central
3. Kwango
4. Kwilu
5. Mai-Ndombe
6. Kasaï
7. Kasaï-Central
8. Kasaï-Oriental
9. Lomami
10. Sankuru
11. Maniema
12. Sud-Kivu
13. Nord-Kivu
14. Ituri
15. Haut-Uele
16. Tshopo
17. Bas-Uele
18. Nord-Ubangi
19. Mongala
20. Sud-Ubangi
21. Équateur
22. Tshuapa
23. Tanganyika
24. Haut-Lomami
25. Lualaba
26. Haut-Katanga

## 🎨 Customization

### Update Branding

Edit `tailwind.config.ts`:

```typescript
colors: {
  rdc: {
    blue: '#007FFF',    // Primary
    yellow: '#F7D618',  // Accent
    red: '#CE1021',     // Accent/Alerts
  },
}
```

### Update Translations

Edit language files:

- `messages/fr.json` (French)
- `messages/en.json` (English)

### Configure Analytics

Add Google Analytics ID to `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔒 Security Setup

### 1. CORS Configuration

In Sanity dashboard:

- Settings → API → CORS Origins
- Add your domain: `https://yourdomain.com`
- Add localhost for development: `http://localhost:3000`

### 2. Content Security Policy

Security headers are configured in `next.config.ts`.

### 3. Rate Limiting

Configure in `.env.local`:

```env
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 📱 Testing

### Local Testing

```bash
# Run development server
npm run dev

# In another terminal, run type checking
npm run type-check

# Run linting
npm run lint
```

### Mobile Testing

Test responsive design:

- Use browser DevTools
- Test on real devices
- Test with different screen sizes

### Accessibility Testing

- Use browser accessibility tools
- Test with keyboard navigation
- Test with screen readers

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com)

3. Import your repository

4. Configure environment variables in Vercel:
   - Add all variables from `.env.local`
   - Make sure to use production values

5. Deploy!

### Deploy Sanity Studio

```bash
cd sanity
npm run build
npm run deploy
```

Your studio will be available at:
`https://your-project-name.sanity.studio`

### Custom Domain

In Vercel:

1. Go to Project Settings → Domains
2. Add your domain: `celluleinfra.cd`
3. Configure DNS records as instructed

## 🔄 Updates and Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Content Updates

All content is managed through Sanity Studio:

- No code changes needed
- Editors can manage content independently
- Changes are immediately reflected

### Backup Strategy

Sanity provides automatic backups, but you can also:

```bash
# Export dataset
sanity dataset export production backup.tar.gz

# Import dataset
sanity dataset import backup.tar.gz production
```

## 📊 Monitoring

### Analytics

- Google Analytics 4: Track page views, events
- Google Search Console: Monitor SEO performance
- Sanity Analytics: Track content usage

### Performance

Monitor with:

- Vercel Analytics (automatic)
- Google Lighthouse
- Web Vitals

### Error Tracking

Consider adding:

- Sentry (error tracking)
- LogRocket (session replay)

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Sanity Connection Issues

1. Verify project ID in `.env.local`
2. Check API tokens
3. Verify CORS settings

### Image Loading Issues

1. Check Sanity image URLs
2. Verify `next.config.ts` image domains
3. Check CDN configuration

### i18n Issues

1. Verify language files exist
2. Check middleware configuration
3. Test both `/fr` and `/en` routes

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Support

For technical issues:

1. Check this guide
2. Review error logs
3. Check GitHub issues
4. Contact development team

## ✅ Launch Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Sanity Studio deployed
- [ ] Production domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] All 26 provinces created
- [ ] Initial content migrated
- [ ] Mobile testing completed
- [ ] Accessibility testing completed
- [ ] Performance testing completed
- [ ] SEO metadata configured
- [ ] Social media cards tested
- [ ] 404/500 pages tested
- [ ] Forms tested
- [ ] Search tested
- [ ] All languages tested
- [ ] Backup strategy in place
- [ ] Team training completed

---

**Next Steps**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment details.
