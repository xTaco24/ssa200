import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Leaf, Thermometer, Shield, Wifi, BatteryMedium } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function calculateEnergyTrend(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getDeviceIcon(type: string) {
  switch (type) {
    case 'light': return Leaf;
    case 'climate': return Thermometer;
    case 'security': return Shield;
    case 'entertainment': return Wifi;
    default: return BatteryMedium;
  }
}