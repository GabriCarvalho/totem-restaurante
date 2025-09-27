"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, X } from "lucide-react";
import { DashboardData } from "../types";

// Importação condicional para evitar erros se o serviço não existir
let orderService: any;
try {
  orderService = require("@/lib/services/orderService").orderService;
} catch (error) {
  console.warn("OrderService não encontrado, usando dados mock");
  orderService = null;
}

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    dineInOrders: 0,
    takeawayOrders: 0,
  });

  useEffect(() => {
    if (isAuthenticated && orderService) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    if (!orderService) {
      // Usar dados mock se o serviço não estiver disponível
      setStats({
        todayOrders: 12,
        todayRevenue: 245.8,
        dineInOrders: 8,
        takeawayOrders: 4,
      });
      return;
    }

    try {
      const data = await orderService.getTodayStats();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      // Fallback para dados mock
      setStats({
        todayOrders: 0,
        todayRevenue: 0,
        dineInOrders: 0,
        takeawayOrders: 0,
      });
    }
  };

  const handleLogin = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "1234";
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Senha incorreta!");
      setPassword("");
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "Enter") {
      handleLogin();
    } else if (key === "Backspace") {
      setPassword(password.slice(0, -1));
    } else if (key === "Clear") {
      setPassword("");
    } else if (password.length < 10) {
      setPassword(password + key);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Acesso Administrativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-mono bg-gray-100 p-4 rounded-lg border-2 min-h-[60px] flex items-center justify-center">
                {password ? (
                  "•".repeat(password.length)
                ) : (
                  <span className="text-gray-400 italic">
                    Digite a senha...
                  </span>
                )}
              </div>
            </div>

            {/* Teclado numérico */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-12 text-lg"
                  onClick={() => handleKeyPress(num.toString())}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleKeyPress("Clear")}
              >
                Limpar
              </Button>
              <Button
                variant="outline"
                className="h-12 text-lg"
                onClick={() => handleKeyPress("0")}
              >
                0
              </Button>
              <Button
                variant="outline"
                className="h-12"
                onClick={() => handleKeyPress("Backspace")}
              >
                ⌫
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                Voltar
              </Button>
              <Button
                className="flex-1 bg-blue-600"
                onClick={handleLogin}
                disabled={password.length === 0}
              >
                Entrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Painel Administrativo
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Button variant="outline" onClick={onBack}>
              <X className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Informações do Restaurante */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {dashboardData.restaurant.logo}
                </div>
                <h3 className="font-bold text-lg">
                  {dashboardData.restaurant.name}
                </h3>
                <p className="text-gray-600">
                  {dashboardData.restaurant.address}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Categorias Ativas</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData.categories.length}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Produtos Ativos</h4>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.products.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">
                  Pedidos Hoje
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.todayOrders}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">
                  Faturamento Hoje
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  R$ {stats.todayRevenue.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">
                  Comer no Local
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.dineInOrders}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600">
                  Para Viagem
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.takeawayOrders}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produtos por Categoria */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Produtos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.categories.map((category) => {
                const categoryProducts = dashboardData.products.filter(
                  (product) => product.category === category.name
                );
                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{category.name}</h4>
                      <Badge variant="secondary">
                        {categoryProducts.length} produtos
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl mr-3">{product.image}</span>
                          <div className="flex-1">
                            <h5 className="font-medium">{product.name}</h5>
                            <p className="text-sm text-gray-600">
                              R$ {product.price.toFixed(2)}
                            </p>
                          </div>
                          {product.bestseller && (
                            <Badge className="bg-yellow-500 text-black">
                              Top
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ações Administrativas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={refreshData} disabled={dashboardData.isLoading}>
                {dashboardData.isLoading ? "Atualizando..." : "Atualizar Dados"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (orderService) {
                    loadStats();
                  }
                }}
              >
                Recarregar Estatísticas
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword("");
                }}
              >
                Fazer Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
