import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routine } from '../types/routine';
import { getStoredRoutines, storeRoutines } from '../lib/storage';
import toast from 'react-hot-toast';

interface RoutineContextType {
  routines: Routine[];
  addRoutine: (routine: Omit<Routine, 'id'>) => void;
  updateRoutine: (id: number, updates: Partial<Routine>) => void;
  removeRoutine: (id: number) => void;
  toggleRoutine: (id: number) => void;
  selectedProfile: string;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children, selectedProfile }: { children: React.ReactNode; selectedProfile: string }) {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const storedRoutines = getStoredRoutines(selectedProfile);
    setRoutines(storedRoutines);
  }, [selectedProfile]);

  useEffect(() => {
    storeRoutines(selectedProfile, routines);
  }, [routines, selectedProfile]);

  const addRoutine = (routine: Omit<Routine, 'id'>) => {
    const newRoutine = {
      ...routine,
      id: Date.now(),
    };
    setRoutines(prev => [...prev, newRoutine]);
    toast.success('Rutina creada correctamente');
  };

  const updateRoutine = (id: number, updates: Partial<Routine>) => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === id ? { ...routine, ...updates } : routine
      )
    );
    toast.success('Rutina actualizada correctamente');
  };

  const removeRoutine = (id: number) => {
    setRoutines(prev => prev.filter(routine => routine.id !== id));
    toast.success('Rutina eliminada correctamente');
  };

  const toggleRoutine = (id: number) => {
    setRoutines(prev =>
      prev.map(routine =>
        routine.id === id
          ? { ...routine, active: !routine.active }
          : routine
      )
    );
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        addRoutine,
        updateRoutine,
        removeRoutine,
        toggleRoutine,
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