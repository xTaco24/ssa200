export interface Device {
  id: number;
  name: string;
  type: 'light' | 'climate' | 'security' | 'entertainment';
  status: 'online' | 'offline';
  brand: string;
  location: string;
  data?: {
    power?: number;
    temperature?: number;
    brightness?: number;
    battery?: number;
  };
}