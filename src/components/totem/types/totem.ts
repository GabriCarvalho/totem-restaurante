import {
  Category,
  Product,
  ComplementItem,
  RemovableIngredient,
} from "./product";

export type ScreenType =
  | "welcome"
  | "order-type"
  | "main"
  | "customize"
  | "cart"
  | "customer-data";

export type SystemError = "network" | "maintenance" | "general" | null;

export interface Restaurant {
  name: string;
  address: string;
  logo: string;
}

export interface DashboardData {
  restaurant: Restaurant;
  categories: Category[];
  complementItems: ComplementItem[];
  removableIngredients: RemovableIngredient[];
  products: Product[];
}
