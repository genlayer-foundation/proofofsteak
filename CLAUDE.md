# CLAUDE.md - Project Context for AI Assistants

## Project Overview

**Proof of Stake** is a playful web application showcasing a steak leaderboard for Devconnect 2025 Buenos Aires. The project was initially built with [v0.dev](https://v0.dev) and is a Next.js application featuring a visually striking design with steak-themed crypto terminology.

## Key Information

- **Project Name**: PROOF OF STAKE
- **Purpose**: Interactive steak leaderboard and submission platform for Devconnect 2025 Buenos Aires
- **Initial Build**: Generated with v0.dev
- **v0 Chat**: https://v0.app/chat/ofpcxOjYB4S
- **Deployment**: Vercel (auto-sync with v0.dev)

## Tech Stack

### Core Framework
- **Next.js 16.0.3** (App Router)
- **React 19.2.0**
- **TypeScript 5.x**
- **Node.js**: 24.10.0 (see `.nvmrc`)

### Styling
- **Tailwind CSS 4.1.9** (latest version with oxide compiler)
- **PostCSS** with Tailwind CSS
- Custom animations via `tailwindcss-animate`
- CSS-in-JS for advanced effects (background-clip text effects)

### UI Components
- **Radix UI**: Comprehensive set of unstyled, accessible components
- **Lucide React**: Icon library
- **shadcn/ui** pattern: Components in `components/ui/`
- Custom components for specific features

### Forms & Validation
- **React Hook Form** with **Zod** resolvers
- Type-safe form validation

### Other Libraries
- **next-themes**: Theme management
- **sonner**: Toast notifications
- **date-fns**: Date manipulation
- **recharts**: Data visualization (if needed)
- **Vercel Analytics**: Analytics tracking

## Project Structure

\`\`\`
proofofstake-home/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage (main entry point)
│   ├── globals.css         # Global styles
│   └── veggies/
│       └── page.tsx        # Vegetarian alternative page
├── components/
│   ├── hero-section.tsx    # Full-screen hero with image-text effect
│   ├── steak-grid.tsx      # Main steak leaderboard grid
│   ├── veggie-section.tsx  # CTA to veggie page
│   ├── floating-actions.tsx # Fixed floating action buttons
│   ├── footer.tsx          # Site footer
│   └── ui/                 # Reusable UI components (shadcn/ui pattern)
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── public/
│   └── *.jpg               # Steak and hero images
├── package.json
├── tsconfig.json
├── components.json         # shadcn/ui configuration
└── README.md
\`\`\`

## Key Components

### HeroSection (`components/hero-section.tsx`)
- Full-screen hero with animated text
- **Key Effect**: Uses `background-clip: text` to create steak-image filled text
- Background image: `/hero-steak-hd.jpg`
- Responsive typography using viewport units (`12vw` to `20vw`)
- Scroll indicator with bounce animation

### SteakGrid (`components/steak-grid.tsx`)
- Displays 9 steak submissions in a 3-column grid
- **Hover Interaction**: Shows detailed info overlay on hover
- Each card includes:
  - Rank badge (top-left)
  - Vote count (top-right)
  - Steak image with hover zoom
  - Info overlay: name, location, submitter, timestamp
- **State Management**: Uses local `hoveredId` state

### Data Structure
\`\`\`typescript
interface SteakSubmission {
  id: number
  image: string
  name: string           // e.g., "The Ethereal Ribeye"
  location: string       // e.g., "Don Julio, Palermo"
  votes: number
  submittedBy: string    // e.g., "vitalik.eth"
  timestamp: string      // ISO date string
}
\`\`\`

### FloatingActions (`components/floating-actions.tsx`)
- Fixed position floating buttons (bottom-right)
- Two buttons: Upload and Help
- Custom SVG icons
- Hover scale animation

### VeggieSection (`components/veggie-section.tsx`)
- CTA section linking to `/veggies` page
- Green gradient text effect
- Underline animation on hover

## Styling Patterns

### Color Scheme
- **Background**: Black (`bg-black`)
- **Accent Colors**: Amber/orange tones (oklch color space)
- **Green**: For veggie section (gradient from `green-600` to `green-400`)
- **Theme**: Dark mode focused

### Custom Effects
1. **Steak Shine**: Class `steak-shine` (likely defined in `globals.css`)
2. **Text Clipping**: Using steak images as text fill via `background-clip: text`
3. **Drop Shadows**: Multi-layer glows with amber tones
4. **Hover Animations**: Scale transforms, opacity transitions

### Typography
- **Font**: Geist Sans (primary), Geist Mono (monospace)
- **Sizes**: Extremely large responsive text (`text-6xl` to `text-8xl`)
- **Weight**: Heavy use of `font-black` (900 weight)
- **Tracking**: Tighter tracking with `tracking-tighter`

## Development Workflow

### Running the Project
\`\`\`bash
nvm use 24.10.0  # Use correct Node version
pnpm install     # Install dependencies
pnpm dev         # Start development server
pnpm build       # Production build
\`\`\`

### Important Notes
- Project auto-syncs with v0.dev deployments
- Changes from v0.dev are automatically pushed to repository
- Vercel deploys from repository updates

## State Management
- **Current**: Local component state with `useState`
- **No global state**: Each component manages its own state
- **Future consideration**: If adding voting/submissions, consider state management library

## Data Flow
- **Static Data**: Hardcoded steak submissions in `steak-grid.tsx`
- **Images**: Referenced from `/public` directory
- **No Backend**: Currently no API calls or database

## Naming Conventions

### Components
- PascalCase for component files: `HeroSection.tsx`
- Same name for export: `export function HeroSection()`

### Steak Names
- Crypto-themed puns: "Ethereal Ribeye", "Consensus Asado", "Proof of Wagyu"
- Byzantine/blockchain references: "Byzantine Strip", "Merkle Mignon"

### ENS/Crypto Usernames
- Format: `name.tld` (e.g., `vitalik.eth`, `satoshi.btc`, `staker.sol`)

## Performance Considerations
- Uses `'use client'` directive for interactive components
- Image optimization could be improved (currently using `<img>` instead of `<Image>`)
- Responsive design with mobile-first approach

## Accessibility
- ARIA labels on floating action buttons
- Semantic HTML structure
- Radix UI components provide accessible primitives

## Future Enhancement Ideas
1. **Backend Integration**: Add actual voting and submission functionality
2. **Image Optimization**: Replace `<img>` with Next.js `<Image>` component
3. **Authentication**: Web3 wallet integration for submissions
4. **Real-time Updates**: WebSocket for live vote counts
5. **Upload Modal**: Implement the floating upload button functionality
6. **Filtering/Sorting**: Add controls for leaderboard view

## Important Files to Know

- **`app/layout.tsx`**: Global metadata and SEO configuration
- **`app/globals.css`**: Global styles and custom CSS classes
- **`components.json`**: shadcn/ui configuration for component generation
- **`tsconfig.json`**: TypeScript configuration with path aliases (`@/*`)
- **`.nvmrc`**: Node version specification (24.10.0)

## Design Philosophy
- **Bold and Playful**: Large text, vibrant interactions
- **Crypto Culture**: Blockchain terminology mixed with steak culture
- **Buenos Aires Vibes**: Highlighting famous parrillas and locations
- **Community-Driven**: Focus on voting and user submissions

## Working with This Project

When making changes:
1. Maintain the playful crypto + steak theme
2. Keep the bold, high-contrast visual style
3. Ensure responsive design (mobile to desktop)
4. Test hover states and animations
5. Consider accessibility in interactive elements
6. Follow existing component patterns from shadcn/ui

## Common Tasks

### Adding a New Steak
Edit `components/steak-grid.tsx` and add to the `steakSubmissions` array.

### Adding a New Component
\`\`\`bash
# For shadcn/ui components
npx shadcn@latest add [component-name]
\`\`\`

### Styling Changes
- Global styles: `app/globals.css`
- Component styles: Inline Tailwind classes
- Custom animations: Define in Tailwind config or globals.css

---

**Last Updated**: 2025-11-17
**Project Status**: Active development
**Original Generator**: v0.dev
