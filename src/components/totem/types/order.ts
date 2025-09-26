import { Product, ComplementItem, RemovableIngredient } from "./product";

export interface CartItem extends Product {
  complements?: ComplementItem[];
  removedIngredients?: RemovableIngredient[];
  quantity: number;
}

export interface CustomerData {
  name: string;
  cpf: string;
  wantsReceipt: boolean;
}

export type OrderType = "dine-in" | "takeaway" | null;
export type PaymentMethod =
  | "card_credit"
  | "card_debit"
  | "pix"
  | "cash"
  | null;
export type CardType = "credit" | "debit" | null;
export type InputStep = "receipt" | "cpf" | "name" | "payment";
export type CustomizationStep = "complements" | "ingredients";
