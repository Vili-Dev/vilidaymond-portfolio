# 🚀 Déploiement Netlify - Guide Rapide

## ⚡ Configuration Automatique

Votre projet est maintenant configuré pour Netlify avec support complet des API routes !

### 🔧 Changements Effectués

1. **next.config.ts** : Retiré `output: 'export'` pour permettre les API routes
2. **netlify.toml** : Configuré le plugin Netlify Next.js officiel
3. **package.json** : Ajouté `@netlify/plugin-nextjs`
4. **API Routes** : Configurées pour Netlify Functions

### 📋 Étapes de Déploiement

#### Option 1: Déploiement Direct (Recommandé)

1. **Connecter à Netlify**
   ```bash
   # Dans Netlify Dashboard
   - New site from Git
   - Choisir votre repo GitHub
   - Branch: main/master
   ```

2. **Configuration Build (Auto-détectée)**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (auto)

3. **Variables d'Environnement**
   ```bash
   # Dans Netlify Site Settings > Environment variables
   INSTAGRAM_ACCESS_TOKEN=your_token_here
   NEXT_PUBLIC_INSTAGRAM_HANDLE=vilidaymond
   ```

#### Option 2: Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Login et déployer
netlify login
netlify init
netlify deploy --build
netlify deploy --prod
```

### 🔐 Variables d'Environnement Requises

```bash
# Instagram (optionnel - fonctionne avec mock data)
INSTAGRAM_ACCESS_TOKEN=IGAABBwxyz...
# OU
INSTAGRAM_USER_ID=17841400455970839
INSTAGRAM_GRAPH_TOKEN=EAABBwxyz...

# Portfolio (optionnel)
NEXT_PUBLIC_PORTFOLIO_NAME="Vilidaymond Portfolio"
NEXT_PUBLIC_INSTAGRAM_HANDLE="vilidaymond"

# Contact (optionnel)
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL=contact@vilidaymond.com
```

### ✅ Fonctionnalités Disponibles Post-Déploiement

- ✅ **Routing Client-Side** : Navigation SPA fluide
- ✅ **API Routes** : `/api/contact` et `/api/instagram` fonctionnelles
- ✅ **Service Worker** : Cache avancé
- ✅ **Optimisations** : Images, CSS, JS automatiquement optimisés
- ✅ **Headers Sécurité** : XSS, CSRF, etc.
- ✅ **Instagram Integration** : Avec fallback mock data
- ✅ **Contact Form** : Rate limiting et validation

### 🐛 Dépannage

#### Build Errors
```bash
# Si erreurs TypeScript/ESLint
# Elles sont ignorées en production (voir next.config.ts)
```

#### API Routes Non Fonctionnelles
```bash
# Vérifier dans Netlify Functions tab
# Logs disponibles dans Functions > View logs
```

#### Instagram Ne Marche Pas
```bash
# Le site fonctionne avec mock data par défaut
# Configurer INSTAGRAM_ACCESS_TOKEN pour données réelles
```

### 🔄 Redéploiement

Le site se redéploie automatiquement à chaque push sur la branche principale.

### 📊 Performance

- **Lighthouse Score** : 95+ attendu
- **Load Time** : <2s attendu
- **Service Worker** : Cache intelligent
- **CDN Global** : Netlify Edge

---

Votre portfolio Vilidaymond sera accessible sur : `https://your-site-name.netlify.app` 🎨✨