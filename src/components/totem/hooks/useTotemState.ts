import { useState } from "react";
import {
  ScreenType,
  SystemError,
  OrderType,
  PaymentMethod,
  CardType,
  InputStep,
  CustomizationStep,
  CartItem,
  CustomerData,
  Product,
  ComplementItem,
  RemovableIngredient,
} from "../../../types";

export function useTotemState() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("welcome");
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [selectedCategory, setSelectedCategory] = useState("bestsellers");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productComplements, setProductComplements] = useState<
    ComplementItem[]
  >([]);
  const [removedIngredients, setRemovedIngredients] = useState<
    RemovableIngredient[]
  >([]);
  const [customizationStep, setCustomizationStep] =
    useState<CustomizationStep>("complements");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardType, setCardType] = useState<CardType>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    cpf: "",
    wantsReceipt: false,
  });
  const [inputStep, setInputStep] = useState<InputStep>("receipt");
  const [showAdmin, setShowAdmin] = useState(false);
  const [systemError, setSystemError] = useState<SystemError>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const calculateCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const complementsTotal =
        item.complements?.reduce(
          (compTotal, comp) => compTotal + comp.price,
          0
        ) || 0;
      return total + (item.price + complementsTotal) * item.quantity;
    }, 0);
  };

  const resetOrder = () => {
    setCart([]);
    setCurrentScreen("welcome");
    setOrderType(null);
    setPaymentMethod(null);
    setCardType(null);
    setCustomerData({ name: "", cpf: "", wantsReceipt: false });
    setInputStep("receipt");
    setSelectedProduct(null);
    setProductComplements([]);
    setRemovedIngredients([]);
  };

  return {
    currentScreen,
    orderType,
    selectedCategory,
    selectedProduct,
    cart,
    productComplements,
    removedIngredients,
    customizationStep,
    paymentMethod,
    cardType,
    customerData,
    inputStep,
    showAdmin,
    systemError,
    isInitialLoading,
    setCurrentScreen,
    setOrderType,
    setSelectedCategory,
    setSelectedProduct,
    setCart,
    setProductComplements,
    setRemovedIngredients,
    setCustomizationStep,
    setPaymentMethod,
    setCardType,
    setCustomerData,
    setInputStep,
    setShowAdmin,
    setSystemError,
    setIsInitialLoading,
    calculateCartTotal,
    resetOrder,
  };
}
