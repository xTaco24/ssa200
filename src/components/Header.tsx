import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Home, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Dropdown, DropdownItem } from './ui/dropdown';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { storeProfile } from '../lib/storage';

interface HeaderProps {
  selectedProfile: string;
  setSelectedProfile: (profile: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  greeting: string;
}

const notifications = [
  {
    id: 1,
    title: "Temperatura alta",
    message: "La temperatura ha superado los 26°C",
    time: "Hace 5 minutos",
    type: "warning"
  },
  {
    id: 2,
    title: "Modo ausente activado",
    message: "Se activó el modo ausente automáticamente",
    time: "Hace 30 minutos",
    type: "info"
  },
  {
    id: 3,
    title: "Consumo elevado",
    message: "El consumo de energía es mayor al habitual",
    time: "Hace 1 hora",
    type: "alert"
  }
];

export default function Header({ selectedProfile, setSelectedProfile, theme, toggleTheme, greeting }: HeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleProfileChange = (profile: string) => {
    setSelectedProfile(profile);
    storeProfile(profile);
    toast.success(`Perfil cambiado a ${profile}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    toast(notification.message, {
      icon: notification.type === 'warning' ? '⚠️' : notification.type === 'info' ? 'ℹ️' : '🔔',
      duration: 3000,
    });
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Home className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-foreground">SmartSpace</span>
              <span className="text-sm text-muted-foreground">{greeting}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedProfile}
              onChange={(e) => handleProfileChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="casa">Casa</option>
              <option value="oficina">Oficina</option>
            </select>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Dropdown
              trigger={
                <Button variant="ghost\" size="icon\" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                </Button>
              }
              align="right"
            >
              <div className="px-4 py-2 text-sm font-medium text-foreground border-b border-border">
                Notificaciones
              </div>
              {notifications.map((notification) => (
                <DropdownItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <p className="text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </DropdownItem>
              ))}
            </Dropdown>
            
            <Dropdown
              trigger={
                <Button variant="ghost\" size="icon\" className="text-foreground">
                  <User className="h-5 w-5" />
                </Button>
              }
              align="right"
            >
              <div className="px-4 py-2 text-sm font-medium text-foreground border-b border-border">
                Mi Cuenta
              </div>
              <DropdownItem onClick={handleSignOut}>
                <div className="flex items-center space-x-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </div>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}