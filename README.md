# Vilidaymond Portfolio

A dark, artistic portfolio website built with Next.js, TypeScript, and Framer Motion, featuring mysterious aesthetics and smooth animations.

## Features

- 🎨 Dark artistic design with black/red color scheme
- ✨ Particle animation system
- 🌟 Parallax scrolling effects
- 🎭 Framer Motion animations throughout
- 📱 Fully responsive design
- 🔗 Instagram integration ready
- 📧 Contact form with animations
- 🚀 Optimized for Netlify deployment

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS with custom dark theme
- **Animations:** Framer Motion, CSS animations
- **Icons:** Lucide React
- **3D Elements:** Three.js, React Three Fiber
- **Deployment:** Netlify (static export)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vilidaymond-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

This portfolio is configured for static export and optimized for Netlify deployment:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `out`
   - The `netlify.toml` file is already configured

## Customization

### Colors
The dark theme colors are defined in `tailwind.config.ts`:
- Primary: Black (#0A0A0A), Dark Gray (#1A1A1A), Red (#DC2626)
- Secondary: Gray variations for text and accents
- Accent: Crimson and rose variations for highlights

### Fonts
Google Fonts integration includes:
- **Display:** Playfair Display (serif)
- **Body:** Inter (sans-serif)  
- **Mono:** JetBrains Mono (monospace)

### Sections
1. **Hero** - Animated introduction with 3D hover effects
2. **About** - Personal story with statistics
3. **Portfolio** - Filterable gallery with Instagram integration
4. **Contact** - Animated contact form
5. **Footer** - Social links and copyright

### Instagram Integration
Update the Instagram links in:
- `src/components/Navigation.tsx`
- `src/components/PortfolioSection.tsx`
- `src/components/ContactSection.tsx`

## Performance Features

- Static site generation (SSG)
- Image optimization disabled for static export
- CSS and JS caching headers
- Lazy loading components
- Efficient animations with Framer Motion

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile, tablet, and desktop
- Optimized animations for 60fps performance

## License

This project is created for Vilidaymond's portfolio. All artworks and content are original creations.

---

*Crafted with mystery and artistic vision* 🎨
