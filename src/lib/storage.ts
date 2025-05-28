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
      name: "Sistema de Iluminación", 
      type: "light", 
      status: "online", 
      brand: "Philips Hue", 
      location: "General",
      data: {
        brightness: 80,
        power: 15
      }
    },
    { 
      id: 2, 
      name: "Termostato", 
      type: "climate", 
      status: "online", 
      brand: "Nest", 
      location: "General",
      data: {
        temperature: 22
      }
    },
    { 
      id: 3, 
      name: "Sistema de Seguridad", 
      type: "security", 
      status: "online", 
      brand: "Ring", 
      location: "General",
      data: {
        battery: 95
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
      name: "Proyector Sala Principal", 
      type: "entertainment", 
      status: "online", 
      brand: "Epson", 
      location: "Sala de Reuniones",
      data: {
        power: 200
      }
    }
  ]
};

export const defaultRoutines = {
  casa: [
    {
      id: 1,
      name: "Buenos días",
      description: "Rutina matutina para comenzar el día",
      active: true,
      icon: Sun,
      schedule: "07:00",
      priority: "alta",
      devices: ["Sistema de Iluminación", "Termostato", "Sistema de Seguridad"],
      conditions: ["Hora: 7:00 AM", "Día laborable"],
      actions: [
        "Encender luces gradualmente",
        "Ajustar temperatura a 22°C",
        "Desactivar sistema de alarma"
      ]
    },
    {
      id: 2,
      name: "Modo nocturno",
      description: "Preparar la casa para la noche",
      active: true,
      icon: Moon,
      schedule: "23:00",
      priority: "alta",
      devices: ["Sistema de Iluminación", "Termostato", "Sistema de Seguridad"],
      conditions: ["Hora: 11:00 PM"],
      actions: [
        "Atenuar luces al 30%",
        "Activar sistema de seguridad",
        "Ajustar temperatura a 20°C"
      ]
    },
    {
      id: 3,
      name: "Modo ausente",
      description: "Activar modo de ahorro y seguridad",
      active: true,
      icon: Home,
      schedule: "manual",
      priority: "alta",
      devices: ["Sistema de Iluminación", "Termostato", "Sistema de Seguridad"],
      conditions: ["Activación manual", "Sensor de movimiento: sin actividad"],
      actions: [
        "Apagar todas las luces",
        "Activar cámaras y sensores",
        "Activar modo ahorro de energía"
      ]
    }
  ],
  oficina: [
    {
      id: 1,
      name: "Inicio laboral",
      description: "Preparar la oficina para el día laboral",
      active: true,
      icon: Power,
      schedule: "08:00",
      priority: "alta",
      devices: ["Control de Acceso", "AC Central", "Proyector Sala Principal"],
      conditions: ["Hora: 8:00 AM", "Día laborable"],
      actions: [
        "Desbloquear puertas principales",
        "Encender luces oficinas",
        "Ajustar temperatura a 23°C"
      ]
    },
    {
      id: 2,
      name: "Sala de reuniones",
      description: "Configurar sala para reuniones",
      active: true,
      icon: Calendar,
      schedule: "manual",
      priority: "media",
      devices: ["AC Central", "Proyector Sala Principal"],
      conditions: ["Reserva de sala confirmada"],
      actions: [
        "Encender proyector",
        "Ajustar iluminación al 70%",
        "Ajustar temperatura sala"
      ]
    },
    {
      id: 3,
      name: "Cierre",
      description: "Cerrar la oficina de forma segura",
      active: true,
      icon: Clock,
      schedule: "18:00",
      priority: "alta",
      devices: ["Control de Acceso", "AC Central", "Proyector Sala Principal"],
      conditions: ["Hora: 6:00 PM", "Día laborable"],
      actions: [
        "Apagar todos los sistemas",
        "Activar sistema de alarmas",
        "Bloquear accesos"
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