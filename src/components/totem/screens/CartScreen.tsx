"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Importações explícitas dos ícones
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  MapPin,
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

  const clearCart = () => {
    totemState.cart.forEach((item) => {
      totemState.removeFromCart(item.id);
    });
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
            <ShoppingCart className="h-6 w-6 mr-3" />
            Explorar Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header Centralizado */}
      <div className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <Button
              variant="ghost"
              onClick={() => totemState.setCurrentScreen("main")}
              className="flex items-center gap-3 text-lg hover:bg-gray-100 px-6 py-3 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Continuar Comprando</span>
            </Button>

            {/* Título Central */}
            <div className="text-center flex-1 ">
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <ShoppingCart className="h-10 w-10 text-green-600" />
                <span>Meu Carrinho</span>
              </h1>
            </div>

            {/* Botão Limpar */}
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex items-center gap-3 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 px-6 py-3 rounded-xl transition-all duration-200"
            >
              <Trash2 className="h-6 w-6" />
              <span>Limpar Tudo</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Lista de Itens */}
          <div className="xl:col-span-2 space-y-6">
            {totemState.cart.map((item, index) => (
              <Card
                key={item.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Imagem do Produto */}
                    <div className="w-40 h-40 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-6xl flex-shrink-0">
                      {item.image}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-base">
                            {item.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full ml-4"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      </div>

                      {/* Complementos */}
                      {item.complements && item.complements.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            ✨ Complementos:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.complements.map((comp: any) => (
                              <Badge
                                key={comp.id}
                                className="bg-green-100 text-green-800 px-3 py-1"
                              >
                                {comp.name} (+R\$ {comp.price.toFixed(2)})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ingredientes Removidos */}
                      {item.removedIngredients &&
                        item.removedIngredients.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              🚫 Sem:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.removedIngredients.map(
                                (ingredient: string) => (
                                  <Badge
                                    key={ingredient}
                                    variant="outline"
                                    className="border-red-300 text-red-600 px-3 py-1"
                                  >
                                    {ingredient}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Controles de Quantidade e Preço */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          {/* Controle de Quantidade com fallback */}
                          <div className="flex items-center bg-gray-50 rounded-xl p-2 border">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateCartItemQuantity(item.id, -1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-12 w-12 rounded-lg hover:bg-white disabled:opacity-50 text-xl font-bold"
                            >
                              <Minus className="h-6 w-6" />
                              {/* Fallback caso o ícone não carregue */}
                              <span className="sr-only">−</span>
                            </Button>
                            <span className="text-xl font-bold w-16 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCartItemQuantity(item.id, 1)}
                              className="h-12 w-12 rounded-lg hover:bg-white text-xl font-bold"
                            >
                              <Plus className="h-6 w-6" />
                              {/* Fallback caso o ícone não carregue */}
                              <span className="sr-only">+</span>
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">
                            R\$ {item.itemPrice.toFixed(2)} cada
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            R\$ {item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6 shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <span>Resumo do Pedido</span>
                </h3>
                <p className="text-green-100">
                  Confira os detalhes do seu pedido
                </p>
              </div>

              <CardContent className="p-8">
                {/* Tipo de Pedido */}
                <div className="mb-8">
                  <Badge
                    className={`w-full justify-center py-4 text-lg ${
                      totemState.orderType === "dine-in"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {totemState.orderType === "dine-in" ? (
                      <>
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>Comer no Local</span>
                      </>
                    ) : (
                      <>
                        <span>🥡 Levar para Viagem</span>
                      </>
                    )}
                  </Badge>
                </div>

                {/* Detalhes do Pedido */}
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between text-lg">
                    <span>
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"}
                      ):
                    </span>
                    <span className="font-semibold">
                      R\$ {cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      R\$ {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Botão de Finalizar */}
                <Button
                  onClick={proceedToCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl py-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  <span>Finalizar Pedido</span>
                </Button>

                {/* Informação Adicional */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  🔒 Pagamento seguro e protegido
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
