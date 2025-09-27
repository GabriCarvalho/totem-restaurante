"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator-simple";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  X,
  Check,
  ChefHat,
  Utensils,
} from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🍔</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Nenhum produto selecionado
          </h2>
          <Button
            onClick={() => totemState.setCurrentScreen("main")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl"
          >
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header Melhorado */}
      <div className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => totemState.setCurrentScreen("main")}
              className="flex items-center gap-3 text-lg hover:bg-gray-100 px-6 py-3 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Voltar ao Menu</span>
            </Button>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-3">
                <ChefHat className="h-10 w-10 text-green-600" />
                Personalizar Produto
              </h1>
              <p className="text-gray-600">Monte seu lanche do seu jeito</p>
            </div>

            <Button
              variant="outline"
              onClick={() => totemState.setCurrentScreen("cart")}
              className="flex items-center gap-3 px-6 py-3 rounded-xl border-green-300 text-green-700 hover:bg-green-50 transition-all duration-200"
              disabled={totemState.cart.length === 0}
            >
              <ShoppingCart className="h-6 w-6" />
              <span>Carrinho ({totemState.cart.length})</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Produto Selecionado - Melhorado */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6 shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-8 text-white text-center">
                <div className="text-9xl mb-4">{product.image}</div>
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <p className="text-orange-100 text-lg">{product.description}</p>
              </div>

              <CardContent className="p-8">
                {/* Preço */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
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
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 text-lg">
                      <Star className="h-5 w-5 mr-2" />
                      Mais Vendido
                    </Badge>
                  )}
                </div>

                {/* Controle de Quantidade Melhorado */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-center mb-4">
                    Quantidade
                  </h3>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-14 w-14 rounded-xl border-2 hover:bg-gray-50"
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="bg-gray-50 px-8 py-4 rounded-xl border-2">
                      <span className="text-3xl font-bold">{quantity}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-14 w-14 rounded-xl border-2 hover:bg-gray-50"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Ingredientes Base - Em linha reta */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-green-600" />
                      Ingredientes Base
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl border">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {product.ingredients
                          .map((ingredient: any) => ingredient.ingredient_name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Personalização - Melhorada */}
          <div className="xl:col-span-2 space-y-8">
            {/* Remover Ingredientes */}
            {removableIngredients.length > 0 && (
              <Card className="shadow-lg border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-black">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <X className="h-6 w-6" />
                    Selecione o que deseja remover
                  </h3>
                  <p className="text-red-100 mt-1">
                    Clique nos ingredientes que você não quer no seu lanche
                  </p>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {removableIngredients.map((ingredient: any) => {
                      const isRemoved = totemState.removedIngredients.includes(
                        ingredient.ingredient_name
                      );
                      return (
                        <div
                          key={ingredient.id}
                          className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            isRemoved
                              ? "bg-red-50 border-red-300 shadow-lg"
                              : "bg-white border-gray-200 hover:border-red-300 hover:shadow-md"
                          }`}
                          onClick={() =>
                            toggleRemovedIngredient(ingredient.ingredient_name)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">
                              {ingredient.ingredient_name}
                            </span>
                            {isRemoved && (
                              <div className="bg-red-500 text-white rounded-full p-2">
                                <X className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          {isRemoved && (
                            <p className="text-red-600 text-sm mt-2 font-medium">
                              ✓ Será removido do seu lanche
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complementos */}
            {dashboardData.complementItems.length > 0 && (
              <Card className="shadow-lg border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-black">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Plus className="h-6 w-6" />
                    Adicionar Complementos
                  </h3>
                  <p className="text-green-100 mt-1">
                    Deixe seu lanche ainda mais saboroso
                  </p>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.complementItems.map((complement) => {
                      const isSelected = totemState.productComplements.some(
                        (comp) => comp.id === complement.id
                      );
                      return (
                        <div
                          key={complement.id}
                          className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "bg-green-50 border-green-300 shadow-lg"
                              : "bg-white border-gray-200 hover:border-green-300 hover:shadow-md"
                          }`}
                          onClick={() => toggleComplement(complement)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-lg">
                              {complement.name}
                            </span>
                            {isSelected && (
                              <div className="bg-green-500 text-white rounded-full p-2">
                                <Check className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            + R$ {complement.price.toFixed(2)}
                          </div>
                          {isSelected && (
                            <p className="text-green-600 text-sm mt-2 font-medium">
                              ✓ Adicionado ao seu lanche
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo e Adicionar ao Carrinho */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-black">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6" />
                  Resumo do Pedido
                </h3>
                <p className="text-blue-100 mt-1">
                  Confira os detalhes antes de adicionar
                </p>
              </div>

              <CardContent className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-lg">
                    <span>Produto base:</span>
                    <span className="font-semibold">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  {totemState.productComplements.map((comp) => (
                    <div
                      key={comp.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-green-600">+ {comp.name}:</span>
                      <span className="font-semibold text-green-600">
                        R$ {comp.price.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {totemState.removedIngredients.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-700 font-medium mb-2">
                        Ingredientes removidos:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {totemState.removedIngredients.map((ingredient) => (
                          <Badge
                            key={ingredient}
                            variant="outline"
                            className="border-red-300 text-red-600"
                          >
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg">
                    <span>Quantidade:</span>
                    <span className="font-semibold">{quantity}x</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      R$ {calculateTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
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
