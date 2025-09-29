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
  X,
  Check,
  Eye,
} from "lucide-react";
import { DashboardData, Product } from "../types";
import { useTotemState } from "../hooks/useTotemState";
import { useState } from "react";

interface MainScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function MainScreen({ dashboardData, totemState }: MainScreenProps) {
  const getProductsByCategory = (categoryId: string): Product[] => {
    // ✅ CATEGORIA ESPECIAL "TODOS_OS_PRODUTOS" - SEMPRE RETORNA TODOS
    if (categoryId === "TODOS_OS_PRODUTOS") {
      return dashboardData.products || [];
    }

    // Encontrar a categoria selecionada
    const selectedCategory = dashboardData.categories.find(
      (cat) => cat.id === categoryId
    );

    // Se for a categoria "Mais Vendidos"
    if (selectedCategory?.name === "Mais Vendidos") {
      return dashboardData.products.filter(
        (product) => product.bestseller === true
      );
    }

    // Para outras categorias específicas
    return dashboardData.products.filter(
      (product) =>
        product.category_id === categoryId ||
        product.category === selectedCategory?.name
    );
  };

  const handleProductSelect = (product: Product) => {
    totemState.setSelectedProduct(product);
    totemState.setProductComplements([]);
    totemState.setRemovedIngredients([]);
    totemState.setCustomizationStep("complements");
    totemState.setCurrentScreen("customize");
  };

  // ✅ SE NENHUMA CATEGORIA SELECIONADA, USAR "TODOS_OS_PRODUTOS" POR PADRÃO
  const currentCategory = totemState.selectedCategory || "TODOS_OS_PRODUTOS";
  const products = getProductsByCategory(currentCategory);

  const cartTotal = totemState.calculateCartTotal();
  const itemCount = totemState.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const clearCart = () => {
    totemState.cart.forEach((item) => {
      totemState.removeFromCart(item.id);
    });
  };

  const proceedToCheckout = () => {
    totemState.setCurrentScreen("customer-data");
  };

  const viewCart = () => {
    totemState.setCurrentScreen("cart");
  };

