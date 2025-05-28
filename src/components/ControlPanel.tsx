import React, { useState } from 'react';
import { Leaf, Thermometer, Zap, Plus, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { formatNumber } from '../lib/utils';
import toast from 'react-hot-toast';
import { Badge } from './ui/badge';
import { useDevices } from '../contexts/DeviceContext';
import { DeviceCard } from './DeviceCard';

const profileData = {
  casa: {
    temperature: 22,
    lightsOn: true,
    lightIntensity: 80,
    energyConsumption: 2.4,
    previousConsumption: 2.8,
    alerts: [
      { id: 1, type: "warning", message: "Consumo elevado en sala", time: "Hace 5m" },
      { id: 2, type: "info", message: "Actualización disponible", time: "Hace 15m" },
      { id: 3, type: "error", message: "Cámara desconectada", time: "Hace 1h" }
    ]
  },
  oficina: {
    temperature: 24,
    lightsOn: true,
    lightIntensity: 100,
    energyConsumption: 3.2,
    previousConsumption: 3.0,
    alerts: [
      { id: 1, type: "info", message: "Mantenimiento programado", time: "Hace 1h" }
    ]
  }
};

export default function ControlPanel({ selectedProfile }: { selectedProfile: string }) {
  const [temperature, setTemperature] = useState(22);
  const [lightsOn, setLightsOn] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(80);
  const [energyConsumption, setEnergyConsumption] = useState(2.4);
  const [previousConsumption, setPreviousConsumption] = useState(2.8);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState(profileData.casa.alerts);
  const { devices, addDevice } = useDevices();
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'light' as const,
    brand: '',
    location: ''
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    addDevice(newDevice);
    setIsDialogOpen(false);
    setNewDevice({
      name: '',
      type: 'light',
      brand: '',
      location: ''
    });
  };

  const energyTrend = ((energyConsumption - previousConsumption) / previousConsumption) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Panel de Control</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Añadir Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Dispositivo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDevice} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del dispositivo</Label>
                <Input
                  id="name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Ej: Lámpara sala"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de dispositivo</Label>
                <select
                  id="type"
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value as any })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="light">Iluminación</option>
                  <option value="climate">Climatización</option>
                  <option value="security">Seguridad</option>
                  <option value="entertainment">Entretenimiento</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={newDevice.brand}
                  onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
                  placeholder="Ej: Philips Hue"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  placeholder="Ej: Sala de estar"
                  className="bg-background"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Añadir Dispositivo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Iluminación</h3>
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Luces</span>
              <Switch checked={lightsOn} onCheckedChange={setLightsOn} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Intensidad</span>
                <span className="text-sm font-medium">{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Temperatura</h3>
            <Thermometer className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold">{temperature}°C</div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setTemperature((prev) => Math.max(prev - 1, 16))}
                variant="outline"
                size="sm"
              >
                -
              </Button>
              <Button
                onClick={() => setTemperature((prev) => Math.min(prev + 1, 30))}
                variant="outline"
                size="sm"
              >
                +
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Aire acondicionado encendido</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Consumo</h3>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">{formatNumber(energyConsumption)} kWh</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">vs ayer</span>
              <div className={`flex items-center ${energyTrend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                {energyTrend < 0 ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(energyTrend).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Dispositivos Conectados</h3>
          </div>
          <div className="grid gap-4">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Alertas Recientes</h3>
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={
                      alert.type === 'warning' ? 'text-yellow-500' :
                      alert.type === 'error' ? 'text-red-500' :
                      'text-blue-500'
                    }
                  >
                    {alert.type}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}