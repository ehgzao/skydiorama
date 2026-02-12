# 🏙️ SkyDiorama

> **Free, open-source weather app that transforms real weather data into beautiful AI-generated 3D isometric city dioramas.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

![SkyDiorama Preview](./preview.png)

## ✨ Features

- � **Real-time Weather Integration** - Connect to any city worldwide and get current weather conditions
- 🎨 **AI Image Generation** - Powered by Gemini AI to create stunning city-specific dioramas
- 🏙️ **Isometric 3D Art** - Beautiful miniature dioramas with tilt-shift photography effects
- 🌈 **Weather-based Visual Effects** - Dynamic glow and borders that reflect current weather conditions
- � **City Recognition** - Each diorama features iconic landmarks and architectural elements specific to the selected city
- � **Modern UI** - Sleek, responsive interface with smooth animations and interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key (free)

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

Open [http://localhost:3000](http://localhost:3000) to start creating beautiful weather dioramas! 🎨

## 🎨 How It Works

1. **Search for any city** worldwide 🌍
2. **Get real-time weather data** 🌡️
3. **Generate AI diorama** with city-specific landmarks 🏗️
4. **Apply weather-based visual effects** ✨
5. **Download or share** your creation 💾

## 🏗️ Technology Stack

- **Frontend:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS with custom weather effects
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State Management:** Zustand
- **AI:** Google Gemini API
- **Storage:** IndexedDB for images, localStorage for metadata
- **Deployment:** Vercel (continuous deployment)

## � Sample Generated Dioramas
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [Open-Meteo](https://open-meteo.com/) | Weather data (free) |
| [Gemini AI](https://ai.google.dev/) | Image generation |

## 📁 Project Structure

```
skydiorama/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/
│   │   ├── CityList.tsx     # Saved cities list
│   │   ├── CitySearch.tsx   # City search input
│   │   ├── DioramaDisplay.tsx # Main diorama view
│   │   ├── SettingsPanel.tsx  # Settings & BYOK
│   │   └── WeatherInfo.tsx  # Weather details
│   └── lib/
│       ├── gemini.ts        # Gemini API client
│       ├── store.ts         # Zustand store
│       └── weather.ts       # Weather API client
├── public/
├── tailwind.config.js
├── next.config.js
└── package.json
```

## 🎨 The Diorama Prompt

The magic happens with this carefully crafted prompt:

```
Present a clear, 45° top-down isometric miniature 3D cartoon scene of {CITY}, 
featuring its most iconic landmarks and architectural elements.

Use soft, refined textures with realistic PBR materials and gentle, lifelike 
{lighting based on time of day}. 

Current weather: {condition}, {temperature}°C, {time of day}.
{Weather-specific effects like rain, snow, fog}

Create an immersive {atmospheric mood} atmosphere. Use a clean, minimalistic 
composition with a soft, solid-colored background.

At the top-center, place the title "{CITY}" in large bold text, a prominent 
weather icon, then the temperature. All text centered with consistent spacing.

Style: Adorable miniature diorama, tilt-shift effect, highly detailed, 
professional quality, award-winning illustration.
```

Feel free to modify it in `src/lib/gemini.ts`!

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Open an issue describing the bug
- 💡 **Suggest Features** - Share your ideas in Discussions
- 🔧 **Submit PRs** - Fix bugs or add features
- 📖 **Improve Docs** - Help make our docs better
- 🌍 **Add Translations** - Help us go multilingual

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

### Contribution Ideas

- [ ] Add more weather conditions (aurora, sandstorm, etc.)
- [ ] Implement image caching system
- [ ] Add widget support for mobile (React Native)
- [ ] Create a live wallpaper service
- [ ] Add support for alternative AI providers (DALL-E, Stable Diffusion)
- [ ] Implement hourly auto-refresh
- [ ] Add PWA support
- [ ] Create browser extension

## 📄 License

MIT License - feel free to use this project for anything!

## 🙏 Acknowledgments

- Inspired by [CitiScene](https://citiscene.app/) - the original idea
- [Open-Meteo](https://open-meteo.com/) for the free weather API
- [Google Gemini](https://ai.google.dev/) for AI image generation
- The open-source community ❤️

## ⭐ Star History

If you find this project useful, please give it a star! It helps others discover it.

---

<p align="center">
  Made with ❤️ by the community
  <br>
  <a href="https://github.com/skydiorama/skydiorama">Star on GitHub</a>
</p>
