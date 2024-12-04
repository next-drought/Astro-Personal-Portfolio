import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Droplets, Thermometer } from 'lucide-react';

interface AnalyticsData {
  timestamp: string;
  soilMoisture: number;
  precipitation: number;
  temperature: number;
  droughtIndex: number;
}

interface APIResponse {
  data: AnalyticsData[];
}

const DataAnalytics = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/environmental-data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData: APIResponse = await response.json();
        setData(jsonData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <AlertTriangle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  const latestData = data[0];

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center space-x-2">
            <Droplets className="text-blue-500" />
            <h3 className="text-lg font-semibold">Soil Moisture</h3>
          </div>
          <p className="text-2xl mt-2">{latestData?.soilMoisture}%</p>
        </div>
        
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center space-x-2">
            <Thermometer className="text-red-500" />
            <h3 className="text-lg font-semibold">Temperature</h3>
          </div>
          <p className="text-2xl mt-2">{latestData?.temperature}°C</p>
        </div>

        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Drought Index</h3>
          </div>
          <p className="text-2xl mt-2">{latestData?.droughtIndex.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="soilMoisture"
              stroke="#3B82F6"
              name="Soil Moisture %"
            />
            <Line
              type="monotone"
              dataKey="precipitation"
              stroke="#10B981"
              name="Precipitation (mm)"
            />
            <Line
              type="monotone"
              dataKey="droughtIndex"
              stroke="#F59E0B"
              name="Drought Index"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataAnalytics;
