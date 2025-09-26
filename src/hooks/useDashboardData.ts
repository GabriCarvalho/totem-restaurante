// src/hooks/useDashboardData.ts
import { useState, useEffect } from "react";
import { Star, Utensils, Coffee, IceCream2, Tag } from "lucide-react";

interface DashboardData {
  restaurant: {
    name: string;
    address: string;
    logo: string;
  };
  categories: Array<{
    id: string;
    name: string;
    icon: any;
  }>;
  products: Array<any>;
  complementItems: Array<any>;
  removableIngredients: Array<any>;
}

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    restaurant: {
      name: "Carregando...",
      address: "Carregando...",
      logo: "🍔",
    },
    categories: [
      { id: "bestsellers", name: "Mais Vendidos", icon: Star },
      { id: "burgers", name: "Lanches", icon: Utensils },
      { id: "drinks", name: "Bebidas", icon: Coffee },
      { id: "desserts", name: "Sobremesas", icon: IceCream2 },
      { id: "promotions", name: "Promoções", icon: Tag },
    ],
    products: [],
    complementItems: [],
    removableIngredients: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Por enquanto, usar dados mock até conectar com o banco
      const mockData = {
        restaurant: {
          name: "fcrazybossburgers",
          address: "Vila Sanja",
          logo: "🍔",
        },
        complementItems: [
          { id: 1, name: "Bacon Extra", price: 4.5 },
          { id: 2, name: "Cheddar Cremoso", price: 3.0 },
          { id: 3, name: "Queijo Suíço", price: 3.5 },
          { id: 4, name: "Molho Especial", price: 1.0 },
          { id: 5, name: "Alface Extra", price: 1.5 },
          { id: 6, name: "Tomate Extra", price: 1.5 },
        ],
        removableIngredients: [
          { id: 1, name: "Cebola" },
          { id: 2, name: "Tomate" },
          { id: 3, name: "Alface" },
          { id: 4, name: "Molho" },
          { id: 5, name: "Picles" },
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

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData((prev) => ({
        ...prev,
        ...mockData,
      }));

      setLastUpdate(new Date());
      console.log("✅ Dados carregados às", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
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
