import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CloudRain, Wind, Edit2, Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import api from '../services/api';

export const SystemPredicts: React.FC = () => {
  const navigate = useNavigate();
  // Retrieve passed state
  const location = useLocation();
  const district = location.state?.district;
  const irrigation = location.state?.irrigation;
  const manualSoilType = location.state?.soilType;
  const area = location.state?.area;

  const [isEditing, setIsEditing] = useState(false);
  const [rawData, setRawData] = useState({
    N_Ratio: 0,
    P_Ratio: 0,
    K_Ratio: 0,
    Temp: 0,
    Humidity: 0,
    pH: 0,
    Rainfall: 0,
  });

  const [data, setData] = useState({
    soilType: manualSoilType || 'Loading...',
    nitrogen: '--',
    phosphorus: '--',
    potassium: '--',
    ph: '--',
    temp: '--',
    humidity: '--',
    rainfall: '--',
  });

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      try {
        // Fetch Weather
        const weatherRes = await api.get('/weather', { params: { district } });
        let weatherData = { Temp: 0, Humidity: 0, Rainfall: 0 };

        if (weatherRes.data) {
          weatherData = {
            Temp: weatherRes.data.temperature || 0,
            Humidity: weatherRes.data.humidity || 0,
            Rainfall: weatherRes.data.rainfall || 0
          };

          setData(prev => ({
            ...prev,
            temp: weatherData.Temp + '°C',
            humidity: weatherData.Humidity + '%',
            rainfall: weatherData.Rainfall + ' mm',
          }));
        }

        // Fetch Soil (New Endpoint Logic)
        const soilRes = await api.get('/soil-data', { params: { district } });
        if (soilRes.data && soilRes.data.soilType) {
          const fetchedSoil = soilRes.data;

          setData(prev => ({
            ...prev,
            // Use manual if available, else fetched
            soilType: manualSoilType || fetchedSoil.soilType,
            ph: String(fetchedSoil.ph),
            nitrogen: String(fetchedSoil.nitrogen),
            phosphorus: String(fetchedSoil.phosphorus),
            potassium: String(fetchedSoil.potassium)
          }));

          // Update rawData with both soil and weather
          setRawData({
            ...weatherData,
            N_Ratio: Number(fetchedSoil.nitrogen) || 0,
            P_Ratio: Number(fetchedSoil.phosphorus) || 0,
            K_Ratio: Number(fetchedSoil.potassium) || 0,
            pH: Number(fetchedSoil.ph) || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch environment data:', error);
      }
    };

    if (district) fetchEnvironmentData();
  }, [district, manualSoilType]);

  const handleSave = () => {
    // Parse numeric values from display strings
    const parseNum = (str: string) => {
      const num = parseFloat(str.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    setRawData(prev => ({
      ...prev,
      Temp: parseNum(data.temp),
      Humidity: parseNum(data.humidity),
      Rainfall: parseNum(data.rainfall),
      pH: parseNum(data.ph),
      N_Ratio: parseNum(data.nitrogen),
      P_Ratio: parseNum(data.phosphorus),
      K_Ratio: parseNum(data.potassium),
    }));

    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Analysis</h2>
        <p className="text-gray-600">Based on your location and season, we've detected the following conditions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Card */}
        <Card className="p-6 bg-blue-50 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Weather Forecast</h3>
            <CloudRain className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Temperature</span>
              <span className="font-medium text-blue-900">{data.temp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Humidity</span>
              <span className="font-medium text-blue-900">{data.humidity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Rainfall</span>
              <span className="font-medium text-blue-900">{data.rainfall}</span>
            </div>
          </div>
        </Card>

        {/* Soil Card */}
        <Card className="p-6 bg-amber-50 border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-900">Soil Properties</h3>
            <Wind className="h-6 w-6 text-amber-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-amber-700">Soil Type</span>
              <span className="font-medium text-amber-900">{data.soilType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-700">pH Level</span>
              <span className="font-medium text-amber-900">{data.ph}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-700">NPK Status</span>
              <span className="font-medium text-amber-900">{data.nitrogen}-{data.phosphorus}-{data.potassium}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Values
        </Button>
        <Button
          className="flex-1"
          onClick={() => navigate('/recommendations', {
            state: {
              district,
              irrigation,
              area, // Pass area through
              envData: { ...rawData, Soil: data.soilType }
            }
          })}
        >
          Get Recommendations <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Environmental Data"
      >
        <div className="space-y-4">
          <Input
            label="Soil Type"
            value={data.soilType}
            onChange={(e) => setData({ ...data, soilType: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Temperature"
              value={data.temp}
              onChange={(e) => setData({ ...data, temp: e.target.value })}
            />
            <Input
              label="Rainfall"
              value={data.rainfall}
              onChange={(e) => setData({ ...data, rainfall: e.target.value })}
            />
          </div>
          <Button className="w-full" onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
};
