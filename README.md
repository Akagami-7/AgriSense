# AgriSense: AI-Powered Smart Farming Assistant

AgriSense is a professional-grade agricultural platform designed to empower modern agronomists and farmers with real-time, AI-driven insights. By blending high-precision data analysis with an intuitive, nature-inspired design, AgriSense simplifies complex farming decisions.

> [!NOTE] 
> For first-time setup and installation, please visit - [Instructions Guide](instructions.md)

## Key Features

- **AI Crop Detection**: Real-time identification of crop types and health status from imagery using Gemini AI.
- **Smart Soil Analysis**: Detailed diagnostic reports on soil composition and health metrics.
- **Precision Weather Monitoring**: Localized weather forecasts with agricultural-specific data.
- **Synchronized Field Dashboard**: Visualizes scan history and trends with enterprise-level granularity.
- **Secure Authentication**: Built-in email/password and Google login powered by Firebase.
- **Expert Farming Tips**: Curated agricultural advice based on seasonal and regional data.

## Tech Stack

- **Frontend**: React (v18), TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, CSS Variables
- **UI Components**: Radix UI (Shadcn UI pattern)
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React
- **Validation**: Zod & React Hook Form

## Project Structure

```text
AgriSense/
├── public/                 # Static assets (icons, logo)
├── src/
│   ├── assets/             # Images and global styles
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Atomic design components (buttons, cards, etc.)
│   │   ├── AppLayout.tsx   # Core application layout wrapper
│   │   ├── AppSidebar.tsx  # Sidebar navigation system
│   │   ├── ChatbotWidget.tsx # AI assistant floating interface
│   │   ├── FloatingIsland.tsx # Top navigation bar
│   │   └── NavLink.tsx      # Specialized navigation link component
│   ├── context/            # Global state management
│   ├── hooks/              # Custom React hooks (logic reuse)
│   ├── lib/                # Utility libraries and helper functions
│   ├── pages/              # Main application views/routes
│   │   ├── CropDetection.tsx # Crop diagnostic interface
│   │   ├── Dashboard.tsx    # Session overview and analytics
│   │   ├── FarmingTips.tsx  # Educational resources
│   │   ├── Login.tsx        # Authentication entry point
│   │   ├── Profile.tsx      # User settings and preferences
│   │   ├── Reports.tsx      # Data export and history
│   │   ├── SoilAnalysis.tsx # Soil diagnostic interface
│   │   └── Weather.tsx      # Localized weather dashboard
│   ├── App.tsx             # Root component with routing logic
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind and design system styles
├── .env.example            # Template for environment variables
├── package.json            # Dependencies and npm scripts
├── tailwind.config.ts      # Tailwind CSS customization
└── vite.config.ts          # Vite build configuration
```

## File Explanations

### Root Directory
- **`package.json`**: Defines the project's dependencies, versioning, and scripts (`dev`, `build`, `lint`).
- **`vite.config.ts`**: Configuration for the Vite build tool, including plugins for React and path aliasing.
- **`tailwind.config.ts`**: Customizes the Tailwind CSS framework specifically for the AgriSense earthy design system.
- **`index.html`**: The single-page application entry point.

### Source Directory (`src/`)
- **`App.tsx`**: Sets up the global providers (QueryClient, Tooltip) and defines the application routes using `react-router-dom`.
- **`main.tsx`**: Bootstraps the React application into the DOM.
- **`index.css`**: Contains the global CSS variables for the color palette, typography, and foundational Tailwind directives.

#### `components/`
- **`AppLayout.tsx`**: Provides the consistent shell for the application, including the header and sidebar.
- **`ui/`**: A library of reusable, low-level components like `button.tsx`, `card.tsx`, and `dialog.tsx` based on Radix UI.
- **`ChatbotWidget.tsx`**: An interactive AI assistant that remains accessible across all pages.

#### `pages/`
- **`Dashboard.tsx`**: Aggregates data from recent scans into interactive charts using `Recharts`.
- **`CropDetection.tsx`**: Handles image uploads and processes them through an AI model to detect crop health.
- **`SoilAnalysis.tsx`**: Features a robust form system for inputting soil data and receiving diagnostic scores.

---
*Developed as a high-fidelity platform for the Smart Farming initiative.*
