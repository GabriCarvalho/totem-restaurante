import { useState, useEffect } from "react";
import { DashboardData } from "../types";
import * as LucideIcons from "lucide-react";

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    restaurant: {
      id: "",
      name: "Carregando...",
      address: "Carregando...",
      logo: "🍔",
    },
    categories: [],
    complementItems: [],
    removableIngredients: [],
    products: [],
    isLoading: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      console.log("🔄 Tentando carregar dados...");

      // Tentar importar e usar serviços do Supabase
      let restaurant = null;
      let categories = [];
      let products = [];
      let complements = [];

      try {
        // Importações dinâmicas com try/catch individual
        const restaurantModule = await import(
          "@/lib/services/restaurantService"
        ).catch(() => null);
        const categoryModule = await import(
          "@/lib/services/categoryService"
        ).catch(() => null);
        const productModule = await import(
          "@/lib/services/productService"
        ).catch(() => null);
        const complementModule = await import(
          "@/lib/services/complementService"
        ).catch(() => null);

        if (restaurantModule?.restaurantService) {
          restaurant = await restaurantModule.restaurantService.getRestaurant();
          console.log("✅ Restaurante carregado:", restaurant?.name);
        }

        if (categoryModule?.categoryService) {
          categories = await categoryModule.categoryService.getCategories();
          console.log("✅ Categorias carregadas:", categories.length);
        }

        if (productModule?.productService) {
          products = await productModule.productService.getProducts();
          console.log("✅ Produtos carregados:", products.length);
        }

        if (complementModule?.complementService) {
          complements =
            await complementModule.complementService.getComplements();
          console.log("✅ Complementos carregados:", complements.length);
        }
      } catch (serviceError) {
        console.warn(
          "⚠️ Erro ao carregar serviços, usando dados estáticos:",
          serviceError
        );
      }

      // Se conseguiu carregar dados do Supabase, usar eles
      if (restaurant || categories.length > 0 || products.length > 0) {
        // Mapear ícones para as categorias vindas do Supabase
        const categoriesWithIcons = categories.map((category: any) => ({
          ...category,
          icon: (LucideIcons as any)[category.icon_name] || LucideIcons.Package,
        }));

        // Extrair ingredientes removíveis de todos os produtos
        const removableIngredients = products
          .flatMap((product: any) => product.ingredients || [])
          .filter((ingredient: any) => ingredient.is_removable)
          .map((ingredient: any) => ({
            id: ingredient.id,
            name: ingredient.ingredient_name,
          }))
          // Remover duplicatas
          .filter(
            (ingredient: any, index: number, self: any[]) =>
              index === self.findIndex((i) => i.name === ingredient.name)
          );

        setDashboardData({
          restaurant: restaurant || {
            id: "supabase",
            name: "fcrazybossburgers",
            address: "Vila Sanja",
            logo: "🍔",
          },
          categories: categoriesWithIcons,
          products: products || [],
          complementItems: complements || [],
          removableIngredients,
          isLoading: false,
        });

        console.log("✅ Dados do Supabase carregados com sucesso!");
      } else {
        // Usar dados estáticos como fallback
        console.log("🔄 Usando dados estáticos (Supabase não disponível)");

        setDashboardData({
          restaurant: {
            id: "static",
            name: "fcrazybossburgers",
            address: "Vila Sanja",
            logo: "🍔",
          },
          categories: [
            {
              id: "bestsellers",
              name: "Mais Vendidos",
              icon_name: "Star",
              icon: LucideIcons.Star,
              display_order: 1,
            },
            {
              id: "burgers",
              name: "Lanches",
              icon_name: "Utensils",
              icon: LucideIcons.Utensils,
              display_order: 2,
            },
            {
              id: "drinks",
              name: "Bebidas",
              icon_name: "Coffee",
              icon: LucideIcons.Coffee,
              display_order: 3,
            },
            {
              id: "desserts",
              name: "Sobremesas",
              icon_name: "IceCream2",
              icon: LucideIcons.IceCream2,
              display_order: 4,
            },
            {
              id: "promotions",
              name: "Promoções",
              icon_name: "Tag",
              icon: LucideIcons.Tag,
              display_order: 5,
            },
          ],
          products: [
            {
              id: "1",
              name: "X-Burger Clássico",
              description:
                "Hambúrguer artesanal, alface, tomate, cebola e molho especial",
              price: 18.9,
              category_id: "burgers",
              category: "Lanches",
              image: "🍔",
              bestseller: true,
              ingredients: [
                {
                  id: "1",
                  product_id: "1",
                  ingredient_name: "Hambúrguer",
                  is_removable: false,
                },
                {
                  id: "2",
                  product_id: "1",
                  ingredient_name: "Alface",
                  is_removable: true,
                },
                {
                  id: "3",
                  product_id: "1",
                  ingredient_name: "Tomate",
                  is_removable: true,
                },
                {
                  id: "4",
                  product_id: "1",
                  ingredient_name: "Cebola",
                  is_removable: true,
                },
                {
                  id: "5",
                  product_id: "1",
                  ingredient_name: "Molho especial",
                  is_removable: true,
                },
              ],
            },
            {
              id: "2",
              name: "X-Bacon Supremo",
              description:
                "Hambúrguer artesanal, bacon crocante, queijo cheddar, alface e tomate",
              price: 22.9,
              category_id: "burgers",
              category: "Lanches",
              image: "🥓",
              bestseller: true,
              ingredients: [
                {
                  id: "6",
                  product_id: "2",
                  ingredient_name: "Hambúrguer",
                  is_removable: false,
                },
                {
                  id: "7",
                  product_id: "2",
                  ingredient_name: "Bacon",
                  is_removable: false,
                },
                {
                  id: "8",
                  product_id: "2",
                  ingredient_name: "Queijo cheddar",
                  is_removable: true,
                },
                {
                  id: "9",
                  product_id: "2",
                  ingredient_name: "Alface",
                  is_removable: true,
                },
                {
                  id: "10",
                  product_id: "2",
                  ingredient_name: "Tomate",
                  is_removable: true,
                },
              ],
            },
            {
              id: "3",
              name: "Coca-Cola Lata",
              description: "Refrigerante Coca-Cola 350ml gelado",
              price: 5.0,
              category_id: "drinks",
              category: "Bebidas",
              image: "🥤",
              bestseller: false,
              ingredients: [],
            },
            {
              id: "4",
              name: "Sorvete Artesanal",
              description: "Sorvete cremoso sabor chocolate ou baunilha",
              price: 8.5,
              category_id: "desserts",
              category: "Sobremesas",
              image: "🍦",
              bestseller: false,
              ingredients: [],
            },
            {
              id: "5",
              name: "Combo X-Burger",
              description: "X-Burger + Batata + Refrigerante",
              price: 24.9,
              category_id: "promotions",
              category: "Promoções",
              image: "🍟",
              bestseller: true,
              ingredients: [
                {
                  id: "11",
                  product_id: "5",
                  ingredient_name: "X-Burger",
                  is_removable: false,
                },
                {
                  id: "12",
                  product_id: "5",
                  ingredient_name: "Batata frita",
                  is_removable: false,
                },
                {
                  id: "13",
                  product_id: "5",
                  ingredient_name: "Refrigerante",
                  is_removable: false,
                },
              ],
            },
          ],
          complementItems: [
            { id: "1", name: "Bacon Extra", price: 4.5 },
            { id: "2", name: "Cheddar Cremoso", price: 3.0 },
            { id: "3", name: "Queijo Suíço", price: 3.5 },
            { id: "4", name: "Molho Especial", price: 1.0 },
            { id: "5", name: "Alface Extra", price: 1.5 },
            { id: "6", name: "Tomate Extra", price: 1.5 },
            { id: "7", name: "Cebola Roxa", price: 1.0 },
            { id: "8", name: "Picles Extra", price: 1.0 },
          ],
          removableIngredients: [
            { id: "1", name: "Alface" },
            { id: "2", name: "Tomate" },
            { id: "3", name: "Cebola" },
            { id: "4", name: "Molho especial" },
            { id: "5", name: "Queijo cheddar" },
            { id: "6", name: "Bacon" },
            { id: "7", name: "Queijo" },
            { id: "8", name: "Ovo" },
            { id: "9", name: "Presunto" },
          ],
          isLoading: false,
        });
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error("❌ Erro geral:", error);

      // Fallback final - sempre funciona
      setDashboardData({
        restaurant: {
          id: "error",
          name: "fcrazybossburgers",
          address: "Vila Sanja",
          logo: "🍔",
        },
        categories: [
          {
            id: "burgers",
            name: "Lanches",
            icon_name: "Utensils",
            icon: LucideIcons.Utensils,
            display_order: 1,
          },
        ],
        products: [
          {
            id: "1",
            name: "X-Burger Clássico",
            description:
              "Hambúrguer artesanal, alface, tomate, cebola e molho especial",
            price: 18.9,
            category_id: "burgers",
            category: "Lanches",
            image: "🍔",
            bestseller: true,
            ingredients: [],
          },
        ],
        complementItems: [],
        removableIngredients: [],
        isLoading: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sincronização automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Sincronização automática...");
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    console.log("🔄 Atualizando dados manualmente...");
    fetchDashboardData();
  };

  return {
    ...dashboardData,
    isLoading,
    lastUpdate,
    refreshData,
  };
}
