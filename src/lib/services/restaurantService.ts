import { supabase } from "../supabase";
import { Restaurant } from "@/components/totem/types";

export const restaurantService = {
  async getRestaurant(): Promise<Restaurant | null> {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Erro ao buscar restaurante:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro no serviço de restaurante:", error);
      return null;
    }
  },

  async updateRestaurant(
    id: string,
    updates: Partial<Restaurant>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("restaurants")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar restaurante:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro no serviço de atualização:", error);
      return false;
    }
  },
};
