# 🚀 IdeaSpark App

Welcome! This repository contains everything you need to run and deploy your AI Studio app locally.

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/)

---

## ⚡ Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up your API key**  
   Create a file named `.env.local` in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

   The app will start on [http://localhost:3000](http://localhost:3000).

---

## 📦 Deployment

### Deploying to GitHub Pages

1. **Install the GitHub Pages package** (already installed):
   ```powershell
   npm install --save gh-pages
   ```

2. **Update `package.json`**
   - Add a `homepage` field:
     ```json
     "homepage": "https://your-username.github.io/your-repo"
     ```
   - Add deploy scripts:
     ```json
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
     ```

3. **Build and deploy**
   ```powershell
   npm run deploy
   ```

4. **Visit your site**
   Go to `https://your-username.github.io/your-repo` in your browser.

---

## 📄 License

This project is licensed under the MIT License.
