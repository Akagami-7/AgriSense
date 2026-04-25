# AgriSense Setup & Installation Guide

This document provides a clear, step-by-step guide to setting up and running the AgriSense Smart Farming Assistant on your own computer.

---

## 🚀 Step-by-Step Local Setup

Follow these exact steps to run the AgriSense platform locally.

### Step 1: Install Node.js
Before starting, you need to have Node.js installed on your computer.
1. Download Node.js from the [official website](https://nodejs.org/).
2. Run the installer and simply click "Next" through the default setup options. 

### Step 2: Extract the Project
1. If you downloaded this project as a `.zip` file, right-click the file and select **Extract All**.
2. Open the newly extracted `AgriSense` folder.

### Step 3: Open the Terminal
1. Open your computer's terminal or command prompt.
   - **Windows:** Press `Win + R`, type `cmd`, and hit Enter.
   - **Mac:** Open Spotlight (Cmd + Space) and search for `Terminal`.
2. Navigate into your project folder. An easy way to do this is to type `cd ` (with a space) and then drag and drop the `AgriSense` folder right into the terminal window, then hit Enter.

### Step 4: Install Dependencies
In your terminal, type the following command and hit Enter:
```bash
npm install
```
*(Wait a minute or two for this to finish downloading the required project files).*

### Step 5: Setup Your Environment (.env file)
The project requires several configuration keys to connect to Firebase authentication and the database.

1. In the `AgriSense` folder, look for a file named `.env.example`.
2. Rename this file to exactly `.env` (make sure it doesn't say `.env.txt`).
3. Open the `.env` file in any text editor (like Notepad or VS Code).

#### 🛠️ Firebase Console Setup Guide
Follow these steps to get your Firebase keys:

1. **Create a Project:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click **Add project** and give it a name (e.g., "AgriSense").
   - Follow the prompts to finish creating the project (Google Analytics is optional).

2. **Enable Authentication:**
   - In the left sidebar, go to **Build > Authentication**.
   - Click **Get Started**.
   - Go to the **Sign-in method** tab, click **Add new provider**, and select **Google**.
   - Enable it, choose a project support email, and click **Save**.

3. **Enable Firestore Database:**
   - In the left sidebar, go to **Build > Firestore Database**.
   - Click **Create database**.
   - Select a location near you.
   - For **Security rules**, select **Start in test mode** (this allows you to start quickly, but remember to update these rules for production!). Click **Create**.

4. **Register Your Web App:**
   - Click the **Project Overview** (gear icon) in the top left and select **Project settings**.
   - Scroll down to the **Your apps** section and click the **Web icon (</>)**.
   - Register your app with a nickname (e.g., "AgriSense-Web").
   - You will see a `firebaseConfig` object in the code snippet.

5. **Update your .env file:**
   - Copy the values from the `firebaseConfig` and paste them into your `.env` file:
     - `apiKey` → `VITE_FIREBASE_API_KEY`
     - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
     - `projectId` → `VITE_FIREBASE_PROJECT_ID`
     - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
     - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `appId` → `VITE_FIREBASE_APP_ID`

*(Note: You will input your Google Gemini and OpenWeather API keys directly inside the platform's Profile page once the app is running!)*

### Step 6: Start the Application!
In your terminal, type the following command and hit Enter:
```bash
npm run dev
```
You will quickly see a local link appear in the terminal, looking something like `http://localhost:5173/` or `http://localhost:8080/`. 
Hold down `Ctrl` (or `Cmd` on Mac) and click that link to open the fully working app in your browser!
