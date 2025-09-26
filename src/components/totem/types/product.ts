export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  bestseller?: boolean;
  originalPrice?: number;
  ingredients: string[];
}

export interface ComplementItem {
  id: number;
  name: string;
  price: number;
}

export interface RemovableIngredient {
  id: number;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}
