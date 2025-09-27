import * as LucideIcons from "lucide-react";

// Mapear ícones para as categorias
export const getCategoryIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Star: LucideIcons.Star,
    Utensils: LucideIcons.Utensils,
    Coffee: LucideIcons.Coffee,
    IceCream2: LucideIcons.IceCream2,
    Tag: LucideIcons.Tag,
    Package: LucideIcons.Package,
  };

  return iconMap[iconName] || LucideIcons.Package;
};

// Aplicar ícones às categorias
export const applyCategoryIcons = (categories: any[]) => {
  return categories.map((category) => ({
    ...category,
    icon: getCategoryIcon(category.icon_name),
  }));
};

// Constantes do sistema
export const SYSTEM_CONSTANTS = {
  MAX_CART_ITEMS: 50,
  MAX_CUSTOMER_NAME_LENGTH: 50,
  ADMIN_PASSWORD: "1234",
  AUTO_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutos
};