  // ✅ FUNÇÃO PARA OBTER O TÍTULO DA SEÇÃO
  const getSectionTitle = () => {
    if (currentCategory === "TODOS_OS_PRODUTOS") {
      return "Todos os Produtos";
    }

    const selectedCategory = dashboardData.categories.find(
      (c) => c.id === currentCategory
    );

    return selectedCategory?.name || "Produtos";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex relative">
        {/* ✅ BARRA LATERAL COM LINHA SEPARADORA */}
        <div className="w-80 bg-white shadow-lg p-6 border-r-[20px] border-gray-300">
          <div className="text-center mb-8">
            {/* ✅ LOGO DE IMAGEM */}
            <div className="mb-2">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
                <img
                  src={dashboardData.restaurant.logo}
                  alt={dashboardData.restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display =
                        "flex";
                    }
                  }}
                />
              </div>
            </div>

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
                    <Home className="h-3 w-3 mr-1 text-black" /> Comer no Local
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3 w-3 mr-1 text-black" /> Levar
                    para Viagem
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

          {/* ✅ CATEGORIAS COM CATEGORIA FIXA "TODOS OS PRODUTOS" */}
          <div className="space-y-6">
            {/* ✅ CATEGORIA FIXA "TODOS OS PRODUTOS" NO TOPO */}
            <div>
              <Button
                variant={
                  currentCategory === "TODOS_OS_PRODUTOS" ? "default" : "ghost"
                }
                className="w-full justify-start text-left h-16 text-xl font-semibold"
                onClick={() =>
                  totemState.setSelectedCategory("TODOS_OS_PRODUTOS")
                }
              >
                Todos os Produtos
                <ChevronRight className="h-5 w-5 ml-auto text-black" />
              </Button>
              <div className="h-px bg-gray-200 mx-6 mt-6"></div>
            </div>

            {/* ✅ CATEGORIAS NORMAIS DO SISTEMA */}
            {dashboardData.categories.map((category, index) => (
              <div key={category.id}>
                <Button
                  variant={
                    currentCategory === category.id ? "default" : "ghost"
                  }
                  className="w-full justify-start text-left h-16 text-xl font-semibold"
                  onClick={() => totemState.setSelectedCategory(category.id)}
                >
                  {category.name}
                  <ChevronRight className="h-5 w-5 ml-auto text-black" />
                </Button>

                {/* ✅ LINHA SEPARADORA */}
                {index < dashboardData.categories.length - 1 && (
                  <div className="h-px bg-gray-200 mx-6 mt-6"></div>
                )}
              </div>
            ))}

            {/* Botão para alterar tipo de pedido */}
            <div className="pt-6 mt-6 border-t-2 border-gray-300">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-12 text-md"
                onClick={() => totemState.setCurrentScreen("order-type")}
              >
                <ChevronRight className="h-4 w-4 mr-2 rotate-180 text-black" />
                Alterar Tipo
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ CONTEÚDO PRINCIPAL */}
        <div
          className="flex-1 p-8"
          style={{
            paddingBottom: totemState.cart.length > 0 ? "200px" : "32px",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            {/* ✅ TÍTULO DINÂMICO */}
            <h1 className="text-4xl font-bold text-gray-800">
              {getSectionTitle()}
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
                    {/* ✅ CONTAINER PARA IMAGENS */}
                    <div className="mb-4 mx-auto">
                      {product.image && product.image.startsWith("http") ? (
                        <div className="w-40 h-40 mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-md border-2 border-gray-200">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              if (target.nextElementSibling) {
                                (
                                  target.nextElementSibling as HTMLElement
                                ).style.display = "flex";
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-40 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-6xl shadow-md border-2 border-gray-200">
                          {product.image || "🍔"}
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>

                    {product.bestseller && (
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="h-4 w-4 mr-1 text-black" />
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
                Esta seção ainda não possui produtos disponíveis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 🎨 BARRA HORIZONTAL DO CARRINHO */}
      {totemState.cart.length > 0 && (
        <div
          className="fixed bottom-0 bg-gradient-to-r from-white to-gray-50"
          style={{
            zIndex: 9999,
            position: "fixed",
            bottom: 0,
            left: "3px",
            right: "3px",
            margin: 0,
            padding: 0,
            borderRadius: "16px 16px 0 0",
            boxShadow:
              "0 -8px 32px rgba(0, 0, 0, 0.12), 0 -2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="flex items-center justify-between px-10 py-6 w-full">
            {/* Seção Esquerda: "Meu Pedido" e "Limpar" */}
            <div className="flex items-center gap-6">
              <Button
                onClick={viewCart}
                variant="ghost"
                className="flex items-center gap-4 p-0 h-auto text-black hover:bg-gray-100 rounded-lg pr-4"
              >
                <div className="relative p-3 bg-green-100 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-green-700" />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[24px] h-6 flex items-center justify-center text-xs rounded-full font-bold">
                    {itemCount}
                  </Badge>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-gray-800">
                    Meu Pedido
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 ml-2 text-gray-500" />
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="px-6 py-4 h-12 rounded-xl text-lg font-semibold border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <X className="h-5 w-5 mr-2" />
                Limpar
              </Button>
            </div>

            {/* Seção Direita: Preço Total e "Finalizar Pedido" */}
            <div className="flex items-center gap-6">
              <div className="text-right pr-4">
                <div className="text-md text-gray-600 font-semibold uppercase tracking-wide">
                  Total do Pedido
                </div>
                <div className="text-3xl font-bold text-green-700">
                  R$ {cartTotal.toFixed(2)}
                </div>
              </div>

              <Button
                onClick={proceedToCheckout}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-6 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-xl border-0"
              >
                <Check className="h-6 w-6 mr-3" />
                Finalizar Pedido
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
