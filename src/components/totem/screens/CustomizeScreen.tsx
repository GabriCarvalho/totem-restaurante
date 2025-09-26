// src/components/totem/screens/CustomizeScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, ChevronRight, Home, ShoppingBag } from "lucide-react";
import { DashboardData, ComplementItem, RemovableIngredient } from "../types";
import { useTotemState } from "../hooks/useTotemState";

interface CustomizeScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function CustomizeScreen({
  dashboardData,
  totemState,
}: CustomizeScreenProps) {
  if (!totemState.selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Erro</h1>
          <p className="text-lg text-gray-600">Produto não encontrado.</p>
          <Button
            onClick={() => totemState.setCurrentScreen("main")}
            className="mt-4"
          >
            Voltar ao Cardápio
          </Button>
        </div>
      </div>
    );
  }

  const handleComplementToggle = (complement: ComplementItem) => {
    totemState.setProductComplements((prev) => {
      const exists = prev.find((c) => c.id === complement.id);
      if (exists) return prev.filter((c) => c.id !== complement.id);
      return [...prev, complement];
    });
  };

  const handleIngredientToggle = (ingredient: RemovableIngredient) => {
    totemState.setRemovedIngredients((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      if (exists) return prev.filter((i) => i.id !== ingredient.id);
      return [...prev, ingredient];
    });
  };

  const addToCart = () => {
    const cartItem = {
      id: Date.now(),
      ...totemState.selectedProduct!,
      complements: totemState.productComplements,
      removedIngredients: totemState.removedIngredients,
      quantity: 1,
    };
    totemState.setCart((prev) => [...prev, cartItem]);
    totemState.setCurrentScreen("main");
    totemState.setSelectedProduct(null);
    totemState.setProductComplements([]);
    totemState.setRemovedIngredients([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header do produto com tipo de pedido */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant="secondary"
            className={
              totemState.orderType === "dine-in"
                ? "bg-green-100 text-green-800 text-lg"
                : "bg-blue-100 text-blue-800 text-lg"
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
          <Button
            variant="outline"
            onClick={() => totemState.setCurrentScreen("main")}
          >
            Voltar ao Cardápio
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-6xl mr-6">
                {totemState.selectedProduct.image}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {totemState.selectedProduct.name}
                </h2>
                <p className="text-gray-600 mb-2">
                  {totemState.selectedProduct.description}
                </p>
                <div className="text-2xl font-bold text-green-600">
                  R\$ {totemState.selectedProduct.price.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navegação entre etapas */}
        <div className="flex mb-6">
          <Button
            variant={
              totemState.customizationStep === "complements"
                ? "default"
                : "outline"
            }
            className="flex-1 mr-2"
            onClick={() => totemState.setCustomizationStep("complements")}
          >
            1. Adicionar Complementos
          </Button>
          <Button
            variant={
              totemState.customizationStep === "ingredients"
                ? "default"
                : "outline"
            }
            className="flex-1 ml-2"
            onClick={() => totemState.setCustomizationStep("ingredients")}
          >
            2. Remover Ingredientes
          </Button>
        </div>

        {/* Complementos opcionais */}
        {totemState.customizationStep === "complements" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Complementos Opcionais</CardTitle>
              <CardDescription className="text-lg">
                Selecione os complementos que deseja adicionar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.complementItems.map((complement) => {
                  const isSelected = totemState.productComplements.find(
                    (c) => c.id === complement.id
                  );

                  return (
                    <div
                      key={complement.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleComplementToggle(complement)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">
                            {complement.name}
                          </h4>
                          <p className="text-green-600 font-bold">
                            + R\$ {complement.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => totemState.setCurrentScreen("main")}
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => totemState.setCustomizationStep("ingredients")}
                >
                  Próximo: Ingredientes
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remoção de ingredientes */}
        {totemState.customizationStep === "ingredients" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Remover Ingredientes</CardTitle>
              <CardDescription className="text-lg">
                Selecione os ingredientes que NÃO deseja no seu produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.removableIngredients.map((ingredient) => {
                  const isSelected = totemState.removedIngredients.find(
                    (i) => i.id === ingredient.id
                  );

                  return (
                    <div
                      key={ingredient.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        isSelected
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleIngredientToggle(ingredient)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                            isSelected
                              ? "border-red-500 bg-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <X className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">
                            {ingredient.name}
                          </h4>
                          {isSelected && (
                            <p className="text-red-600 font-bold">
                              Será removido
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => totemState.setCustomizationStep("complements")}
                >
                  Voltar: Complementos
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={addToCart}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumo do produto */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Produto:</strong> {totemState.selectedProduct.name}
              </p>
              <p>
                <strong>Preço base:</strong> R\${" "}
                {totemState.selectedProduct.price.toFixed(2)}
              </p>

              {totemState.productComplements.length > 0 && (
                <div>
                  <p>
                    <strong>Complementos:</strong>
                  </p>
                  <ul className="ml-4">
                    {totemState.productComplements.map((comp) => (
                      <li key={comp.id}>
                        • {comp.name} (+R\$ {comp.price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {totemState.removedIngredients.length > 0 && (
                <div>
                  <p>
                    <strong>Ingredientes removidos:</strong>
                  </p>
                  <ul className="ml-4">
                    {totemState.removedIngredients.map((ing) => (
                      <li key={ing.id} className="text-red-600">
                        • Sem {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xl font-bold text-green-600 pt-2 border-t">
                Total: R\${" "}
                {(
                  totemState.selectedProduct.price +
                  totemState.productComplements.reduce(
                    (total, comp) => total + comp.price,
                    0
                  )
                ).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
