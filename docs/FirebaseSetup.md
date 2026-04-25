# Firebase Authentication Setup

This project uses Firebase Authentication for secure, passwordless-style flows, Google Sign-In, and standard email/password authentication. 

You must provide your own Firebase configuration via environment variables. Follow the steps below.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts to create a new project.
3. Once created, click on the **Web** icon (`</>`) to add a web app to your project.
4. Register the app (you can leave Firebase Hosting unchecked for local dev).
5. Firebase will provide a `firebaseConfig` object containing properties like `apiKey`, `authDomain`, etc. Keep this handy.

## 2. Enable Authentication Providers

1. In the Firebase Console sidebar, go to **Build** > **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable the following providers:
   - **Email/Password**: Enable this provider. Leave "Email link (passwordless sign-in)" disabled as we use standard Email Verification.
   - **Google**: Enable this provider. You'll need to select a support email address.

## 3. Update Environment Variables

Locate the `.env` file in the root of the AgriSense project. You must append the following properties using the values from your `firebaseConfig` object (from Step 1). 

**IMPORTANT**: Each variable must start with `VITE_` so it is accessible within the React app. Do NOT modify the existing variables.

```env
# Append these lines to your .env file
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

## 4. Run the Project

The Firebase Authentication logic is already implemented. Once you restart the development server, you will be able to sign up, sign in, verify your email, log in with Google, and reset your password.

```bash
# Start the development server
npm run dev:full
```
