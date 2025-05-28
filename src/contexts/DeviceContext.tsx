import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device } from '../types/device';
import { getStoredDevices, storeDevices, defaultDevices } from '../lib/storage';
import toast from 'react-hot-toast';

interface DeviceContextType {
  devices: Device[];
  addDevice: (device: Omit<Device, 'id' | 'status'>) => void;
  updateDevice: (id: number, updates: Partial<Device>) => void;
  removeDevice: (id: number) => void;
  toggleDeviceStatus: (id: number) => void;
  selectedProfile: string;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children, selectedProfile }: { children: React.ReactNode; selectedProfile: string }) {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const storedDevices = getStoredDevices(selectedProfile);
    if (storedDevices.length === 0) {
      // Load default devices if none exist
      const profileDefaults = defaultDevices[selectedProfile as keyof typeof defaultDevices] || [];
      setDevices(profileDefaults);
      storeDevices(selectedProfile, profileDefaults);
    } else {
      setDevices(storedDevices);
    }
  }, [selectedProfile]);

  useEffect(() => {
    storeDevices(selectedProfile, devices);
  }, [devices, selectedProfile]);

  const addDevice = (device: Omit<Device, 'id' | 'status'>) => {
    const newDevice = {
      ...device,
      id: Date.now(),
      status: 'online',
    };
    setDevices(prev => [...prev, newDevice]);
    toast.success('Dispositivo añadido correctamente');
  };

  const updateDevice = (id: number, updates: Partial<Device>) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === id ? { ...device, ...updates } : device
      )
    );
    toast.success('Dispositivo actualizado correctamente');
  };

  const removeDevice = (id: number) => {
    setDevices(prev => prev.filter(device => device.id !== id));
    toast.success('Dispositivo eliminado correctamente');
  };

  const toggleDeviceStatus = (id: number) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === id
          ? { ...device, status: device.status === 'online' ? 'offline' : 'online' }
          : device
      )
    );
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        addDevice,
        updateDevice,
        removeDevice,
        toggleDeviceStatus,
        selectedProfile,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}