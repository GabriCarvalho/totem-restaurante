// src/components/totem/screens/MainScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  ChevronRight,
  Star,
} from "lucide-react";
import { DashboardData, Product } from "../types";
import { useTotemState } from "../hooks/useTotemState";

interface MainScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function MainScreen({ dashboardData, totemState }: MainScreenProps) {
  const getProductsByCategory = (category: string): Product[] => {
    if (category === "bestsellers") {
      return dashboardData.products.filter((product) => product.bestseller);
    }
    return dashboardData.products.filter(
      (product) => product.category === category
    );
  };

  const handleProductSelect = (product: Product) => {
    totemState.setSelectedProduct(product);
    totemState.setProductComplements([]);
    totemState.setRemovedIngredients([]);
    totemState.setCustomizationStep("complements");
    totemState.setCurrentScreen("customize");
  };

  const products = getProductsByCategory(totemState.selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Barra lateral fixa */}
      <div className="w-80 bg-white shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">{dashboardData.restaurant.logo}</div>
          <h2 className="text-2xl font-bold text-gray-800">
            {dashboardData.restaurant.name}
          </h2>

          {/* Indicador do tipo de pedido */}
          <div className="mt-2 mb-4">
            <Badge
              variant="secondary"
              className={
                totemState.orderType === "dine-in"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }
            >
              {totemState.orderType === "dine-in" ? (
                <>
                  <Home className="h-3 w-3 mr-1" /> Comer no Local
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3 w-3 mr-1" /> Levar para Viagem
                </>
              )}
            </Badge>
          </div>

          {dashboardData.isLoading && (
            <div className="text-sm text-yellow-600 mt-1">
              🔄 Carregando dados...
            </div>
          )}
        </div>

        <div className="space-y-2">
          {dashboardData.categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={
                  totemState.selectedCategory === category.id
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start text-left h-16 text-lg"
                onClick={() => totemState.setSelectedCategory(category.id)}
              >
                <IconComponent className="h-6 w-6 mr-3" />
                {category.name}
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>
            );
          })}

          <Button
            variant={totemState.cart.length > 0 ? "default" : "ghost"}
            className="w-full justify-start text-left h-16 text-lg bg-green-600 hover:bg-green-700 text-white"
            onClick={() => totemState.setCurrentScreen("cart")}
            disabled={totemState.cart.length === 0}
          >
            <ShoppingCart className="h-6 w-6 mr-3" />
            Carrinho
            {totemState.cart.length > 0 && (
              <Badge className="ml-auto bg-red-500">
                {totemState.cart.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </Badge>
            )}
          </Button>

          {/* Botão para alterar tipo de pedido */}
          <Button
            variant="outline"
            className="w-full justify-start text-left h-12 text-md mt-4"
            onClick={() => totemState.setCurrentScreen("order-type")}
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Alterar Tipo
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            {
              dashboardData.categories.find(
                (c) => c.id === totemState.selectedCategory
              )?.name
            }
          </h1>

          {/* Indicador do tipo de pedido no header */}
          <Badge
            variant="secondary"
            className={
              totemState.orderType === "dine-in"
                ? "bg-green-100 text-green-800 text-lg"
                : "bg-blue-100 text-blue-800 text-lg"
            }
          >
            {totemState.orderType === "dine-in"
              ? "🍽️ Comer no Local"
              : "🥡 Levar para Viagem"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleProductSelect(product)}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{product.image}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        R\$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-green-600">
                      R\$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  {product.bestseller && (
                    <Badge className="bg-yellow-500 text-black">
                      <Star className="h-4 w-4 mr-1" />
                      Mais Vendido
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Esta categoria ainda não possui produtos disponíveis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
