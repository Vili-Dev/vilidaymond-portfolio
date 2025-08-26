# Vilidaymond Portfolio - Agent Context

## Overview
Vilidaymond Portfolio est un site web artistique et mystérieux créé pour un artiste numérique spécialisé dans l'esthétique gothique et sombre. Le site présente un design moderne avec une palette de couleurs noir/rouge et des animations sophistiquées.

## Project Structure

### Tech Stack
- **Framework**: Next.js 15 avec React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS avec thème personnalisé sombre
- **Animations**: Framer Motion pour toutes les animations
- **Icons**: Lucide React
- **Deployment**: Netlify (static export)

### Key Features
- 🎨 Design artistique sombre avec palette noir/rouge
- ✨ Système de particules animées en arrière-plan
- 🌟 Effets de parallaxe sur toutes les sections
- 🎭 Animations Framer Motion fluides et sophistiquées
- 📱 Design entièrement responsive
- 🔗 Intégration Instagram prête
- 📧 Formulaire de contact avec animations
- 🚀 Optimisé pour déploiement statique Netlify

## Design System

### Color Palette
```css
primary: {
  black: "#0A0A0A",      // Arrière-plan principal
  darkGray: "#1A1A1A",   // Sections alternées
  red: "#DC2626",        // Couleur d'accent principale
  darkRed: "#B91C1C",    // Rouge foncé pour hover
  bloodRed: "#991B1B",   // Rouge sang pour effets
}

secondary: {
  gray: "#404040",       // Bordures et éléments UI
  lightGray: "#6B7280",  // Texte secondaire
  white: "#F8F8F8",      // Texte principal
}

accent: {
  crimson: "#EF4444",    // Rouge vif pour highlights
  rose: "#F87171",       // Rose pour gradients
  ember: "#FCA5A5",      // Rouge clair pour effets
}
```

### Typography
- **Display**: Playfair Display (serif) - Titres et éléments décoratifs
- **Body**: Inter (sans-serif) - Texte principal
- **Mono**: JetBrains Mono (monospace) - Code et éléments techniques

### Visual Effects
- **Glass Effect**: `backdrop-filter: blur(10px)` avec bordures rouges
- **Red Glow**: `box-shadow: 0 0 20px rgba(220, 38, 38, 0.3)`
- **Gradient Text**: Animation de gradient rouge en mouvement
- **Particles**: Système de particules connectées rouges
- **Parallax**: Effets de parallaxe subtils sur scroll

## Component Architecture

### Layout Components
- **Navigation.tsx**: Navigation fixe avec menu mobile hamburger
- **Footer.tsx**: Pied de page simple avec scroll to top
- **ErrorBoundary.tsx**: Gestion d'erreurs élégante

### Section Components
- **HeroSection.tsx**: Section d'accueil avec effet 3D au hover
- **AboutSection.tsx**: Présentation avec statistiques animées
- **PortfolioSection.tsx**: Galerie filtrable avec modal
- **ContactSection.tsx**: Formulaire de contact avec animations

### Utility Components
- **ParallaxSection.tsx**: Wrapper pour effets de parallaxe
- **ParticleSystem.tsx**: Système de particules Canvas
- **LoadingSpinner.tsx**: Spinner de chargement animé

## Animation System

### Framer Motion Variants
```typescript
// Animations prédéfinies dans src/utils/animations.ts
fadeInUp: opacity 0→1, y 30→0
fadeInScale: opacity 0→1, y 30→0, scale 0.9→1
staggerContainer: Animation en cascade des enfants
```

### Animation Patterns
- **Entrance**: fadeInUp avec stagger pour les listes
- **Hover**: scale + couleur + shadow pour interactivité
- **Scroll**: useInView pour déclencher les animations
- **Parallax**: useScroll + useTransform pour le parallaxe

## Content Structure

### Portfolio Items
```typescript
interface ArtworkItem {
  id: number;
  title: string;
  description: string;
  category: string; // "Digital Art", "Conceptual", "Portrait", etc.
  image: string;
  likes: number;
  comments: number;
  featured: boolean;
  instagramUrl?: string;
}
```

### Categories
- Digital Art
- Conceptual
- Portrait
- Street Art
- Landscape

## Development Guidelines

### Code Standards
- Utilisation de TypeScript strict
- Composants fonctionnels avec hooks
- Memoization avec memo() pour optimisation
- Props interfaces définies
- Error boundaries pour robustesse

### Styling Approach
- Classes Tailwind CSS uniquement
- Custom CSS dans globals.css pour effets spéciaux
- Variables CSS pour cohérence des couleurs
- Responsive design mobile-first

### Animation Best Practices
- Animations déclenchées par intersection observer
- Transitions fluides avec easings personnalisés
- Réduction des animations pour accessibilité
- Performance optimisée (60fps)

## Deployment Configuration

### Next.js Config
- Output: static export
- Images: unoptimized pour static
- ESLint/TypeScript: ignore en production
- Turbopack pour dev et build

### Netlify Setup
- Build command: `npm run build`
- Publish directory: `out`
- Redirects et headers configurés dans netlify.toml

## Key Features to Maintain

### User Experience
- Navigation fluide entre sections
- Animations cohérentes et polies
- Design responsive sur tous appareils
- Performance optimisée
- Accessibilité respectée

### Visual Identity
- Esthétique sombre et mystérieuse
- Palette rouge/noir cohérente
- Effets visuels subtils mais impactants
- Typography élégante et lisible

### Content Management
- Portfolio facilement modifiable
- Intégration Instagram prête
- Formulaire de contact fonctionnel
- SEO optimisé

## Areas for Extension

### Potential Enhancements
- CMS intégration pour le portfolio
- Système de blog pour articles
- Galerie photos Instagram en direct
- Animations 3D avec Three.js
- Mode sombre/clair (actuellement sombre uniquement)
- Multilingue support
- Analytics et tracking

### Technical Improvements
- Image optimization avec next/image
- Lazy loading avancé
- Service worker pour cache
- API routes pour formulaire contact
- Database integration

## Brand Guidelines

### Tone & Voice
- Mystérieux et artistique
- Professionnel mais créatif
- Élégant et sophistiqué
- Introspectif et contemplatif

### Visual Themes
- Gothique moderne
- Minimalisme sombre
- Élégance mystérieuse
- Contraste rouge/noir dramatique

Ce contexte devrait permettre à Claude Code de comprendre parfaitement l'architecture, le style et l'intention du projet Vilidaymond Portfolio.