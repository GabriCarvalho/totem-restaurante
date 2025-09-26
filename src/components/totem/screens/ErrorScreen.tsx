"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { SystemError } from "../types";

interface ErrorScreenProps {
  errorType: SystemError;
  onRetry: () => void;
  onAdmin: () => void;
}

export function ErrorScreen({ errorType, onRetry, onAdmin }: ErrorScreenProps) {
  const [countdown, setCountdown] = useState(30);
  const [autoRetry, setAutoRetry] = useState(true);

  useEffect(() => {
    if (autoRetry && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (autoRetry && countdown === 0) {
      onRetry();
    }
  }, [countdown, autoRetry, onRetry]);

  const getErrorContent = () => {
    switch (errorType) {
      case "network":
        return {
          emoji: "🌐",
          title: "Problema de Conexão",
          description:
            "Não foi possível conectar com o servidor. Verificando conexão...",
          details: "O sistema está tentando reconectar automaticamente.",
        };
      case "maintenance":
        return {
          emoji: "🔧",
          title: "Sistema em Manutenção",
          description:
            "O sistema está temporariamente indisponível para manutenção.",
          details: "Por favor, tente novamente em alguns minutos.",
        };
      default:
        return {
          emoji: "⚠️",
          title: "Erro Inesperado",
          description: "Ocorreu um erro inesperado no sistema.",
          details: "Nossa equipe foi notificada e está trabalhando na solução.",
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="text-8xl mb-8">{errorContent.emoji}</div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {errorContent.title}
        </h1>

        <p className="text-xl text-gray-600 mb-8">{errorContent.description}</p>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <p className="text-gray-700">{errorContent.details}</p>

              {autoRetry && errorType === "network" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-semibold mb-2">
                    Tentativa automática em {countdown} segundos
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
                  onClick={onRetry}
                >
                  🔄 Tentar Novamente
                </Button>

                {errorType === "network" && (
                  <Button
                    variant="outline"
                    className="text-lg px-8 py-4"
                    onClick={() => setAutoRetry(!autoRetry)}
                  >
                    {autoRetry ? "⏸️ Pausar" : "▶️ Retomar"} Auto-Retry
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="font-semibold mb-2">📞 Suporte Técnico</h4>
                <p className="text-gray-600">
                  Ligue: (11) 9999-9999
                  <br />
                  WhatsApp: (11) 9999-9999
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  ⏰ Horário de Funcionamento
                </h4>
                <p className="text-gray-600">
                  Segunda a Sexta: 8h às 18h
                  <br />
                  Sábados: 8h às 14h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acesso Administrativo */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={onAdmin}
          >
            <User className="h-4 w-4 mr-2" />
            Acesso Administrativo
          </Button>
        </div>

        {/* Informações do Sistema */}
        <div className="mt-8 text-xs text-gray-400">
          <p>
            Sistema Totem v1.0 | ID:{" "}
            {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p>Última verificação: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
