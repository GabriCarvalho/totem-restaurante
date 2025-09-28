"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, ShoppingBag } from "lucide-react";
import { Restaurant, OrderType } from "../types";

interface OrderTypeScreenProps {
  restaurant: Restaurant;
  onSelectOrderType: (type: OrderType) => void;
}

export function OrderTypeScreen({
  restaurant,
  onSelectOrderType,
}: OrderTypeScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl w-full">
        {/* ✅ LOGO DE IMAGEM - MESMO ESTILO DA WELCOME SCREEN */}
        <div className="mb-90">
          <div>
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("❌ ERRO ao carregar logo:", restaurant.logo);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display =
                    "flex";
                }
              }}
              onLoad={() => {
                console.log("✅ Logo carregado com sucesso:", restaurant.logo);
              }}
            />
          </div>
        </div>
        <h1 className="text-lg text-gray-600 mb-12">Como você prefere hoje?</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Card
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => onSelectOrderType("dine-in")}
          >
            <CardContent className="p-8 text-center">
              <Home className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Comer no Local
              </h3>
              <p className="text-gray-600">
                Prefere aproveitar no nosso ambiente
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => onSelectOrderType("takeaway")}
          >
            <CardContent className="p-8 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Levar para Viagem
              </h3>
              <p className="text-gray-600">
                Para levar e aproveitar onde preferir
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
