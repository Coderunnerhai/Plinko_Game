# 🎲 Plinko Game - Provably Fair

A fully functional Plinko game built with **React** (frontend) and **Node.js/Express** (backend), featuring a provably-fair commit-reveal RNG protocol, deterministic outcomes, and smooth animations.

**Live Demo:** [Your Vercel Frontend URL]  
**Backend API:** [Your Render Backend URL]  
**Verifier Page:** [Your Vercel URL]/verify

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Provably-Fair Protocol](#provably-fair-protocol)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [AI Usage](#ai-usage)
- [Time Log](#time-log)
- [Future Improvements](#future-improvements)

---

## ✨ Features

### Gameplay
- **12-row triangular peg board** with 13 payout bins
- **Selectable drop column** (0–12) with keyboard controls (←/→ arrows, Space to drop)
- **Bet amount** input (game currency, no real money)
- **Smooth ball animations** with peg collision effects
- **Bin pulse + confetti** on landing
- **Sound effects** with mute toggle

### Provably-Fair System
- **Commit-reveal protocol** with client contribution
- **Deterministic PRNG** (xorshift32) seeded from SHA256 combined seed
- **Replayable outcomes** - same inputs produce identical results
- **Public verifier page** to independently verify any round

### Accessibility
- `prefers-reduced-motion` support
- Keyboard navigation (left/right column selection, space to drop)
- Fully responsive (mobile, tablet, desktop)

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐
│ Frontend (Vercel - React) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Game Board │ │ Controls │ │ Verifier Page │ │
│ │ (Canvas) │ │ │ │ │ │
│ └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘ │
│ │ │ │ │
│ └────────────────┼─────────────────────┘ │
│ │ │
│ HTTP Requests (Axios) │
│ │ │
└──────────────────────────┼────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Backend (Render - Node.js) │
│ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ API Routes │ │
│ │ • POST /api/rounds/commit │ │
│ │ • POST /api/rounds/:id/start │ │
│ │ • POST /api/rounds/:id/reveal │ │
│ │ • GET /api/rounds/:id │ │
│ │ • GET /api/verify │ │
│ └──────────────────────────────────────────────────────┘ │
│ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ SHA256 │ │ xorshift32 │ │
│ │ Hashing │ │ PRNG │ │
│ └─────────────┘ └─────────────┘ │
│ │
│ ┌─────────────┐ │
│ │ In-Memory │ │
│ │ Storage │ │
│ └─────────────┘ │
└─────────────────────────────────────────────────────────────┘