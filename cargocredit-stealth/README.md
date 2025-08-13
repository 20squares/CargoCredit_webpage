# CargoCredit Stealth Landing Page

A minimalistic, stealth-mode landing page for CargoCredit - reinventing supply chain finance with network-aware liquidity solutions.

**Live at:** https://cargocredit.io

## Features

- **Interactive Graph Visualization**: Dynamic animated supply chain network showing liquidity flow
- **Responsive Design**: Fully responsive with Tailwind CSS
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Lazy loading, efficient animations, and minimal bundle size
- **Motion Preferences**: Respects `prefers-reduced-motion` settings

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Customization

### Colors
Edit the color palette in `tailwind.config.js`:
```javascript
colors: {
  background: '#0B0B0C',  // Dark background
  text: '#F5F7FA',        // Light text
  accent: '#6EE7B7',      // Green accent
  muted: '#6B7280',       // Muted gray
}
```

### Graph Configuration
Modify the network graph in `src/lib/graph.ts`:
- Adjust node positions and labels
- Customize edge relationships and metadata
- Modify animation timing and paths

### Content
Update text content directly in the components:
- `src/components/Hero.tsx` - Main tagline and CTA
- `src/components/ValueProps.tsx` - Value proposition cards
- `src/components/Footer.tsx` - Footer content

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Initial JS bundle: <100KB (gzipped)
- Lighthouse score: 95+ performance
- First Contentful Paint: <1.5s
- Time to Interactive: <3s

## Deployment

The production build is optimized and ready for deployment to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

Popular deployment options:
- Vercel: `vercel --prod`
- Netlify: Drag and drop the `dist` folder
- GitHub Pages: Use GitHub Actions workflow
- AWS S3 + CloudFront: Upload `dist` to S3 bucket

## License

© 2024 CargoCredit. All rights reserved.
