import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          address: string;
          logo: string;
          phone: string | null;
          email: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          logo?: string;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          logo?: string;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon_name: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon_name: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon_name?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          category_id: string;
          image: string;
          is_bestseller: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          category_id: string;
          image?: string;
          is_bestseller?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          category_id?: string;
          image?: string;
          is_bestseller?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_ingredients: {
        Row: {
          id: string;
          product_id: string;
          ingredient_name: string;
          is_removable: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          ingredient_name: string;
          is_removable?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          ingredient_name?: string;
          is_removable?: boolean;
          created_at?: string;
        };
      };
      complements: {
        Row: {
          id: string;
          name: string;
          price: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          order_type: "dine-in" | "takeaway";
          customer_name: string | null;
          customer_cpf: string | null;
          wants_receipt: boolean;
          payment_method: "card_credit" | "card_debit" | "pix" | "cash";
          card_type: "credit" | "debit" | null;
          total_amount: number;
          status:
            | "pending"
            | "confirmed"
            | "preparing"
            | "ready"
            | "delivered"
            | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          order_type: "dine-in" | "takeaway";
          customer_name?: string | null;
          customer_cpf?: string | null;
          wants_receipt?: boolean;
          payment_method: "card_credit" | "card_debit" | "pix" | "cash";
          card_type?: "credit" | "debit" | null;
          total_amount: number;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "ready"
            | "delivered"
            | "cancelled";
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          order_type?: "dine-in" | "takeaway";
          customer_name?: string | null;
          customer_cpf?: string | null;
          wants_receipt?: boolean;
          payment_method?: "card_credit" | "card_debit" | "pix" | "cash";
          card_type?: "credit" | "debit" | null;
          total_amount?: number;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "ready"
            | "delivered"
            | "cancelled";
          created_at?: string;
        };
      };
    };
  };
}
