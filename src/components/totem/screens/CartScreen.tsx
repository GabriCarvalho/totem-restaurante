"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Edit3,
} from "lucide-react";
import { DashboardData } from "../types";
import { useTotemState } from "../hooks/useTotemState";

interface CartScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function CartScreen({ dashboardData, totemState }: CartScreenProps) {
  const updateCartItemQuantity = (itemId: string, change: number) => {
    const item = totemState.cart.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      totemState.removeFromCart(itemId);
    } else {
      totemState.updateCartItem(itemId, {
        quantity: newQuantity,
        totalPrice: item.itemPrice * newQuantity,
      });
    }
  };

  const removeCartItem = (itemId: string) => {
    totemState.removeFromCart(itemId);
  };

  const editCartItem = (item: any) => {
    // Buscar o produto original no dashboardData
    const originalProduct = dashboardData?.products?.find(
      (p) => p.name === item.name
    );

    if (originalProduct) {
      // Definir o produto selecionado
      totemState.setSelectedProduct(originalProduct);
      // Ir para a tela de customização
      totemState.setCurrentScreen("customize");
      // Remover o item atual do carrinho
      totemState.removeFromCart(item.id);
    } else {
      console.log("Produto não encontrado para edição:", item.name);
    }
  };

  const proceedToCheckout = () => {
    totemState.setCurrentScreen("customer-data");
  };

  const cartTotal = totemState.calculateCartTotal();
  const itemCount = totemState.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (totemState.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Que tal adicionar alguns produtos deliciosos ao seu pedido?
          </p>
          <Button
            onClick={() => totemState.setCurrentScreen("main")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ShoppingCart className="h-6 w-6 mr-3 text-white" />
            Explorar Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col">
      {/* ✅ Header Simplificado */}
      <div className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <ShoppingCart className="h-10 w-10 text-black" />
            <span>
              Meu Carrinho ({itemCount} {itemCount === 1 ? "item" : "itens"})
            </span>
          </h1>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="flex-1 max-w-4xl mx-auto p-8 w-full">
        <div className="space-y-4">
          {totemState.cart.map((item) => (
            <Card
              key={item.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* ✅ Informações do Item */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>

                    {/* Complementos */}
                    {item.complements && item.complements.length > 0 && (
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1">
                          {item.complements.map((comp: any) => (
                            <Badge
                              key={comp.id}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1"
                            >
                              +{comp.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredientes Removidos */}
                    {item.removedIngredients &&
                      item.removedIngredients.length > 0 && (
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {item.removedIngredients.map(
                              (ingredient: string) => (
                                <Badge
                                  key={ingredient}
                                  variant="outline"
                                  className="border-red-300 text-red-600 text-xs px-2 py-1"
                                >
                                  Sem {ingredient}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    <div className="text-lg text-gray-600">
                      R\$ {item.itemPrice.toFixed(2)} cada
                    </div>
                  </div>

                  {/* ✅ Controles de Quantidade - ÍCONES PRETOS */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateCartItemQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="h-12 w-12 rounded-l-xl hover:bg-gray-50 disabled:opacity-50 border-0"
                      >
                        <Minus className="h-5 w-5 text-black" />
                      </Button>
                      <span className="text-xl font-bold w-16 text-center border-l border-r border-gray-200 h-12 flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateCartItemQuantity(item.id, 1)}
                        className="h-12 w-12 rounded-r-xl hover:bg-gray-50 border-0"
                      >
                        <Plus className="h-5 w-5 text-black" />
                      </Button>
                    </div>

                    {/* ✅ Preço Total */}
                    <div className="text-right min-w-[120px]">
                      <div className="text-2xl font-bold text-green-600">
                        R\$ {item.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    {/* ✅ Botão Editar - ÍCONE PRETO */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editCartItem(item)}
                      className="hover:bg-gray-100 rounded-full h-10 w-10"
                      title="Editar"
                    >
                      <Edit3 className="h-5 w-5 text-black" />
                    </Button>

                    {/* ✅ Botão Remover - ÍCONE PRETO */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCartItem(item.id)}
                      className="hover:bg-gray-100 rounded-full h-10 w-10"
                      title="Remover"
                    >
                      <Trash2 className="h-5 w-5 text-black" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ✅ Resumo e Botões Fixos no Final da Tela */}
      <div className="bg-white border-t-4 border-green-500 shadow-lg">
        <div className="max-w-4xl mx-auto p-8">
          {/* Resumo do Pedido */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-gray-800">
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"}):
              </span>
              <span className="text-2xl font-bold text-gray-800">
                R\$ {cartTotal.toFixed(2)}
              </span>
            </div>

            <hr className="border-gray-200 mb-4" />

            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-gray-800">Total:</span>
              <span className="text-3xl font-bold text-green-600">
                R\$ {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ✅ Botões no Final - ÍCONES PRETOS */}
          <div className="grid grid-cols-2 gap-6">
            {/* Botão Continuar Comprando */}
            <Button
              variant="outline"
              onClick={() => totemState.setCurrentScreen("main")}
              className="w-full text-xl py-8 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ArrowLeft className="h-6 w-6 text-black" />
              <span>Continuar Comprando</span>
            </Button>

            {/* Botão Finalizar Pedido */}
            <Button
              onClick={proceedToCheckout}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <CreditCard className="h-6 w-6 text-white" />
              <span>Finalizar Pedido</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
