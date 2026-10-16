
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

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



import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/" element={
          <>
            <SignedIn>
              <WeatherProvider>
                <MainLayout />
              </WeatherProvider>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="input" element={<FarmerInput />} />
          <Route path="advisory-history" element={<AdvisoryHistory />} />
          <Route path="calibrate" element={<SoilCalibration />} />
          <Route path="predict" element={<SystemPredicts />} />
          <Route path="recommendations" element={<CropRecommendation />} />
          <Route path="todos" element={<ToDoList />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="disease" element={<DiseaseDetect />} />
          <Route path="market" element={<MarketPrices />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
