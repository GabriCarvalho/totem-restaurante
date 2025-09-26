// src/components/totem/screens/CartScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Home, ShoppingBag } from "lucide-react";
import { DashboardData } from "../types";
import { useTotemState } from "../hooks/useTotemState";

interface CartScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function CartScreen({ dashboardData, totemState }: CartScreenProps) {
  const updateCartItemQuantity = (itemId: number, change: number) => {
    totemState.setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = Math.max(0, item.quantity + change);
              return newQuantity === 0
                ? null
                : { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as any[]
    );
  };

  const proceedToPayment = () => {
    totemState.setCurrentScreen("customer-data");
    totemState.setInputStep("receipt");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Seu Carrinho</h1>
            <Badge
              variant="secondary"
              className={
                totemState.orderType === "dine-in"
                  ? "bg-green-100 text-green-800 mt-2"
                  : "bg-blue-100 text-blue-800 mt-2"
              }
            >
              {totemState.orderType === "dine-in" ? (
                <>
                  <Home className="h-4 w-4 mr-1" /> Comer no Local
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-1" /> Levar para Viagem
                </>
              )}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => totemState.setCurrentScreen("order-type")}
            >
              Alterar Tipo
            </Button>
            <Button
              variant="outline"
              onClick={() => totemState.setCurrentScreen("main")}
            >
              Continuar Comprando
            </Button>
          </div>
        </div>

        {totemState.cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Carrinho vazio
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione alguns produtos para continuar.
            </p>
            <Button onClick={() => totemState.setCurrentScreen("main")}>
              Voltar às Compras
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {totemState.cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-4xl mr-4">{item.image}</div>
                        <div>
                          <h3 className="text-xl font-bold">{item.name}</h3>

                          {item.complements && item.complements.length > 0 && (
                            <div className="text-sm text-green-600 mt-1">
                              <strong>Complementos:</strong>{" "}
                              {item.complements
                                .map((comp) => comp.name)
                                .join(", ")}
                            </div>
                          )}

                          {item.removedIngredients &&
                            item.removedIngredients.length > 0 && (
                              <div className="text-sm text-red-600 mt-1">
                                <strong>Sem:</strong>{" "}
                                {item.removedIngredients
                                  .map((ing) => ing.name)
                                  .join(", ")}
                              </div>
                            )}

                          <div className="text-lg font-bold text-green-600 mt-2">
                            R${" "}
                            {(
                              (item.price +
                                (item.complements?.reduce(
                                  (total, comp) => total + comp.price,
                                  0
                                ) || 0)) *
                              item.quantity
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-4 text-xl font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Total do Pedido:</span>
                  <span className="text-3xl font-bold text-green-600">
                    R$ {totemState.calculateCartTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => totemState.setCurrentScreen("main")}
                  >
                    Continuar Comprando
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={proceedToPayment}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
