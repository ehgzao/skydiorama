# 🏙️ SkyDiorama

> **Free, open-source weather app that transforms real weather data into beautiful AI-generated 3D isometric city dioramas.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

<img width="2912" height="1440" alt="Image" src="https://github.com/user-attachments/assets/6df4d716-5a0d-457e-a3a4-e1af48fa7573">

## ✨ Features

- 🌍 **Real-time Weather Integration** — Connect to any city worldwide and get current weather conditions
- 🎨 **AI Image Generation** — Powered by Gemini AI to create stunning city-specific dioramas
- 🏙️ **Isometric 3D Art** — Beautiful miniature dioramas with tilt-shift photography effects
- 🌈 **Weather-based Visual Effects** — Dynamic glow and borders that reflect current weather conditions
- 📍 **City Recognition** — Each diorama features iconic landmarks and architectural elements specific to the selected city
- 💎 **Modern UI** — Sleek, responsive interface with smooth animations and interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A free [Gemini API Key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/ehgzao/skydiorama.git

# Install dependencies
cd skydiorama
npm install

# Set up environment variables
cp .env.example .env
# Add your Gemini API key to .env file

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating beautiful weather dioramas!

## 🎨 How It Works

1. **Search for any city** worldwide
2. **Get real-time weather data** from Open-Meteo (free, no API key needed)
3. **Generate an AI diorama** with city-specific landmarks via Gemini
4. **Weather-based visual effects** are applied dynamically (glow borders, particles)
5. **Download or share** your creation

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | Image caching |
| [Open-Meteo](https://open-meteo.com/) | Weather data (free) |
| [Google Gemini](https://ai.google.dev/) | AI image generation |
| [Lucide React](https://lucide.dev/) | Icons |

## 📁 Project Structure

```
skydiorama/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles + weather effects
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── CityList.tsx       # Saved cities list
│   │   ├── CitySearch.tsx     # City search input
│   │   ├── DioramaDisplay.tsx # Main diorama view + weather glow
│   │   ├── SettingsPanel.tsx  # Settings & API key input
│   │   └── WeatherInfo.tsx    # Weather details card
│   └── lib/
│       ├── gemini.ts          # Gemini API client + prompt builder
│       ├── image-cache.ts     # IndexedDB image storage
│       ├── store.ts           # Zustand store
│       ├── weather.ts         # Open-Meteo API client
│       └── utils.ts           # Helper functions
├── public/
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 🎨 The Diorama Prompt

The magic happens in `src/lib/gemini.ts` with a carefully crafted prompt that:

- Requests a **45° isometric miniature 3D scene** of the specific city
- Emphasizes **real landmarks and architectural identity** (not generic buildings)
- Integrates **current weather conditions** into the scene naturally
- Maintains **vibrant, natural colors** without artificial filters
- Adds a **text overlay** with city name, weather icon, and temperature

The prompt explicitly enforces color fidelity — weather affects lighting and shadows, but never washes out the palette. Each city should be recognizable at a glance.

Feel free to tweak it and experiment!

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

- 🐛 **Report Bugs** — Open an issue describing the bug
- 💡 **Suggest Features** — Share your ideas in Discussions
- 🔧 **Submit PRs** — Fix bugs or add features
- 📖 **Improve Docs** — Help make our docs better

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/skydiorama.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add amazing feature'

# Push and open a PR
git push origin feature/amazing-feature
```

### Ideas for Contributions

- [ ] Add more weather conditions (aurora, sandstorm, etc.)
- [ ] Add support for alternative AI providers (DALL-E, Stable Diffusion)
- [ ] Implement hourly auto-refresh
- [ ] Add PWA support
- [ ] Create a browser extension
- [ ] Add widget support for mobile

## 📄 License

MIT License — feel free to use this project for anything!

## 🙏 Acknowledgments

- Inspired by [CitiScene](https://citiscene.app/)
- [Open-Meteo](https://open-meteo.com/) for the free weather API
- [Google Gemini](https://ai.google.dev/) for AI image generation

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ehgzao">Gab Lima</a>
  <br>
  <a href="https://github.com/ehgzao/skydiorama">⭐ Star on GitHub</a>
</p>
