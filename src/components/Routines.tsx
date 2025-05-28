import React, { useState, useEffect } from 'react';
import { Plus, Sun, Moon, Home, AudioWaveform, Briefcase, Clock, Calendar, Bell, Zap, Thermometer, Wifi } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { useRoutines } from '../contexts/RoutineContext';
import { useDevices } from '../contexts/DeviceContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultRoutines } from '../lib/storage';

const routineSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  schedule: z.string().min(1, 'Debe seleccionar un horario'),
  priority: z.enum(['alta', 'media', 'baja']),
  devices: z.array(z.string()).min(1, 'Debe seleccionar al menos un dispositivo'),
  conditions: z.array(z.string()).min(1, 'Debe especificar al menos una condición'),
  actions: z.array(z.string()).min(1, 'Debe especificar al menos una acción'),
});

type RoutineForm = z.infer<typeof routineSchema>;

export default function Routines() {
  const { routines, addRoutine, updateRoutine, removeRoutine, toggleRoutine, selectedProfile } = useRoutines();
  const { devices } = useDevices();
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<number | null>(null);

  useEffect(() => {
    // Ensure default routines are loaded
    if (routines.length === 0) {
      const profileDefaults = defaultRoutines[selectedProfile as keyof typeof defaultRoutines] || [];
      profileDefaults.forEach(routine => addRoutine(routine));
    }
  }, [selectedProfile]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<RoutineForm>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      devices: [],
      conditions: [],
      actions: [],
    },
  });

  const onSubmit = (data: RoutineForm) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine, {
        ...data,
        icon: Calendar,
        active: true,
      });
    } else {
      addRoutine({
        ...data,
        icon: Calendar,
        active: true,
      });
    }
    setShowAddRoutine(false);
    setEditingRoutine(null);
    reset();
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine.id);
    Object.entries(routine).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'icon' && key !== 'active') {
        setValue(key as keyof RoutineForm, value);
      }
    });
    setShowAddRoutine(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Rutinas Automatizadas - {selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1)}
        </h2>
        <Dialog open={showAddRoutine} onOpenChange={setShowAddRoutine}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Nueva Rutina
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRoutine ? 'Editar' : 'Crear'} Rutina</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="bg-background"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Horario</Label>
                  <Input
                    id="schedule"
                    type="time"
                    {...register('schedule')}
                    className="bg-background"
                  />
                  {errors.schedule && (
                    <p className="text-sm text-red-500">{errors.schedule.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  {...register('description')}
                  className="bg-background"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
                {errors.priority && (
                  <p className="text-sm text-red-500">{errors.priority.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Dispositivos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`device-${device.id}`}
                        value={device.name}
                        {...register('devices')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`device-${device.id}`}>{device.name}</Label>
                    </div>
                  ))}
                </div>
                {errors.devices && (
                  <p className="text-sm text-red-500">{errors.devices.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Condiciones</Label>
                <div className="space-y-2">
                  {['Hora', 'Movimiento', 'Temperatura', 'Luz'].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`condition-${condition}`}
                        value={condition}
                        {...register('conditions')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                    </div>
                  ))}
                </div>
                {errors.conditions && (
                  <p className="text-sm text-red-500">{errors.conditions.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Acciones</Label>
                <div className="space-y-2">
                  {['Encender luces', 'Ajustar temperatura', 'Activar seguridad', 'Enviar notificación'].map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`action-${action}`}
                        value={action}
                        {...register('actions')}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`action-${action}`}>{action}</Label>
                    </div>
                  ))}
                </div>
                {errors.actions && (
                  <p className="text-sm text-red-500">{errors.actions.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddRoutine(false);
                    setEditingRoutine(null);
                    reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingRoutine ? 'Guardar Cambios' : 'Crear Rutina'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine, index) => (
          <motion.div
            key={routine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center space-x-2">
                  {React.createElement(routine.icon, { className: "h-5 w-5 text-primary" })}
                  <div>
                    <CardTitle className="text-foreground">{routine.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{routine.description}</CardDescription>
                  </div>
                </div>
                <Switch checked={routine.active} onCheckedChange={() => toggleRoutine(routine.id)} />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{routine.schedule}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Dispositivos:</p>
                    <div className="text-sm text-muted-foreground">
                      {routine.devices.join(', ')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Condiciones:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {routine.conditions.map((condition, i) => (
                        <li key={i}>{condition}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Acciones:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {routine.actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(routine)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => removeRoutine(routine.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}