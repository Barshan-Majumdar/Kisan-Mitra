import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { FarmerInput } from './pages/FarmerInput';
import { SystemPredicts } from './pages/SystemPredicts';
import { CropRecommendation } from './pages/CropRecommendation';
import { ToDoList } from './pages/ToDoList';
import { Chatbot } from './pages/Chatbot';
import { Schemes } from './pages/Schemes';
import { DiseaseDetect } from './pages/DiseaseDetect';
import { MarketPrices } from './pages/MarketPrices';
import { AdvisoryHistory } from './pages/AdvisoryHistory';
import { SoilCalibration } from './pages/SoilCalibration';
import { NotFound } from './pages/NotFound';

import { SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page (Unauthenticated Only) */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <LandingPage />
              </SignedOut>
            </>
          }
        />

        {/* Swipeable / Tabbed Auth Pages with Wildcard Support for OAuth & Verification */}
        <Route
          path="/login/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <AuthPage initialMode="signin" />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/signup/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <AuthPage initialMode="signup" />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/auth/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <AuthPage initialMode="signin" />
              </SignedOut>
            </>
          }
        />

        {/* Dedicated SSO Callback Route for OAuth Providers */}
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signInForceRedirectUrl="/dashboard"
              signUpForceRedirectUrl="/dashboard"
            />
          }
        />

        {/* Protected Farmer Workspace */}
        <Route
          element={
            <>
              <SignedIn>
                <WeatherProvider>
                  <MainLayout />
                </WeatherProvider>
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input" element={<FarmerInput />} />
          <Route path="/advisory-history" element={<AdvisoryHistory />} />
          <Route path="/calibrate" element={<SoilCalibration />} />
          <Route path="/predict" element={<SystemPredicts />} />
          <Route path="/recommendations" element={<CropRecommendation />} />
          <Route path="/todos" element={<ToDoList />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/disease" element={<DiseaseDetect />} />
          <Route path="/market" element={<MarketPrices />} />
        </Route>

        {/* 404 Route Unreachable */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
