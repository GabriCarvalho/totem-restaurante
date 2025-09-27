"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// ✅ Usar o separator simples
import { Separator } from "@/components/ui/separator-simple";
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, X } from "lucide-react";
import { DashboardData } from "../types";
import { useTotemState } from "../hooks/useTotemState";
import { useState } from "react";

interface CustomizeScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function CustomizeScreen({
  dashboardData,
  totemState,
}: CustomizeScreenProps) {
  const [quantity, setQuantity] = useState(1);

  if (!totemState.selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Nenhum produto selecionado
          </h2>
          <Button onClick={() => totemState.setCurrentScreen("main")}>
            Voltar ao Menu
          </Button>
        </div>
      </div>
    );
  }

  const product = totemState.selectedProduct;

  const calculateItemPrice = () => {
    const basePrice = product.price;
    const complementsPrice = totemState.productComplements.reduce(
      (total, comp) => total + comp.price,
      0
    );
    return basePrice + complementsPrice;
  };

  const calculateTotalPrice = () => {
    return calculateItemPrice() * quantity;
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      quantity: quantity,
      complements: totemState.productComplements,
      removedIngredients: totemState.removedIngredients,
      totalPrice: calculateTotalPrice(),
      itemPrice: calculateItemPrice(),
    };

    totemState.addToCart(cartItem);

    totemState.setCurrentScreen("main");
    totemState.setSelectedProduct(null);
    totemState.setProductComplements([]);
    totemState.setRemovedIngredients([]);
  };

  const toggleComplement = (complement: any) => {
    const isSelected = totemState.productComplements.some(
      (comp) => comp.id === complement.id
    );

    if (isSelected) {
      totemState.setProductComplements(
        totemState.productComplements.filter(
          (comp) => comp.id !== complement.id
        )
      );
    } else {
      totemState.setProductComplements([
        ...totemState.productComplements,
        complement,
      ]);
    }
  };

  const toggleRemovedIngredient = (ingredientName: string) => {
    const isRemoved = totemState.removedIngredients.includes(ingredientName);

    if (isRemoved) {
      totemState.setRemovedIngredients(
        totemState.removedIngredients.filter((ing) => ing !== ingredientName)
      );
    } else {
      totemState.setRemovedIngredients([
        ...totemState.removedIngredients,
        ingredientName,
      ]);
    }
  };

  const removableIngredients =
    product.ingredients?.filter((ing: any) => ing.is_removable) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => totemState.setCurrentScreen("main")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Menu
          </Button>

          <h1 className="text-2xl font-bold text-gray-800">
            Personalizar Produto
          </h1>

          <Button
            variant="outline"
            onClick={() => totemState.setCurrentScreen("cart")}
            className="flex items-center gap-2"
            disabled={totemState.cart.length === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({totemState.cart.length})
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Produto Selecionado */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-4">{product.image}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-green-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  {product.bestseller && (
                    <Badge className="bg-yellow-500 text-black">
                      <Star className="h-4 w-4 mr-1" />
                      Mais Vendido
                    </Badge>
                  )}
                </div>

                {/* Controle de Quantidade */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Ingredientes */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Ingredientes:
                    </h3>
                    <div className="space-y-2">
                      {product.ingredients.map((ingredient: any) => (
                        <div
                          key={ingredient.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-gray-700">
                            {ingredient.ingredient_name}
                          </span>
                          {!ingredient.is_removable && (
                            <Badge variant="secondary">Obrigatório</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Personalização */}
          <div className="space-y-6">
            {/* Remover Ingredientes */}
            {removableIngredients.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    Remover Ingredientes
                  </h3>
                  <div className="space-y-3">
                    {removableIngredients.map((ingredient: any) => {
                      const isRemoved = totemState.removedIngredients.includes(
                        ingredient.ingredient_name
                      );
                      return (
                        <div
                          key={ingredient.id}
                          className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                            isRemoved
                              ? "bg-red-50 border-red-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() =>
                            toggleRemovedIngredient(ingredient.ingredient_name)
                          }
                        >
                          <span className="font-medium">
                            {ingredient.ingredient_name}
                          </span>
                          {isRemoved && <X className="h-5 w-5 text-red-500" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complementos */}
            {dashboardData.complementItems.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    Adicionar Complementos
                  </h3>
                  <div className="space-y-3">
                    {dashboardData.complementItems.map((complement) => {
                      const isSelected = totemState.productComplements.some(
                        (comp) => comp.id === complement.id
                      );
                      return (
                        <div
                          key={complement.id}
                          className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-green-50 border-green-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => toggleComplement(complement)}
                        >
                          <div>
                            <span className="font-medium">
                              {complement.name}
                            </span>
                            <div className="text-green-600 font-bold">
                              + R$ {complement.price.toFixed(2)}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-green-600">
                              <Plus className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo e Adicionar ao Carrinho */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Produto base:</span>
                    <span>R$ {product.price.toFixed(2)}</span>
                  </div>

                  {totemState.productComplements.map((comp) => (
                    <div key={comp.id} className="flex justify-between text-sm">
                      <span>+ {comp.name}:</span>
                      <span>R$ {comp.price.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span>Quantidade:</span>
                    <span>{quantity}x</span>
                  </div>

                  {/* ✅ Separator simples */}
                  <Separator className="my-3" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      R$ {calculateTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
