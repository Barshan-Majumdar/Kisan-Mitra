# AI-Driven Agriculture Advisory Platform (Frontend)

A professional, responsive, mobile-first frontend for an AI-Driven Agriculture Advisory Platform built with React, TypeScript, and TailwindCSS.

## Features

- **Authentication**: Mocked OTP login flow.
- **Dashboard**: Central hub for all farming activities.
- **Advisory System**:
  - **Farmer Input**: GPS/Manual location and farm details.
  - **System Predicts**: Environmental analysis (Soil, Weather).
  - **Crop Recommendations**: AI-suggested crops based on data.
  - **Farming Plan**: Detailed to-do list for selected crops.
- **Smart Chatbot**: AI assistant for farming queries.
- **Disease Detection**: Image upload and analysis simulation.
- **Market Prices**: Real-time crop prices with sorting.
- **Government Schemes**: Information on subsidies and aid.
- **Daily Tasks**: Weather-based daily farming reminders.

## Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

```
src/
  ├── components/         # Reusable UI and feature components
  ├── layouts/           # Main application layouts
  ├── pages/             # Page components (views)
  ├── types/             # TypeScript definitions
  ├── utils/             # Helper functions and mock data
  ├── App.tsx            # Main router configuration
  └── main.tsx           # Entry point
```

## Mock Data

The application uses mocked data located in `src/utils/mockData.ts`. This can be easily replaced with real API calls in the future.
