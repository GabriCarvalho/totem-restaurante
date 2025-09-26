import { useState, useEffect } from "react";
import { DashboardData } from "../../../types";
import { CATEGORIES } from "../utils/constants";

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    restaurant: {
      name: "fcrazybossburgers",
      address: "Carregando...",
      logo: "🍔",
    },
    categories: CATEGORIES,
    complementItems: [],
    removableIngredients: [],
    products: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const mockApiResponse = {
        restaurant: {
          name: "fcrazybossburgers",
          address: "Vila Sanja",
          logo: "🍔",
        },
        complementItems: [
          { id: 101, name: "Bacon Extra", price: 4.5 },
          { id: 102, name: "Cheddar Cremoso", price: 3.0 },
          { id: 103, name: "Queijo Suíço", price: 3.5 },
          { id: 104, name: "Molho Especial", price: 1.0 },
          { id: 105, name: "Alface Extra", price: 1.5 },
          { id: 106, name: "Tomate Extra", price: 1.5 },
        ],
        removableIngredients: [
          { id: 201, name: "Cebola" },
          { id: 202, name: "Tomate" },
          { id: 203, name: "Alface" },
          { id: 204, name: "Molho" },
          { id: 205, name: "Picles" },
        ],
        products: [
          {
            id: 1,
            name: "X-Burger Clássico",
            description:
              "Hambúrguer artesanal, alface, tomate, cebola e molho especial",
            price: 18.9,
            category: "burgers",
            image: "🍔",
            bestseller: true,
            ingredients: [
              "Hambúrguer",
              "Alface",
              "Tomate",
              "Cebola",
              "Molho especial",
            ],
          },
          {
            id: 2,
            name: "X-Bacon Supremo",
            description:
              "Hambúrguer artesanal, bacon crocante, queijo cheddar, alface e tomate",
            price: 22.9,
            category: "burgers",
            image: "🥓",
            bestseller: true,
            ingredients: [
              "Hambúrguer",
              "Bacon",
              "Queijo cheddar",
              "Alface",
              "Tomate",
            ],
          },
          {
            id: 3,
            name: "Coca-Cola Lata",
            description: "Refrigerante Coca-Cola 350ml gelado",
            price: 5.0,
            category: "drinks",
            image: "🥤",
            ingredients: [],
          },
          {
            id: 4,
            name: "Sorvete Artesanal",
            description: "Sorvete cremoso sabor chocolate ou baunilha",
            price: 8.5,
            category: "desserts",
            image: "🍦",
            ingredients: [],
          },
          {
            id: 5,
            name: "Combo X-Burger",
            description: "X-Burger + Batata + Refrigerante",
            price: 24.9,
            category: "promotions",
            image: "🍟",
            originalPrice: 30.4,
            ingredients: ["X-Burger", "Batata frita", "Refrigerante"],
          },
        ],
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDashboardData((prev) => ({ ...prev, ...mockApiResponse }));
      setLastUpdate(new Date());
      console.log("🔄 Dados sincronizados às", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ Erro ao sincronizar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    ...dashboardData,
    isLoading,
    lastUpdate,
    refreshData,
  };
}
