// src/components/totem/screens/LoadingScreen.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export default function LoadingScreen({
  message = "Carregando sistema...",
  progress = 0,
  showProgress = false,
}: LoadingScreenProps) {
  const [dots, setDots] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    "Conectando com o servidor...",
    "Carregando dados do restaurante...",
    "Sincronizando cardápio...",
    "Verificando complementos...",
    "Preparando sistema...",
    "Quase pronto...",
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    if (showProgress) {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2000);

      return () => clearInterval(stepInterval);
    }
  }, [showProgress]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        {/* Logo animado */}
        <div className="text-8xl mb-8 animate-bounce">🍔</div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          fcrazybossburgers
        </h1>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Spinner de carregamento */}
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
              </div>

              {/* Mensagem principal */}
              <p className="text-xl text-gray-700">
                {showProgress ? loadingSteps[currentStep] : message}
                <span className="text-green-600">{dots}</span>
              </p>

              {/* Barra de progresso */}
              {showProgress && (
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              )}

              {showProgress && (
                <p className="text-sm text-gray-500">
                  {Math.min(progress, 100).toFixed(0)}% concluído
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dicas enquanto carrega */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-3">💡 Dica:</h3>
            <p className="text-gray-600 text-sm">
              Nosso sistema está sempre sincronizado com o cardápio mais
              atualizado para garantir que você tenha acesso aos melhores
              produtos!
            </p>
          </CardContent>
        </Card>

        {/* Informações do sistema */}
        <div className="mt-8 text-xs text-gray-400">
          <p>Sistema Totem v1.0</p>
          <p>Conectando...</p>
        </div>
      </div>
    </div>
  );
}
