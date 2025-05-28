import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, BarChart2, Wifi, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const connectedDevices = {
  casa: [
    { id: 1, name: "Lámpara sala", type: "light", status: "online" },
    { id: 2, name: "Termostato", type: "climate", status: "online" },
    { id: 3, name: "Cámara entrada", type: "security", status: "offline" },
    { id: 4, name: "Smart TV", type: "entertainment", status: "online" },
  ],
  oficina: [
    { id: 1, name: "Luces oficina", type: "light", status: "online" },
    { id: 2, name: "AC Central", type: "climate", status: "online" },
    { id: 3, name: "Sensor movimiento", type: "security", status: "online" },
  ],
};

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navigate = useNavigate();

  const tabs = [
    { id: "panel", name: "Panel de Control", icon: Home, path: "/dashboard" },
    { id: "rutinas", name: "Rutinas", icon: Calendar, path: "/dashboard/routines" },
    { id: "analisis", name: "Análisis", icon: BarChart2, path: "/dashboard/analysis" },
    { id: "admin", name: "Administración", icon: Settings, path: "/dashboard/admin" },
  ];

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
  };

  return (
    <aside className="bg-card w-64 min-h-screen border-r border-border flex flex-col">
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-colors",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 p-4 border-t border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Wifi className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-foreground">Dispositivos Conectados</h3>
        </div>
        <div className="space-y-2">
          {connectedDevices.casa.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="text-sm text-muted-foreground">{device.name}</span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  device.status === "online" ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}