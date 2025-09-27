import { supabase } from "../supabase";
import { Product, ProductIngredient } from "@/components/totem/types";

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(
          `
          *,
          categories!inner(name),
          product_ingredients(*)
        `
        )
        .eq("is_active", true);

      if (productsError) {
        console.error("Erro ao buscar produtos:", productsError);
        return [];
      }

      return productsData.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        category_id: product.category_id,
        category: product.categories.name,
        image: product.image,
        bestseller: product.is_bestseller,
        originalPrice: product.original_price,
        ingredients: product.product_ingredients || [],
      }));
    } catch (error) {
      console.error("Erro no serviço de produtos:", error);
      return [];
    }
  },

  async getProductIngredients(productId: string): Promise<ProductIngredient[]> {
    try {
      const { data, error } = await supabase
        .from("product_ingredients")
        .select("*")
        .eq("product_id", productId)
        .eq("is_removable", true);

      if (error) {
        console.error("Erro ao buscar ingredientes:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de ingredientes:", error);
      return [];
    }
  },
};
