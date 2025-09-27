import { supabase } from "../supabase";
import { ComplementItem } from "@/components/totem/types";

export const complementService = {
  async getComplements(): Promise<ComplementItem[]> {
    try {
      const { data, error } = await supabase
        .from("complements")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar complementos:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de complementos:", error);
      return [];
    }
  },

  async getProductComplements(productId: string): Promise<ComplementItem[]> {
    try {
      const { data, error } = await supabase
        .from("product_complements")
        .select(
          `
          complements(*)
        `
        )
        .eq("product_id", productId);

      if (error) {
        console.error("Erro ao buscar complementos do produto:", error);
        return [];
      }

      return data.map((item) => item.complements).filter(Boolean);
    } catch (error) {
      console.error("Erro no serviço de complementos do produto:", error);
      return [];
    }
  },
};
