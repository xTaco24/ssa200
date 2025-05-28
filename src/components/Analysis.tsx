import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';

const profileData = {
  casa: {
    energyData: [
      { name: 'Lun', consumo: 4.5 },
      { name: 'Mar', consumo: 5.2 },
      { name: 'Mié', consumo: 4.8 },
      { name: 'Jue', consumo: 5.5 },
      { name: 'Vie', consumo: 6.0 },
      { name: 'Sáb', consumo: 5.8 },
      { name: 'Dom', consumo: 4.2 },
    ],
    temperatureData: [
      { time: '00:00', temp: 22 },
      { time: '04:00', temp: 21 },
      { time: '08:00', temp: 23 },
      { time: '12:00', temp: 26 },
      { time: '16:00', temp: 28 },
      { time: '20:00', temp: 25 },
      { time: '23:59', temp: 23 },
    ],
    efficiency: 85,
    routineUsage: 70,
    thermalComfort: 92,
  },
  oficina: {
    energyData: [
      { name: 'Lun', consumo: 6.5 },
      { name: 'Mar', consumo: 6.2 },
      { name: 'Mié', consumo: 6.8 },
      { name: 'Jue', consumo: 6.5 },
      { name: 'Vie', consumo: 7.0 },
      { name: 'Sáb', consumo: 2.8 },
      { name: 'Dom', consumo: 2.2 },
    ],
    temperatureData: [
      { time: '08:00', temp: 23 },
      { time: '10:00', temp: 24 },
      { time: '12:00', temp: 25 },
      { time: '14:00', temp: 26 },
      { time: '16:00', temp: 25 },
      { time: '18:00', temp: 24 },
      { time: '20:00', temp: 23 },
    ],
    efficiency: 78,
    routineUsage: 90,
    thermalComfort: 88,
  },
};

const chartTheme = {
  light: {
    stroke: '#e5e7eb',
    fill: '#3b82f6',
    text: '#374151',
  },
  dark: {
    stroke: '#374151',
    fill: '#60a5fa',
    text: '#e5e7eb',
  },
};

export default function Analysis({ selectedProfile }: { selectedProfile: string }) {
  const [data, setData] = useState(profileData.casa);
  const [chartHeight, setChartHeight] = useState(300);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setData(profileData[selectedProfile as keyof typeof profileData] || profileData.casa);
  }, [selectedProfile]);

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth < 768 ? 200 : 300);
    };

    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2"
        >
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-foreground">Consumo de Energía Semanal</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <BarChart data={data.energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme[theme].stroke} />
                    <XAxis 
                      dataKey="name" 
                      stroke={chartTheme[theme].text}
                      tick={{ fill: chartTheme[theme].text }}
                    />
                    <YAxis 
                      stroke={chartTheme[theme].text}
                      tick={{ fill: chartTheme[theme].text }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: chartTheme[theme].text
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: chartTheme[theme].text }}
                    />
                    <Bar dataKey="consumo" fill={chartTheme[theme].fill} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2"
        >
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-foreground">Temperatura Diaria</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <LineChart data={data.temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme[theme].stroke} />
                    <XAxis 
                      dataKey="time" 
                      stroke={chartTheme[theme].text}
                      tick={{ fill: chartTheme[theme].text }}
                    />
                    <YAxis 
                      stroke={chartTheme[theme].text}
                      tick={{ fill: chartTheme[theme].text }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: chartTheme[theme].text
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: chartTheme[theme].text }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke={chartTheme[theme].fill}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 md:col-span-1"
        >
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-foreground">Resumen de Comportamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Eficiencia Energética</span>
                    <span className="text-sm font-medium text-foreground">{data.efficiency}%</span>
                  </div>
                  <Progress value={data.efficiency} className="bg-secondary" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Uso de Rutinas</span>
                    <span className="text-sm font-medium text-foreground">{data.routineUsage}%</span>
                  </div>
                  <Progress value={data.routineUsage} className="bg-secondary" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Confort Térmico</span>
                    <span className="text-sm font-medium text-foreground">{data.thermalComfort}%</span>
                  </div>
                  <Progress value={data.thermalComfort} className="bg-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2 md:col-span-1"
        >
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-foreground">Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-card text-card-foreground">
                    Ahorro
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Ajusta la temperatura 2°C para ahorrar energía
                  </span>
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-card text-card-foreground">
                    Confort
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Programa la iluminación para las tardes
                  </span>
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-card text-card-foreground">
                    Seguridad
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Activa el modo ausente al salir de casa
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}