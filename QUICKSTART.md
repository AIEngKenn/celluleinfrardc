# ⚡ QUICK START GUIDE

Get the Cellule Infrastructures platform running in under 10 minutes!

## 🎯 Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Internet connection
- [ ] Code editor (VS Code recommended)

## 🚀 Installation Steps

### Step 1: Fix npm (Windows Only)

If you encounter npm errors, run this first:

```powershell
# Create npm directory
mkdir C:\Users\Surface\AppData\Roaming\npm -Force

# Verify it exists
Test-Path C:\Users\Surface\AppData\Roaming\npm
```

### Step 2: Install Dependencies

```bash
# Navigate to project folder
cd d:\Work\celluleinfrardc

# Install Next.js dependencies
npm install

# Install Sanity dependencies
cd sanity
npm install
cd ..
```

**Note**: This may take 3-5 minutes depending on your connection.

### Step 3: Create Sanity Project

1. Go to https://www.sanity.io
2. Sign up for free (or login)
3. Click "Create new project"
4. Fill in:
   - Project name: `Cellule Infrastructures RDC`
   - Dataset: `production`
5. Copy your **Project ID** (looks like: `abc12345`)

### Step 4: Get Sanity API Tokens

1. In your Sanity project dashboard
2. Go to **Settings** → **API**
3. Under **Tokens**, click **Add New Token**
4. Create two tokens:
   - **Read Token**:
     - Name: `Production Read`
     - Permissions: Viewer
     - Copy the token
   - **Write Token**:
     - Name: `Migration Write`
     - Permissions: Editor
     - Copy the token

### Step 5: Configure Environment Variables

1. Open `.env.local` in your code editor
2. Update with your Sanity credentials:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-03
SANITY_API_READ_TOKEN=your-read-token-here
SANITY_API_WRITE_TOKEN=your-write-token-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Cellule Infrastructures
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

3. Save the file

### Step 6: Start Development Servers

Open **TWO** terminal windows:

**Terminal 1 - Next.js:**
```bash
cd d:\Work\celluleinfrardc
npm run dev
```

**Terminal 2 - Sanity Studio:**
```bash
cd d:\Work\celluleinfrardc
npm run studio:dev
```

### Step 7: Verify Everything Works

1. **Frontend**: Open http://localhost:3000
   - ✅ Homepage should load
   - ✅ Government colors visible
   - ✅ Language switcher works (FR/EN)
   - ✅ Navigation works

2. **Sanity Studio**: Open http://localhost:3333
   - ✅ Studio loads
   - ✅ All labels in French
   - ✅ See schema types: Projets, Actualités, etc.

## 📝 Next: Add Initial Data

### Create Provinces (Required)

In Sanity Studio (http://localhost:3333):

1. Click **Provinces** in sidebar
2. Click **Create new Province**
3. Add all 26 RDC provinces:

```
Kinshasa, Kongo Central, Kwango, Kwilu, Mai-Ndombe,
Kasaï, Kasaï-Central, Kasaï-Oriental, Lomami, Sankuru,
Maniema, Sud-Kivu, Nord-Kivu, Ituri, Haut-Uele,
Tshopo, Bas-Uele, Nord-Ubangi, Mongala, Sud-Ubangi,
Équateur, Tshuapa, Tanganyika, Haut-Lomami, Lualaba,
Haut-Katanga
```

### Create Sample Project

1. Click **Projets** in sidebar
2. Click **Create new Projet**
3. Fill in:
   - Titre (Français): `Réhabilitation Route Nationale N°1`
   - Titre (English): `National Road N°1 Rehabilitation`
   - Select Province: `Kinshasa`
   - Statut: `En cours`
   - Budget: `45000000`
4. Click **Publish**

### Create Sample News

1. Click **Actualités** in sidebar
2. Create sample news article
3. Link to your project

## 🎉 Success!

You should now see:
- ✅ Homepage with sample data
- ✅ Featured project showing
- ✅ Both languages working
- ✅ All components rendering

## 🐛 Troubleshooting

### npm install fails
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps
```

### Sanity connection error
- Verify Project ID is correct
- Check API tokens are valid
- Confirm CORS settings in Sanity dashboard

### Port already in use
```powershell
# Next.js (port 3000)
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Sanity (port 3333)
netstat -ano | findstr :3333
taskkill /PID <pid> /F
```

### Homepage shows "undefined"
- Content not yet in Sanity
- Create sample projects/news first
- Or use placeholder data (already configured)

## 📚 What's Next?

Now that everything works:

1. **Read the docs**:
   - [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Overview
   - [SETUP.md](./SETUP.md) - Detailed setup
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

2. **Add more content**:
   - Create all provinces
   - Add projects
   - Add news articles
   - Upload documents

3. **Customize**:
   - Update branding if needed
   - Adjust translations
   - Configure analytics

4. **Build remaining pages**:
   - Project detail pages
   - News detail pages
   - Publications system
   - Media gallery

5. **Migrate existing content**:
   - See [scripts/migration/README.md](./scripts/migration/README.md)
   - Run: `npm run migrate:full`

## 💡 Quick Tips

- **Restart servers**: Press `Ctrl+C` in terminal, then run command again
- **Clear Next.js cache**: Delete `.next` folder
- **Hot reload**: Changes auto-reload in browser
- **French first**: Always fill French fields first
- **Sanity preview**: Changes are instant in frontend

## 🆘 Need Help?

- Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- Review [SETUP.md](./SETUP.md)
- Check Sanity docs: https://sanity.io/docs
- Check Next.js docs: https://nextjs.org/docs

---

**Estimated time**: 10-15 minutes
**Difficulty**: Easy

You're ready to build! 🚀
