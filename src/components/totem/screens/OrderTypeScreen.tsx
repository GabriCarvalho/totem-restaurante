// src/components/totem/screens/OrderTypeScreen.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Home, ShoppingBag } from "lucide-react";

interface OrderTypeScreenProps {
  dashboardData: any;
  setOrderType: (type: "dine-in" | "takeaway") => void;
  setCurrentScreen: (screen: string) => void;
}

export default function OrderTypeScreen({
  dashboardData,
  setOrderType,
  setCurrentScreen,
}: OrderTypeScreenProps) {
  const handleOrderTypeSelect = (type: "dine-in" | "takeaway") => {
    setOrderType(type);
    setCurrentScreen("main");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl w-full">
        <div className="text-6xl mb-8">{dashboardData.restaurant.logo}</div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {dashboardData.restaurant.name}
        </h1>

        <p className="text-lg text-gray-600 mb-12">Como você prefere hoje?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Card
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => handleOrderTypeSelect("dine-in")}
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
            onClick={() => handleOrderTypeSelect("takeaway")}
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
