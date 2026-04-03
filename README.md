# NOIR GYM — Luxury Fitness Web Application

A production-ready gym booking web application built with React + TypeScript + Vite.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Fonts**: Fraunces + DM Sans + DM Mono (Google Fonts)

## Setup

```bash
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, features, classes preview, memberships, testimonials, CTA |
| `/classes` | Full class schedule with category filter |
| `/memberships` | Pricing tiers, feature comparison table, FAQ |
| `/trainers` | Trainer profiles with specialties and certifications |
| `/booking` | 4-step booking flow with custom calendar |
| `/contact` | Contact form with success state, hours, location |

## Design System

- **Base color**: `#0d0d0b` (near-black)
- **Accent**: `#8a9a6e` (olive/moss green)
- **Text**: `#f2ede6` (off-white)
- **Gold**: `#c4a86a` (highlights)
- **Display font**: Fraunces (italic)
- **Body font**: DM Sans
- **Mono font**: DM Mono

## Project Structure

```
src/
├── pages/          # Page components + CSS Modules
├── components/
│   ├── layout/     # Navbar, Footer
│   └── ui/         # ClassCard, TrainerCard, TestimonialCard, Stars, SectionHeader
├── data/           # All hardcoded data
├── types/          # TypeScript interfaces
├── hooks/          # useScrolled
├── utils/          # cn(), formatPrice(), calendar helpers
└── styles/         # globals.css
```
