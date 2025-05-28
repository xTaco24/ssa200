import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { useDevices } from '../contexts/DeviceContext';
import { Device } from '../types/device';
import { getDeviceIcon } from '../lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
  showControls?: boolean;
}

export function DeviceCard({ device, showControls = true }: DeviceCardProps) {
  const { updateDevice, removeDevice, toggleDeviceStatus } = useDevices();
  const DeviceIcon = getDeviceIcon(device.type);

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <div className="flex items-center space-x-2">
            <DeviceIcon className="h-4 w-4 text-primary" />
            <span>{device.name}</span>
          </div>
        </CardTitle>
        <Badge
          variant={device.status === 'online' ? 'default' : 'outline'}
          className={device.status === 'online' ? 'bg-green-500' : 'text-red-500'}
        >
          {device.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <p>{device.brand} · {device.location}</p>
        </div>
        {showControls && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Encendido</span>
              <Switch
                checked={device.status === 'online'}
                onCheckedChange={() => toggleDeviceStatus(device.id)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateDevice(device.id, { name: device.name })}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeDevice(device.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}