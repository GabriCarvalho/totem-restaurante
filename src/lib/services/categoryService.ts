import { supabase } from "../supabase";
import { Category } from "@/components/totem/types";
import * as LucideIcons from "lucide-react";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        console.error("Erro ao buscar categorias:", error);
        return [];
      }

      // Mapear ícones do Lucide React
      return data.map((category) => ({
        ...category,
        id: category.id,
        icon: (LucideIcons as any)[category.icon_name] || LucideIcons.Package,
      }));
    } catch (error) {
      console.error("Erro no serviço de categorias:", error);
      return [];
    }
  },
};
