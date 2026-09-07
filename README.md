# Weather Intelligence

A high-performance weather intelligence web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, powered by the open-source meteorological models of **Open-Meteo**.

The application delivers current conditions, 24-hour hourly outlooks, 7-day extended forecasts, atmospheric telemetry (UV, wind vectors, barometric pressure, daylight cycle), and smart outdoor and daily planning recommendations.

---

## Key Features

- **Global Location Search**: Instant search with debounced autocomplete for cities, regions, and countries via the Open-Meteo Geocoding API.
- **Device Geolocation**: One-click GPS location detection with reverse geocoding to resolve your immediate city.
- **Popular & Recent Destinations**: Quick-filter pills for major global cities (New York, London, Tokyo, Paris, Sydney, Dubai, San Francisco, Singapore) alongside persistent local search history.
- **Current Weather Hero**: Displays current temperature, "feels like" metrics, WMO condition indicators, daily high/low spans, and synchronized local time by city timezone.
- **Weather Intelligence & Planning**:
  - **Umbrella Meter**: Calibrated risk gauge indicating whether rain gear is unnecessary, optional, recommended, or essential.
  - **Optimal Activity Window**: Evaluates the 24-hour hourly curve to compute the best daylight window for outdoor runs, cycling, or recreation.
  - **Categorized Planning Cards**: Tailored recommendations for clothing and layer selection, outdoor workout viability, commute and road safety, and UV sun protection.
  - **7-Day Strategic Insights**: Automatically synthesizes the wettest day, temperature swings, and weekend outlook.
- **24-Hour Hourly Timeline**: Smooth, horizontally scrollable outlook showing hourly temperatures, condition icons, and precipitation probabilities.
- **7-Day Forecast with Visual Ranges**: Day-by-day temperature range bars calculated relative to the week's extremes, with expandable panels for UV peaks, wind gusts, total precipitation, and sunrise/sunset times.
- **Atmospheric Gauges**:
  - Solar UV Index with color-coded exposure bands.
  - Wind Direction compass dial with gust readings.
  - Relative Humidity comfort rating.
  - Barometric Sea-Level Pressure analysis.
  - Solar Day Cycle tracking daylight percentage elapsed.
- **Measurement Unit Toggle**: Seamlessly toggle between Metric (°C, km/h) and Imperial (°F, mph) units with instant `localStorage` persistence.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS v4
- **Iconography**: Lucide React
- **Data Source**: [Open-Meteo API](https://open-meteo.com/) (Forecast & Geocoding APIs, free and no API key required)

---

## Project Structure

```text
├── index.html                   # HTML entry point with typography & meta tags
├── package.json                 # Dependencies and build scripts
├── public/
│   └── _redirects               # Cloudflare Pages SPA routing redirect
├── src/
│   ├── main.tsx                 # React DOM mount
│   ├── App.tsx                  # Core application shell & state orchestration
│   ├── index.css                # Tailwind CSS imports & global rules
│   ├── types/
│   │   └── weather.ts           # TypeScript interfaces for weather & geocoding data
│   ├── services/
│   │   └── weatherApi.ts        # Open-Meteo API integrations & WMO code mapper
│   ├── utils/
│   │   ├── formatters.ts        # Unit formatting, UV levels, & wind calculations
│   │   └── weatherIntelligence.ts # Planning heuristics & activity window engine
│   └── components/
│       ├── Header.tsx           # Search bar, autocomplete, GPS, & unit toggles
│       ├── CityPills.tsx        # Popular destinations & recent search history
│       ├── CurrentWeatherCard.tsx # Hero current weather display
│       ├── PlanningIntelligence.tsx # Daily verdict, umbrella meter, & advice cards
│       ├── HourlyForecast.tsx   # 24-hour horizontal scrolling timeline
│       ├── DailyForecast.tsx    # 7-day forecast with expandable details
│       ├── WeatherMetricsGrid.tsx # Atmospheric telemetry & compass gauges
│       ├── WeatherIcon.tsx      # Lucide icon mapping for WMO condition codes
│       └── LoadingSkeleton.tsx  # Smooth animated skeleton placeholder
└── vite.config.ts               # Vite configuration
```

---

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or newer recommended)
- `npm` (bundled with Node.js)

