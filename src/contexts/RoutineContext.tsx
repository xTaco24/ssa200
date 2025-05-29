import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routine } from '../types/routine';
import { getStoredRoutines, storeRoutines, defaultRoutines } from '../lib/storage';
import toast from 'react-hot-toast';

interface RoutineContextType {
  routines: Routine[];
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (id: number, updates: Partial<Routine>) => void;
  removeRoutine: (id: number) => void;
  toggleRoutine: (id: number) => void;
  resetRoutines: () => void;
  selectedProfile: string;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children, selectedProfile }: { children: React.ReactNode; selectedProfile: string }) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [originalRoutines, setOriginalRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    try {
      const storedRoutines = getStoredRoutines(selectedProfile);
      if (storedRoutines.length === 0) {
        const profileDefaults = defaultRoutines[selectedProfile as keyof typeof defaultRoutines] || [];
        setRoutines(profileDefaults);
        setOriginalRoutines(JSON.parse(JSON.stringify(profileDefaults)));
        storeRoutines(selectedProfile, profileDefaults);
      } else {
        setRoutines(storedRoutines);
        setOriginalRoutines(JSON.parse(JSON.stringify(storedRoutines)));
      }
    } catch (error) {
      console.error('Error loading routines:', error);
      toast.error('Error al cargar las rutinas');
    }
  }, [selectedProfile]);

  useEffect(() => {
    try {
      storeRoutines(selectedProfile, routines);
    } catch (error) {
      console.error('Error saving routines:', error);
      toast.error('Error al guardar las rutinas');
    }
  }, [routines, selectedProfile]);

  const addRoutine = (routine: Omit<Routine, 'id'>) => {
    try {
      const newRoutine = {
        ...routine,
        id: Date.now(),
      };
      setRoutines(prev => [...prev, newRoutine]);
      toast.success('Rutina creada correctamente');
    } catch (error) {
      console.error('Error adding routine:', error);
      toast.error('Error al crear la rutina');
    }
  };

  const updateRoutine = (id: number, updates: Partial<Routine>) => {
    try {
      setRoutines(prev =>
        prev.map(routine =>
          routine.id === id ? { ...routine, ...updates } : routine
        )
      );
      toast.success('Rutina actualizada correctamente');
    } catch (error) {
      console.error('Error updating routine:', error);
      toast.error('Error al actualizar la rutina');
    }
  };

  const removeRoutine = (id: number) => {
    try {
      setRoutines(prev => prev.filter(routine => routine.id !== id));
      toast.success('Rutina eliminada correctamente');
    } catch (error) {
      console.error('Error removing routine:', error);
      toast.error('Error al eliminar la rutina');
    }
  };

  const toggleRoutine = (id: number) => {
    try {
      setRoutines(prev =>
        prev.map(routine =>
          routine.id === id
            ? { ...routine, active: !routine.active }
            : routine
        )
      );
    } catch (error) {
      console.error('Error toggling routine:', error);
      toast.error('Error al cambiar el estado de la rutina');
    }
  };

  const resetRoutines = () => {
    try {
      setRoutines(JSON.parse(JSON.stringify(originalRoutines)));
      toast.success('Rutinas restauradas a valores predeterminados');
    } catch (error) {
      console.error('Error resetting routines:', error);
      toast.error('Error al restaurar las rutinas');
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        addRoutine,
        updateRoutine,
        removeRoutine,
        toggleRoutine,
        resetRoutines,
        selectedProfile,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
}