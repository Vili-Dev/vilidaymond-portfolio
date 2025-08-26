# 📸 Configuration Instagram pour @vilidaymond

Ce guide explique comment configurer l'intégration Instagram pour récupérer automatiquement les posts de votre profil **@vilidaymond**.

## 🚀 Méthode Rapide (Recommandée)

### 1. Instagram Basic Display API

1. **Créer une App Facebook Developer**
   - Allez sur https://developers.facebook.com/
   - Créez un nouveau compte développeur si nécessaire
   - Créez une nouvelle app de type "Consumer"

2. **Configurer Instagram Basic Display**
   - Dans votre app, ajoutez le produit "Instagram Basic Display"
   - Configurez les URLs de redirection OAuth :
     - `https://votre-domaine.com/auth/instagram/callback`
     - `http://localhost:3000/auth/instagram/callback` (pour dev)

3. **Générer le Token d'Accès**
   ```bash
   # URL d'autorisation (remplacez {app-id})
   https://api.instagram.com/oauth/authorize
     ?client_id={app-id}
     &redirect_uri={redirect-uri}
     &scope=user_profile,user_media
     &response_type=code
   ```

4. **Échanger le code contre un token**
   ```bash
   curl -X POST \\
     https://api.instagram.com/oauth/access_token \\
     -F client_id={app-id} \\
     -F client_secret={app-secret} \\
     -F grant_type=authorization_code \\
     -F redirect_uri={redirect-uri} \\
     -F code={code}
   ```

5. **Variables d'environnement**
   ```bash
   # Dans votre .env.local
   INSTAGRAM_ACCESS_TOKEN=IGAABBwxyz...
   ```

## 🔧 Méthode Alternative : Instagram Graph API

Si vous avez un compte Instagram Business/Creator :

1. **Connecter Instagram à une Page Facebook**
2. **Obtenir un Token d'Accès Page Facebook**
3. **Récupérer l'ID utilisateur Instagram**

```bash
# Dans votre .env.local
INSTAGRAM_USER_ID=17841400455970839
INSTAGRAM_GRAPH_TOKEN=EAABBwxyz...
```

## 📝 Variables d'Environnement Complètes

Copiez `.env.example` vers `.env.local` et remplissez :

```bash
# Instagram (au moins une méthode requise)
INSTAGRAM_ACCESS_TOKEN=IGAABBwxyz...
# OU
INSTAGRAM_USER_ID=17841400455970839
INSTAGRAM_GRAPH_TOKEN=EAABBwxyz...

# Optionnel
NEXT_PUBLIC_INSTAGRAM_HANDLE=vilidaymond
```

## 🔍 Test de l'Intégration

1. **Vérifier l'API**
   ```bash
   curl http://localhost:3000/api/instagram
   ```

2. **Test via interface**
   - Le composant `InstagramGallery` affichera automatiquement les posts
   - En cas d'échec, il utilise des données mock pour la démo

## 🎨 Utilisation dans le Code

```tsx
import InstagramGallery from '@/components/InstagramGallery';

export default function Portfolio() {
  return (
    <InstagramGallery 
      limit={12}
      categories={['all', 'digital', 'portrait', 'conceptual']}
      viewMode="grid"
    />
  );
}
```

## 📊 Fonctionnalités Disponibles

### Hook `useInstagram`
```tsx
const {
  posts,           // Posts Instagram
  loading,         // État de chargement
  error,           // Erreurs éventuelles
  refresh,         // Actualiser manuellement
  stats,           // Statistiques (total, par catégorie)
  getPostsByCategory,  // Filtrer par hashtags
  getFeaturedPosts     // Posts mis en avant
} = useInstagram();
```

### Composant `InstagramGallery`
- **Modes d'affichage** : Grid, Masonry
- **Filtres par catégorie** : Basés sur les hashtags
- **Modal de visualisation** : Zoom sur les posts
- **Cache intelligent** : 30 minutes de cache
- **Fallback élégant** : Mode démo si API indisponible

## 🔄 Renouvellement des Tokens

Les tokens Instagram Basic Display expirent après 60 jours. Pour les renouveler :

```bash
curl -i -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={access-token}"
```

## 🚨 Dépannage

### Problème : "Instagram API not configured"
- ✅ Vérifiez que `INSTAGRAM_ACCESS_TOKEN` est défini
- ✅ Testez le token : `curl -i -X GET "https://graph.instagram.com/me?access_token={token}"`

### Problème : "Failed to fetch Instagram data"
- ✅ Token expiré → Renouvelez-le
- ✅ Quotas API dépassés → Attendez la réinitialisation
- ✅ Compte privé → Assurez-vous que le token a les bonnes permissions

### Mode Développement
Le système utilise automatiquement des données mock si l'API échoue, permettant de développer même sans token valide.

## 🎯 Optimisations Incluses

- **Cache multi-niveaux** : API + Service Worker + LocalStorage
- **Preloading intelligent** : Images chargées par priorité
- **Error boundaries** : Gestion élégante des erreurs
- **Performance adaptative** : Réduit les requêtes selon la batterie/connexion
- **Accessibilité** : Navigation clavier, screen readers

---

Une fois configuré, votre portfolio affichera automatiquement vos dernières créations Instagram avec toutes les optimisations modernes ! 🎨✨