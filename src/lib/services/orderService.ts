import { supabase } from "../supabase";
import {
  CartItem,
  CustomerData,
  OrderType,
  PaymentMethod,
  CardType,
} from "@/components/totem/types";
import { v4 as uuidv4 } from "uuid";

export interface CreateOrderData {
  orderType: OrderType;
  customerData: CustomerData;
  paymentMethod: PaymentMethod;
  cardType: CardType;
  cart: CartItem[];
  totalAmount: number;
}

export const orderService = {
  async createOrder(orderData: CreateOrderData): Promise<string | null> {
    try {
      // Gerar número do pedido
      const orderNumber = await this.generateOrderNumber();

      // Criar pedido principal
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          order_type: orderData.orderType!,
          customer_name: orderData.customerData.name || null,
          customer_cpf: orderData.customerData.cpf || null,
          wants_receipt: orderData.customerData.wantsReceipt,
          payment_method: orderData.paymentMethod!,
          card_type: orderData.cardType,
          total_amount: orderData.totalAmount,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        console.error("Erro ao criar pedido:", orderError);
        return null;
      }

      // Criar itens do pedido
      for (const item of orderData.cart) {
        const { data: orderItem, error: itemError } = await supabase
          .from("order_items")
          .insert({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
          })
          .select()
          .single();

        if (itemError) {
          console.error("Erro ao criar item do pedido:", itemError);
          continue;
        }

        // Adicionar complementos do item
        if (item.complements && item.complements.length > 0) {
          const complementsData = item.complements.map((comp) => ({
            order_item_id: orderItem.id,
            complement_name: comp.name,
            complement_price: comp.price,
          }));

          const { error: complementsError } = await supabase
            .from("order_item_complements")
            .insert(complementsData);

          if (complementsError) {
            console.error("Erro ao adicionar complementos:", complementsError);
          }
        }

        // Adicionar ingredientes removidos
        if (item.removedIngredients && item.removedIngredients.length > 0) {
          const removedIngredientsData = item.removedIngredients.map((ing) => ({
            order_item_id: orderItem.id,
            ingredient_name: ing.name,
          }));

          const { error: ingredientsError } = await supabase
            .from("order_item_removed_ingredients")
            .insert(removedIngredientsData);

          if (ingredientsError) {
            console.error(
              "Erro ao adicionar ingredientes removidos:",
              ingredientsError
            );
          }
        }
      }

      return order.id;
    } catch (error) {
      console.error("Erro no serviço de pedidos:", error);
      return null;
    }
  },

  async generateOrderNumber(): Promise<string> {
    try {
      // Buscar contador atual
      const { data: setting, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "order_counter")
        .single();

      let counter = 1;
      if (!error && setting) {
        counter = parseInt(setting.value) || 1;
      }

      // Atualizar contador
      await supabase.from("system_settings").upsert({
        key: "order_counter",
        value: (counter + 1).toString(),
        description: "Contador de pedidos do dia",
      });

      // Formato: DDMMYY-XXX (ex: 271224-001)
      const today = new Date();
      const dateStr = today
        .toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        .replace(/\//g, "");

      return `${dateStr}-${counter.toString().padStart(3, "0")}`;
    } catch (error) {
      console.error("Erro ao gerar número do pedido:", error);
      // Fallback para UUID curto
      return uuidv4().substring(0, 8).toUpperCase();
    }
  },

  async getTodayStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", today.toISOString());

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return {
          todayOrders: 0,
          todayRevenue: 0,
          dineInOrders: 0,
          takeawayOrders: 0,
        };
      }

      const todayOrders = data.length;
      const todayRevenue = data.reduce(
        (sum, order) => sum + order.total_amount,
        0
      );
      const dineInOrders = data.filter(
        (order) => order.order_type === "dine-in"
      ).length;
      const takeawayOrders = data.filter(
        (order) => order.order_type === "takeaway"
      ).length;

      return {
        todayOrders,
        todayRevenue,
        dineInOrders,
        takeawayOrders,
      };
    } catch (error) {
      console.error("Erro no serviço de estatísticas:", error);
      return {
        todayOrders: 0,
        todayRevenue: 0,
        dineInOrders: 0,
        takeawayOrders: 0,
      };
    }
  },
};
