import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Routine {
  id: number;
  name: string;
  description: string;
  active: boolean;
  icon: LucideIcon;
  schedule: string;
  priority: 'alta' | 'media' | 'baja';
  devices: string[];
  conditions: string[];
  actions: string[];
}