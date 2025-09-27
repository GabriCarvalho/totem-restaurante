import { useState } from "react";

export function useTotemState() {
  // Estados principais - INICIAR COM A PRIMEIRA CATEGORIA (será "Mais Vendidos")
  const [currentScreen, setCurrentScreen] = useState<string>("welcome");
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // ✅ Vazio inicialmente, será definido quando carregar as categorias
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | null>(
    null
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [systemError, setSystemError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Estados do produto selecionado
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productComplements, setProductComplements] = useState<any[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [customizationStep, setCustomizationStep] =
    useState<string>("complements");

  // Estados do carrinho
  const [cart, setCart] = useState<any[]>([]);

  // Estados do cliente
  const [customerData, setCustomerData] = useState({
    name: "",
    cpf: "",
    wantsReceipt: false,
  });
  const [inputStep, setInputStep] = useState<string>("receipt");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string | null>(null);

  // Funções do carrinho
  const addToCart = (item: any) => {
    setCart((prev) => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartItem = (itemId: string, updates: any) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal =
        item.price +
        (item.complements?.reduce(
          (sum: number, comp: any) => sum + comp.price,
          0
        ) || 0);
      return total + itemTotal * item.quantity;
    }, 0);
  };

  const resetOrder = () => {
    setCurrentScreen("welcome");
    setSelectedCategory(""); // ✅ Resetar para vazio, será definido quando carregar
    setOrderType(null);
    setSelectedProduct(null);
    setProductComplements([]);
    setRemovedIngredients([]);
    setCart([]);
    setCustomerData({ name: "", cpf: "", wantsReceipt: false });
    setInputStep("receipt");
    setPaymentMethod(null);
    setCardType(null);
  };

  // ✅ Função para definir categoria inicial
  const initializeWithFirstCategory = (categories: any[]) => {
    if (selectedCategory === "" && categories.length > 0) {
      // Procurar por "Mais Vendidos" primeiro
      const bestsellersCategory = categories.find(
        (cat) => cat.name === "Mais Vendidos"
      );
      if (bestsellersCategory) {
        setSelectedCategory(bestsellersCategory.id);
      } else {
        // Se não encontrar, usar a primeira categoria
        setSelectedCategory(categories[0].id);
      }
    }
  };

  return {
    // Estados
    currentScreen,
    selectedCategory,
    orderType,
    isInitialLoading,
    systemError,
    showAdmin,
    selectedProduct,
    productComplements,
    removedIngredients,
    customizationStep,
    cart,
    customerData,
    inputStep,
    paymentMethod,
    cardType,

    // Setters
    setCurrentScreen,
    setSelectedCategory,
    setOrderType,
    setIsInitialLoading,
    setSystemError,
    setShowAdmin,
    setSelectedProduct,
    setProductComplements,
    setRemovedIngredients,
    setCustomizationStep,
    setCustomerData,
    setInputStep,
    setPaymentMethod,
    setCardType,

    // Funções
    addToCart,
    removeFromCart,
    updateCartItem,
    calculateCartTotal,
    resetOrder,
    initializeWithFirstCategory, // ✅ Nova função
  };
}
