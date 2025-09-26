"use client";

import { Button } from "@/components/ui/button";
import { Restaurant, SystemError } from "../types";

interface WelcomeScreenProps {
  restaurant: Restaurant;
  onStart: () => void;
  onAdminAccess: () => void;
  onTriggerError: (errorType: SystemError) => void;
}

export function WelcomeScreen({
  restaurant,
  onStart,
  onAdminAccess,
  onTriggerError,
}: WelcomeScreenProps) {
  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 cursor-pointer relative"
      onClick={onStart}
    >
      {/* Botões de teste para desenvolvimento */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerError("network");
            }}
          >
            Teste Erro Rede
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerError("maintenance");
            }}
          >
            Teste Manutenção
          </Button>
        </div>
      )}

      <div className="text-center max-w-xl select-none">
        <div className="text-8xl mb-6">{restaurant.logo}</div>
        <h1 className="text-5xl font-semibold text-gray-900 mb-2">
          {restaurant.name}
        </h1>
        <p className="text-lg text-gray-600 mb-12">{restaurant.address}</p>
        <h2 className="text-3xl font-medium text-gray-700">
          Toque para começar
        </h2>
      </div>

      {/* Botão secreto para admin */}
      <div
        className="absolute bottom-4 left-4 w-8 h-8 opacity-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onAdminAccess();
        }}
        title="Acesso Administrativo"
      />
    </div>
  );
}
