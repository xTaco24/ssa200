import React, { useState } from 'react';
import { Users, Settings, Shield, Activity, Database, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  group: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface AuditLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const mockUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', group: 'Administrators', status: 'active', lastLogin: '2024-03-10 15:30' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', group: 'Users', status: 'active', lastLogin: '2024-03-10 14:20' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', group: 'Managers', status: 'active', lastLogin: '2024-03-10 12:45' },
];

const mockAuditLogs: AuditLog[] = [
  { id: 1, user: 'Admin User', action: 'User Creation', resource: 'Users', timestamp: '2024-03-10 15:30', status: 'success' },
  { id: 2, user: 'System', action: 'Backup Created', resource: 'Database', timestamp: '2024-03-10 15:00', status: 'success' },
  { id: 3, user: 'John Doe', action: 'Login Failed', resource: 'Authentication', timestamp: '2024-03-10 14:45', status: 'error' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(mockUsers);
  const [auditLogs] = useState(mockAuditLogs);
  const [showAddUser, setShowAddUser] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Usuario añadido correctamente');
    setShowAddUser(false);
  };

  const handleUserStatusChange = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast.success(`Usuario ${newStatus === 'active' ? 'activado' : 'desactivado'}`);
        return { ...user, status: newStatus as 'active' | 'inactive' };
      }
      return user;
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
        <Button
          onClick={() => toast.success('Copia de seguridad iniciada')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Database className="mr-2 h-4 w-4" /> Backup Manual
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usuarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {users.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grupos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">3</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Eventos Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{auditLogs.length}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveTab('users')}
        >
          <Users className="mr-2 h-4 w-4" /> Usuarios
        </Button>
        <Button
          variant={activeTab === 'security' ? 'default' : 'outline'}
          onClick={() => setActiveTab('security')}
        >
          <Shield className="mr-2 h-4 w-4" /> Seguridad
        </Button>
        <Button
          variant={activeTab === 'audit' ? 'default' : 'outline'}
          onClick={() => setActiveTab('audit')}
        >
          <History className="mr-2 h-4 w-4" /> Auditoría
        </Button>
        <Button
          variant={activeTab === 'performance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('performance')}
        >
          <Activity className="mr-2 h-4 w-4" /> Rendimiento
        </Button>
      </div>

      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Gestión de Usuarios</h2>
            <Button onClick={() => setShowAddUser(true)}>
              Añadir Usuario
            </Button>
          </div>

          {showAddUser && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Nuevo Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Nombre completo" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@ejemplo.com" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <select
                        id="role"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="user">Usuario</option>
                        <option value="manager">Gestor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group">Grupo</Label>
                      <select
                        id="group"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="users">Usuarios</option>
                        <option value="managers">Gestores</option>
                        <option value="admins">Administradores</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddUser(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Guardar Usuario
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="bg-card rounded-lg border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Usuario</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rol</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Grupo</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Último Acceso</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="p-4">{user.group}</td>
                      <td className="p-4 text-sm text-muted-foreground">{user.lastLogin}</td>
                      <td className="p-4">
                        <Switch
                          checked={user.status === 'active'}
                          onCheckedChange={() => handleUserStatusChange(user.id)}
                        />
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'audit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Registro de Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant="outline"
                        className={
                          log.status === 'success' ? 'text-green-500' :
                          log.status === 'warning' ? 'text-yellow-500' :
                          'text-red-500'
                        }
                      >
                        {log.status}
                      </Badge>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.user} · {log.resource}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Autenticación de dos factores</h3>
                  <p className="text-sm text-muted-foreground">
                    Requiere verificación adicional al iniciar sesión
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Bloqueo automático</h3>
                  <p className="text-sm text-muted-foreground">
                    Bloquea la sesión después de 15 minutos de inactividad
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Registro de IP</h3>
                  <p className="text-sm text-muted-foreground">
                    Mantiene un registro de las IPs que acceden al sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'performance' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Uso de CPU</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div className="h-full w-[45%] bg-primary rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Memoria RAM</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div className="h-full w-[60%] bg-primary rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Almacenamiento</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div className="h-full w-[75%] bg-primary rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}