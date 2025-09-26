// src/types/index.ts
export interface Restaurant {
  id: number;
  name: string;
  address: string;
  logo: string;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  bestseller: boolean;
  ingredients: string[];
}

export interface Complement {
  id: number;
  name: string;
  price: number;
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
  complements?: Complement[];
  removedIngredients?: Ingredient[];
}

export interface CustomerData {
  name: string;
  cpf: string;
  wantsReceipt: boolean;
}

export interface OrderData {
  items: CartItem[];
  total: number;
  paymentMethod: string;
  cardType?: string;
  orderType: "dine-in" | "takeaway";
  customerData: CustomerData;
  timestamp: string;
}
