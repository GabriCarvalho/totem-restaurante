export interface Product {
  id: string; // Mudou de number para string (UUID)
  name: string;
  description: string;
  price: number;
  category_id: string; // Adicionado
  category: string; // Mantido para compatibilidade
  image: string;
  bestseller?: boolean;
  originalPrice?: number;
  ingredients: ProductIngredient[]; // Mudou de string[] para ProductIngredient[]
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_name: string;
  is_removable: boolean;
}

export interface ComplementItem {
  id: string; // Mudou de number para string (UUID)
  name: string;
  price: number;
}

export interface RemovableIngredient {
  id: string; // Mudou de number para string (UUID)
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon_name: string; // Mudou de icon para icon_name
  icon?: any; // Mantido para compatibilidade
  display_order: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  logo: string;
  phone?: string;
  email?: string;
}
