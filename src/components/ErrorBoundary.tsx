import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Button } from './ui/button';

export default function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-500 mb-6">{error?.message || 'Ha ocurrido un error inesperado'}</p>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}