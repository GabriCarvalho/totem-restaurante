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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center justify-center p-6 cursor-pointer relative"
      onClick={onStart}
    >
      <div className="text-center max-w-xl select-none">
        <div className="mb-3">
          <div>
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("❌ ERRO ao carregar logo:", restaurant.logo);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display =
                    "flex";
                }
              }}
              onLoad={() => {
                console.log("✅ Logo carregado com sucesso:", restaurant.logo);
              }}
            />
          </div>
        </div>

        {/* Nome do restaurante com estilo */}
        <div className="mb-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent mb-2 drop-shadow-sm">
            {restaurant.name}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-xl text-gray-600 mb-16 font-medium">
          {restaurant.address}
        </p>

        {/* Call to action melhorado */}
        <div className="relative">
          <h2 className="text-4xl font-semibold text-gray-700 mb-4">
            Toque para começar
          </h2>

          {/* Indicador visual animado */}
          <div className="flex justify-center items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
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
