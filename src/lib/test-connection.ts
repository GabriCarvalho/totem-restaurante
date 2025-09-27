import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  try {
    console.log("🔍 Testando conexão com Supabase...");

    // Testar conexão básica
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Erro na conexão:", error);
      return false;
    }

    console.log("✅ Conexão com Supabase OK!");
    console.log("📊 Dados de teste:", data);
    return true;
  } catch (error) {
    console.error("❌ Erro crítico:", error);
    return false;
  }
}
