# DEPLOYMENT GUIDE - Cellule Infrastructures RDC

Production deployment guide for Vercel and Sanity.

## 🎯 Deployment Overview

The platform consists of two parts:

1. **Next.js Frontend**: Deployed to Vercel
2. **Sanity Studio**: Deployed to Sanity hosting

## 🚀 Vercel Deployment

### Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free)
- Code pushed to repository

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Build Settings

Vercel should auto-configure, but verify:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Step 3: Environment Variables

Add all variables from `.env.local`:

**Required:**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-03
SANITY_API_READ_TOKEN=your-read-token
NEXT_PUBLIC_SITE_URL=https://celluleinfra.cd
NEXT_PUBLIC_SITE_NAME=Cellule Infrastructures
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

**Optional:**

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Step 4: Deploy

Click "Deploy" and wait for build completion.

### Step 5: Custom Domain

1. Go to Project Settings → Domains
2. Add your domain: `celluleinfra.cd`
3. Configure DNS records:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

4. Wait for DNS propagation (up to 48 hours)
5. SSL certificate is automatic

### Step 6: Production Environment Variables

Update production environment:

```
NEXT_PUBLIC_SITE_URL=https://celluleinfra.cd
```

Trigger redeploy after updating.

## 📊 Sanity Studio Deployment

### Step 1: Build Studio

```bash
cd sanity
npm run build
```

### Step 2: Deploy to Sanity

```bash
npm run deploy
```

Follow prompts to deploy.

Your studio will be available at:

```
https://cellule-infrastructures-rdc.sanity.studio
```

### Step 3: Custom Studio Domain (Optional)

Configure custom studio domain in Sanity dashboard:

1. Go to Project Settings
2. Navigate to Studio
3. Add custom hostname: `studio.celluleinfra.cd`
4. Configure DNS CNAME record

## 🔒 Security Configuration

### 1. CORS Settings

In Sanity Dashboard:

- Settings → API → CORS Origins
- Add: `https://celluleinfra.cd`
- Add: `https://www.celluleinfra.cd`

### 2. Content Security Policy

Already configured in `next.config.ts`.

Verify headers are working:

```bash
curl -I https://celluleinfra.cd
```

### 3. API Tokens

Rotate tokens regularly:

1. Generate new token in Sanity
2. Update Vercel environment variables
3. Redeploy
4. Delete old token

## 📈 Performance Optimization

### Vercel Configuration

Enable in Vercel dashboard:

- [ ] Image Optimization
- [ ] Edge Functions
- [ ] Analytics
- [ ] Speed Insights

### Caching Strategy

Configure in `next.config.ts`:

```typescript
headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### CDN Configuration

Vercel automatically configures Edge Network.

Verify CDN:

- Check response headers
- Test from multiple locations
- Monitor via Vercel Analytics

## 🔍 SEO Configuration

### 1. Sitemap

Automatically generated at `/sitemap.xml`

Submit to:

- Google Search Console
- Bing Webmaster Tools

### 2. Robots.txt

Located at `/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://celluleinfra.cd/sitemap.xml
```

### 3. Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `celluleinfra.cd`
3. Verify ownership (DNS or HTML file)
4. Submit sitemap

### 4. Structured Data

Already implemented via JSON-LD.

Test with:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

## 📊 Analytics Setup

### Google Analytics 4

1. Create GA4 property
2. Get Measurement ID
3. Add to Vercel environment variables:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Redeploy

### Google Tag Manager (Optional)

1. Create GTM container
2. Get Container ID
3. Add to environment variables:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod

# Deploy with environment
vercel --prod --env NEXT_PUBLIC_SITE_URL=https://celluleinfra.cd
```

### Deployment Webhooks

Trigger deployments from external sources:

1. Vercel Project Settings → Git → Deploy Hooks
2. Create webhook
3. Use in Sanity, GitHub Actions, etc.

## 📋 Post-Deployment Checklist

### Immediately After Deployment

- [ ] Verify site loads at domain
- [ ] Test SSL certificate
- [ ] Check all pages render
- [ ] Test both languages (fr/en)
- [ ] Verify images load
- [ ] Test forms
- [ ] Check navigation
- [ ] Test mobile responsiveness
- [ ] Verify Sanity Studio access

### Within 24 Hours

- [ ] Monitor error logs
- [ ] Check analytics tracking
- [ ] Verify search indexing started
- [ ] Test all major features
- [ ] Check performance metrics
- [ ] Monitor Core Web Vitals

### Within First Week

- [ ] Review analytics data
- [ ] Check search console for issues
- [ ] Monitor performance trends
- [ ] Gather user feedback
- [ ] Fix any reported issues

## 🛠 Monitoring & Maintenance

### Performance Monitoring

Use Vercel Analytics:

- Page load times
- Core Web Vitals
- Real user monitoring

### Error Tracking

Monitor in Vercel:

- Function logs
- Build logs
- Runtime logs

### Content Updates

Via Sanity Studio:

- No deployment needed
- Changes are immediate
- Use preview mode for testing

### Scheduled Maintenance

Monthly:

- Review analytics
- Check for security updates
- Update dependencies
- Review performance
- Backup content

## 🆘 Rollback Procedure

If deployment has issues:

### Option 1: Vercel Dashboard

1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

### Option 2: Git Revert

```bash
git revert HEAD
git push origin main
```

Vercel will auto-deploy previous version.

### Option 3: Manual Redeploy

```bash
vercel --prod
```

## 📞 Production Support

### Vercel Support

- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)
- Community: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

### Sanity Support

- Documentation: [sanity.io/docs](https://sanity.io/docs)
- Support: [sanity.io/help](https://sanity.io/help)
- Community: [slack.sanity.io](https://slack.sanity.io)

## 🎉 Launch Announcement

After successful deployment:

1. **Internal Testing**
   - Team walkthrough
   - Final QA
   - Load testing

2. **Soft Launch**
   - Limited audience
   - Monitor closely
   - Gather feedback

3. **Public Launch**
   - Social media announcement
   - Press release
   - Email notifications
   - Update all official channels

---

**Congratulations!** Your platform is now live. 🚀

For ongoing maintenance, see [MAINTENANCE.md](./MAINTENANCE.md)
