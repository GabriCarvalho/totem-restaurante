"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, X } from "lucide-react";
import { DashboardData } from "../types";

interface AdminScreenProps {
  onBack: () => void;
  dashboardData: DashboardData;
  refreshData: () => void;
  lastUpdate: Date;
}

export function AdminScreen({
  onBack,
  dashboardData,
  refreshData,
  lastUpdate,
}: AdminScreenProps) {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const correctPassword = "1234";

  const handlePasswordKeyPress = (digit: string) => {
    if (adminPassword.length < 10) {
      setAdminPassword((prev) => prev + digit);
    }
  };

  const handlePasswordBackspace = () => {
    setAdminPassword((prev) => prev.slice(0, -1));
  };

  const handlePasswordClear = () => {
    setAdminPassword("");
  };

  const handlePasswordConfirm = () => {
    if (adminPassword === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta!");
      setAdminPassword("");
    }
  };

  const mockStats = {
    todayOrders: 47,
    todayRevenue: 1250.8,
    popularProduct: "X-Burger Clássico",
    averageTicket: 26.6,
    dineInOrders: 28,
    takeawayOrders: 19,
    paymentMethods: {
      card: 32,
      pix: 12,
      cash: 3,
    },
  };

  // Tela de autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Área Administrativa
            </h1>
            <Button variant="outline" onClick={onBack}>
              <X className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <User className="h-6 w-6 mr-2" />
                Acesso Restrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Digite a senha de administrador:
                </p>

                <div className="text-2xl font-mono bg-gray-100 p-4 rounded-lg border-2 mb-4">
                  {"*".repeat(adminPassword.length)}
                  {"_".repeat(4 - adminPassword.length)}
                </div>
              </div>

              {/* Teclado Numérico */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""].map((num, index) =>
                    num !== "" ? (
                      <Button
                        key={`admin-${index}`}
                        variant="outline"
                        className="h-16 text-xl font-mono"
                        onClick={() => handlePasswordKeyPress(num.toString())}
                      >
                        {num}
                      </Button>
                    ) : (
                      <div key={`empty-${index}`} className="h-16" />
                    )
                  )}
                </div>

                <div className="flex gap-2 max-w-xs mx-auto mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-16"
                    onClick={handlePasswordBackspace}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Apagar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-16"
                    onClick={handlePasswordClear}
                  >
                    Limpar
                  </Button>
                </div>

                <Button
                  className="w-full h-16 bg-green-600 text-xl mt-2 max-w-xs mx-auto block"
                  onClick={handlePasswordConfirm}
                  disabled={adminPassword.length === 0}
                >
                  Entrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela administrativa autenticada
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData}>
              🔄 Atualizar Dados
            </Button>
            <Button variant="outline" onClick={onBack}>
              <X className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Menu de opções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            variant={showStats ? "default" : "outline"}
            className="h-20 text-lg"
            onClick={() => setShowStats(!showStats)}
          >
            📊 Estatísticas do Dia
          </Button>

          <Button
            variant="outline"
            className="h-20 text-lg"
            onClick={() => alert("Funcionalidade em desenvolvimento")}
          >
            🛠️ Configurações
          </Button>

          <Button
            variant="outline"
            className="h-20 text-lg"
            onClick={() => alert("Funcionalidade em desenvolvimento")}
          >
            📋 Relatórios
          </Button>
        </div>

        {/* Estatísticas */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-2xl font-bold text-green-600">
                  {mockStats.todayOrders}
                </div>
                <div className="text-sm text-gray-600">Pedidos Hoje</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-green-600">
                  R\$ {mockStats.todayRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Faturamento</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-lg font-bold text-gray-800">
                  {mockStats.popularProduct}
                </div>
                <div className="text-sm text-gray-600">Mais Vendido</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-600">
                  R\$ {mockStats.averageTicket.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Ticket Médio</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Informações do Sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Conexão com Dashboard:</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    ✅ Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Produtos Carregados:</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {dashboardData.products.length} itens
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Complementos:</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {dashboardData.complementItems.length} itens
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Última Sincronização:</span>
                  <span className="text-sm text-gray-600">
                    {lastUpdate.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Restaurante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Nome:</strong> {dashboardData.restaurant.name}
                </div>
                <div>
                  <strong>Endereço:</strong> {dashboardData.restaurant.address}
                </div>
                <div>
                  <strong>Categorias Ativas:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dashboardData.categories.map((cat: any) => (
                      <Badge key={cat.id} variant="secondary">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
