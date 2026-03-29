# Setup & Usage Instructions

This document provides a clear, step-by-step guide to setting up and running the AgriSense Smart Farming Assistant on your local development environment.

## 📋 Step 0: Initial Environment Setup

If you are setting this up on a fresh computer, follow these steps to install the core engines:

### 1. Install Node.js & npm (The Engine)
AgriSense runs on Node.js. It comes bundled with `npm` (Node Package Manager).
- **Download**: Go to [nodejs.org](https://nodejs.org/) and download the **LTS (Long Term Support)** version for Windows.
- **Install**: Run the downloaded `.msi` file. Keep all default settings (click "Next" until finished).
- **Verify**: Open your **Command Prompt (cmd)** or **PowerShell** and type:
  ```bash
  node -v
  npm -v
  ```
  *If you see version numbers (e.g., v20.x.x), you are ready!*

### 2. Vite (The Development Engine)
Vite is the professional build tool that makes AgriSense fast. **You do not need to install Vite separately.** 
- It is included automatically when you run `npm install` in Step 2.
- It will run in your browser automatically when you start the project.

## 🚀 Getting Started (Client Quick-Start)

Follow these steps once your environment is ready:

### Step 1: Open the Project
Locate your `AgriSense` folder. Right-click inside the folder and select **"Open in Terminal"** or **"Open Command Window Here"**.

### Step 2: Install Project Components
Run this command to set up the internal libraries (Vite, React, etc.):
```bash
npm install
```
*Wait 1-2 minutes. A `node_modules` folder will be created. This only needs to be done once.*

### Step 3: Launch the Application
Run this command to start the development engine (Vite):
```bash
npm run dev
```

### Step 4: Access the Dashboard
Once the server is "ready", look for the local URL in your terminal:
- **Default**: [http://localhost:8080/](http://localhost:8080/)
- Open your web browser and paste the URL.
- The AgriSense Login page will appear.

## 🔑 API Configuration (Real AI & Weather)

To enable real AI crop diagnosis and real-time weather data, you need to add your personal API keys. These keys are kept private on your local machine and are not shared on GitHub.

### Method 1: In-App Configuration (Recommended)
1. **Launch the App** and sign in.
2. Navigate to the **Profile** page in the sidebar.
3. Scroll down to the **API Cloud Configuration** section.
4. Paste your **Gemini** and **OpenWeather** keys into the respective fields.
5. Click **Apply & Save Configurations**. The app will refresh and start using your real data immediately!

### Method 2: Environment Variables (Advanced)
1. **Create Environment File**: In the project root, create a new file named `.env` (or copy `.env.example` and rename it to `.env`).
2. **Get Google Gemini Key**: 
   - Visit [Google AI Studio](https://aistudio.google.com/).
   - Click "Get API Key" and copy it.
   - In your `.env` file, paste it: `VITE_GEMINI_API_KEY=your_key_here`
3. **Get OpenWeatherMap Key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api).
   - Sign up for a free "Current Weather" API key.
   - In your `.env` file, paste it: `VITE_OPENWEATHER_API_KEY=your_key_here`

*Note: The application will continue to work in "Simulation Mode" if no keys are provided.*

## ✨ Using the Platform

### Authentication
Use any email and password to log in. The system is currently configured for demonstration purposes.

### Features
- **Dashboard**: Get a high-level overview of your farm's health and statistics.
- **Crop Detection**: Navigate here to identify crop diseases by uploading an image.
- **Soil Analysis**: Input your field's soil metrics to receive tailored crop advice.
- **Weather Insights**: Monitor agricultural weather risks and 7-day forecasts.
- **AI Assistant**: Click the green sprout icon in the bottom-right corner to talk to the AgriSense AI.

## 🌙 Dark Mode
You can toggle between Dark and Light modes using the moon/sun icon in the top header. This is especially useful for early morning or late evening farm management.

---
*For any technical issues or further customization, please refer to the project's source code documentation.*