### Installation & Run

1. **Clone the repository or open the project folder**:
   ```bash
   cd weather-intelligence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the URL printed in your terminal).

4. **Verify TypeScript & linting**:
   ```bash
   npm run lint
   ```

5. **Create a production build**:
   ```bash
   npm run build
   ```
   The compiled static assets will be output into the `dist/` directory.

---

## How to Deploy via Cloudflare

Because Weather Intelligence is a pure client-side single page application (SPA) with zero external server dependencies, it is ideally suited for deployment on **Cloudflare Pages**. Cloudflare Pages serves the app globally via Cloudflare's edge CDN with automated SSL, lightning-fast TTFB, and zero hosting costs on the free tier.

You can deploy using either the **Cloudflare Dashboard (Git Integration)** or the **Wrangler CLI**.

---

### Method 1: Deploy via Cloudflare Dashboard (Recommended)

Connecting your Git repository (GitHub or GitLab) to Cloudflare Pages enables automatic continuous deployments whenever you push new commits.

1. **Push your code to GitHub or GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Weather Intelligence app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Log in to the Cloudflare Dashboard**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and sign in.

3. **Create a new Pages project**:
   - In the left sidebar, navigate to **Compute (Workers & Pages)** > **Create application**.
   - Select the **Pages** tab.
   - Click **Connect to Git**.

4. **Select your repository**:
   - Authorize Cloudflare to access your GitHub or GitLab account.
   - Select your `weather-intelligence` repository and click **Begin setup**.

5. **Configure Build Settings**:
   Fill in the build configuration:
   - **Project name**: `weather-intelligence` (or your preferred subdomain)
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty or slash)

6. **Environment Variables (Optional)**:
   Under **Environment variables**, you can optionally pin the Node.js version:
   - Variable name: `NODE_VERSION`
   - Value: `20`

7. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare Pages will clone the repository, install dependencies, run `npm run build`, and publish your site.
   - Once completed, you will receive a free `*.pages.dev` URL (e.g., `https://weather-intelligence.pages.dev`).

---

### Method 2: Direct CLI Deployment via Wrangler

If you prefer to deploy directly from your local command line without linking a Git repository, use Cloudflare's official CLI tool, **Wrangler**:

1. **Build the production bundle**:
   ```bash
   npm run build
   ```
   Confirm that the `dist/` folder exists and contains `index.html`.

2. **Deploy to Cloudflare Pages using Wrangler**:
   ```bash
   npx wrangler pages deploy dist --project-name=weather-intelligence
   ```

3. **Authenticate**:
   - If this is your first time using Wrangler, your browser will open to authenticate with your Cloudflare account.
   - Click **Allow**.

4. **Review your deployment**:
   - Wrangler will upload the static assets from `dist/` and output your live deployment URL immediately.

---

### Single Page Application (SPA) Routing Note

The `public/_redirects` file is included in this repository with the following rule:
```text
/*    /index.html   200
```
When Vite builds the project, this file is copied directly to `dist/_redirects`. This ensures Cloudflare Pages routes all direct URL navigations back to `index.html` without returning 404 errors.

---

### Custom Domain Setup (Optional)

To connect a custom domain (e.g., `weather.yourdomain.com`):
1. In the Cloudflare Dashboard, navigate to **Compute (Workers & Pages)** > **Pages**.
2. Select your `weather-intelligence` project.
3. Click the **Custom domains** tab.
4. Click **Set up a custom domain** and enter your domain or subdomain.
5. Cloudflare will automatically provision a free SSL/TLS certificate and manage DNS routing.

---

## API Attribution

This project uses meteorological data and geocoding services from **[Open-Meteo](https://open-meteo.com/)**:
- Open-Meteo provides free weather forecasts under the Attribution 4.0 International (CC BY 4.0) license.
- No API keys or registration are required.
