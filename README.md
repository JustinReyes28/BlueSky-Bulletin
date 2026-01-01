# BlueSky | Your Friendly Weather Guide

BlueSky is your go-to app for easy-to-understand weather updates and personalized recommendations. We've combined the power of Next.js with smart AI to give you weather info that actually makes sense.

## ✨ What's Cool About BlueSky

- **Weather Made Simple:**
  - **Quick Updates:** Get the day's weather in just a couple of sentences.
  - **Personal Tips:** We'll suggest fun stuff to do based on the weather.
  - **Heads Up:** Get friendly warnings when the weather's about to change.
- **Interactive Map:** See real-time weather info on a cool map.
- **Find Anywhere:** Search for places or let us find you automatically.
- **Slick Design:** Clean, modern look that works great on any device.
- **Privacy First:** We don't store your personal info.
- **Super Fast:** Smart caching makes everything load quickly.

## ✦ Screenshots

Here are some screenshots of the BlueSky Bulletin application:

<img src="./images/img1.png" alt="Homepage View" width="500"/> <img src="./images/img2.png" alt="Weather Map View" width="500"/>
<img src="./images/img3.png" alt="AI Recommendations" width="800"/>

## ✦ Tech Stack

BlueSky uses some clever caching tricks to make sure you get info fast:

- **Weather Data:** Saved for 30 minutes
- **AI Insights:** Saved for 2 hours
- **Smart Limits:** We make sure nobody hogs all the requests

Check out [Caching.md](Caching.md) for all the techy details.

## 🛠️ What We're Built With

- **Framework:** [Next.js 14](https://nextjs.org/) (the new hotness)
- **UI:** [React 18](https://reactjs.org/) (because it's awesome)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (makes things look good fast)
- **Maps:** [Leaflet.js](https://leafletjs.com/) (for that interactive map)
- **Weather Data:** [Open-Meteo](https://open-meteo.com/) (free and reliable)
- **AI Smarts:** [Mistral AI](https://mistral.ai/) (because regular weather apps are boring)
- **Validation:** [Zod](https://zod.dev/) (keeps our data clean)
- **Caching:** [Upstash Redis](https://upstash.com/) (makes everything faster)
- **Hosting:** [Vercel](https://vercel.com/) (where the magic happens)

## 🚀 Getting Started

### What You'll Need

- Node.js 18.17 or newer
- A Mistral API key (get one [here](https://mistral.ai/))
- An Upstash Redis database (they have a free tier!)

### Setup

1. **Grab the code:**
   ```bash
   git clone https://github.com/your-username/bluesky.git
   cd bluesky
   ```

2. **Install the goodies:**
   ```bash
   npm install
   ```

3. **Set up your keys:**
   Create a `.env.local` file and add:
   ```env
   MISTRAL_API_KEY=your_mistral_key_here
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. **Fire it up:**
   ```bash
   npm run dev
   ```

Now open [http://localhost:3000](http://localhost:3000) in your browser and check it out!


## 🗂️ How It's Organized

- `/app`: All the Next.js pages and API stuff
- `/components`: Reusable bits of the interface
- `/lib`: The brains of the operation
- `/hooks`: Handy React helpers
- `/public`: Images and other static stuff

## 📜 The Legal Stuff

This is a private project just for showing off what we can do.
