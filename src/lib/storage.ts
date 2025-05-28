import { Device } from '../types/device';
import { Routine } from '../types/routine';
import { Calendar, Sun, Moon, Home, Power, Clock } from 'lucide-react';

const STORAGE_KEYS = {
  DEVICES: 'smartspace_devices',
  ROUTINES: 'smartspace_routines',
  SELECTED_PROFILE: 'smartspace_profile'
} as const;

export const defaultDevices = {
  casa: [
    { 
      id: 1, 
      name: "Termostato sala", 
      type: "climate", 
      status: "online", 
      brand: "Nest", 
      location: "Sala",
      data: {
        temperature: 22
      }
    },
    { 
      id: 2, 
      name: "Lámpara cocina", 
      type: "light", 
      status: "offline", 
      brand: "Philips Hue", 
      location: "Cocina",
      data: {
        brightness: 0
      }
    },
    { 
      id: 3, 
      name: "Sensor movimiento entrada", 
      type: "security", 
      status: "online", 
      brand: "Ring", 
      location: "Entrada",
      data: {
        battery: 100
      }
    }
  ],
  oficina: [
    { 
      id: 1, 
      name: "Control de Acceso", 
      type: "security", 
      status: "online", 
      brand: "HID", 
      location: "Entrada",
      data: {
        battery: 100
      }
    },
    { 
      id: 2, 
      name: "AC Central", 
      type: "climate", 
      status: "online", 
      brand: "Daikin", 
      location: "General",
      data: {
        temperature: 23
      }
    },
    { 
      id: 3, 
      name: "Iluminación General", 
      type: "light", 
      status: "online", 
      brand: "Philips", 
      location: "General",
      data: {
        brightness: 80
      }
    }
  ]
};

export const defaultRoutines = {
  casa: [
    {
      id: 1,
      name: "Modo Noche",
      description: "Configuración nocturna automática",
      active: true,
      icon: Moon,
      schedule: "23:00",
      priority: "alta",
      devices: ["Lámpara cocina", "Termostato sala"],
      conditions: ["Hora: 23:00"],
      actions: [
        "Apagar todas las luces",
        "Ajustar temperatura a 20°C"
      ]
    },
    {
      id: 2,
      name: "Despertar",
      description: "Rutina matutina automática",
      active: true,
      icon: Sun,
      schedule: "07:00",
      priority: "alta",
      devices: ["Lámpara cocina", "Termostato sala"],
      conditions: ["Hora: 7:00 AM"],
      actions: [
        "Encender luces al 70%",
        "Ajustar temperatura a 22°C"
      ]
    },
    {
      id: 3,
      name: "Seguridad",
      description: "Activación de seguridad en ausencia",
      active: true,
      icon: Home,
      schedule: "manual",
      priority: "alta",
      devices: ["Sensor movimiento entrada"],
      conditions: ["Modo ausente activado"],
      actions: [
        "Activar sensores de movimiento",
        "Activar notificaciones"
      ]
    }
  ],
  oficina: [
    {
      id: 1,
      name: "Inicio laboral",
      description: "Configuración de inicio de jornada",
      active: true,
      icon: Power,
      schedule: "08:00",
      priority: "alta",
      devices: ["AC Central", "Iluminación General"],
      conditions: ["Hora: 8:00 AM", "Día laborable"],
      actions: [
        "Encender iluminación al 100%",
        "Ajustar temperatura a 23°C"
      ]
    },
    {
      id: 2,
      name: "Cierre oficina",
      description: "Configuración de cierre",
      active: true,
      icon: Clock,
      schedule: "19:00",
      priority: "alta",
      devices: ["AC Central", "Iluminación General", "Control de Acceso"],
      conditions: ["Hora: 7:00 PM", "Día laborable"],
      actions: [
        "Apagar sistemas",
        "Activar seguridad"
      ]
    },
    {
      id: 3,
      name: "Modo reunión",
      description: "Configuración para reuniones",
      active: true,
      icon: Calendar,
      schedule: "manual",
      priority: "media",
      devices: ["AC Central", "Iluminación General"],
      conditions: ["Sala reservada"],
      actions: [
        "Ajustar iluminación al 80%",
        "Optimizar temperatura"
      ]
    }
  ]
};

export function getStoredDevices(profile: string): Device[] {
  const stored = localStorage.getItem(STORAGE_KEYS.DEVICES);
  if (!stored) {
    const devices = defaultDevices[profile as keyof typeof defaultDevices] || [];
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify({ [profile]: devices }));
    return devices;
  }
  const allDevices = JSON.parse(stored);
  return allDevices[profile] || defaultDevices[profile as keyof typeof defaultDevices] || [];
}

export function storeDevices(profile: string, devices: Device[]): void {
  const stored = localStorage.getItem(STORAGE_KEYS.DEVICES);
  const allDevices = stored ? JSON.parse(stored) : {};
  allDevices[profile] = devices;
  localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(allDevices));
}

export function getStoredRoutines(profile: string): Routine[] {
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  if (!stored) {
    const routines = defaultRoutines[profile as keyof typeof defaultRoutines] || [];
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify({ [profile]: routines }));
    return routines;
  }
  const allRoutines = JSON.parse(stored);
  return allRoutines[profile] || defaultRoutines[profile as keyof typeof defaultRoutines] || [];
}

export function storeRoutines(profile: string, routines: Routine[]): void {
  const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  const allRoutines = stored ? JSON.parse(stored) : {};
  allRoutines[profile] = routines;
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(allRoutines));
}

export function getStoredProfile(): string {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_PROFILE) || 'casa';
}

export function storeProfile(profile: string): void {
  localStorage.setItem(STORAGE_KEYS.SELECTED_PROFILE, profile);
}