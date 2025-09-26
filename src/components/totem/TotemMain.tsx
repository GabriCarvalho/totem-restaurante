// src/components/totem/TotemMain.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  ShoppingCart,
  Check,
  X,
  CreditCard,
  Smartphone,
  DollarSign,
  Star,
  Utensils,
  Coffee,
  IceCream2,
  Tag,
  ChevronRight,
  User,
  FileText,
  Landmark,
  Home,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

// Importar as telas extras
import AdminScreen from "./screens/AdminScreen";
import ErrorScreen from "./screens/ErrorScreen";
import LoadingScreen from "./screens/LoadingScreen";

// Utilidade para validação e formatação de CPF
const CPFUtils = {
  clean: (cpf) => cpf.replace(/\D/g, ""),
  format: (cpf) => {
    const cleaned = CPFUtils.clean(cpf);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
    if (cleaned.length <= 9)
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
  },
  validate: (cpf) => {
    const cleaned = CPFUtils.clean(cpf);
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;
    return true;
  },
  isComplete: (cpf) => CPFUtils.clean(cpf).length === 11,
  getMask: (cpf) => {
    const cleaned = CPFUtils.clean(cpf);
    const mask = "___.___.___-__";
    let result = "";
    let maskIndex = 0;
    let cpfIndex = 0;
    while (maskIndex < mask.length && cpfIndex < cleaned.length) {
      if (mask[maskIndex] === "_") {
        result += cleaned[cpfIndex];
        cpfIndex++;
      } else {
        result += mask[maskIndex];
      }
      maskIndex++;
    }
    while (maskIndex < mask.length) {
      result += mask[maskIndex];
      maskIndex++;
    }
    return result;
  },
};

// Hook para buscar dados do dashboard
function useDashboardData() {
  const [dashboardData, setDashboardData] = useState({
    restaurant: {
      name: "fcrazybossburgers",
      address: "Carregando...",
      logo: "🍔",
    },
    categories: [
      { id: "bestsellers", name: "Mais Vendidos", icon: Star },
      { id: "burgers", name: "Lanches", icon: Utensils },
      { id: "drinks", name: "Bebidas", icon: Coffee },
      { id: "desserts", name: "Sobremesas", icon: IceCream2 },
      { id: "promotions", name: "Promoções", icon: Tag },
    ],
    complementItems: [],
    removableIngredients: [],
    products: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const mockApiResponse = {
        restaurant: {
          name: "fcrazybossburgers",
          address: "Vila Sanja",
          logo: "🍔",
        },
        complementItems: [
          { id: 101, name: "Bacon Extra", price: 4.5 },
          { id: 102, name: "Cheddar Cremoso", price: 3.0 },
          { id: 103, name: "Queijo Suíço", price: 3.5 },
          { id: 104, name: "Molho Especial", price: 1.0 },
          { id: 105, name: "Alface Extra", price: 1.5 },
          { id: 106, name: "Tomate Extra", price: 1.5 },
        ],
        removableIngredients: [
          { id: 201, name: "Cebola" },
          { id: 202, name: "Tomate" },
          { id: 203, name: "Alface" },
          { id: 204, name: "Molho" },
          { id: 205, name: "Picles" },
        ],
        products: [
          {
            id: 1,
            name: "X-Burger Clássico",
            description:
              "Hambúrguer artesanal, alface, tomate, cebola e molho especial",
            price: 18.9,
            category: "burgers",
            image: "🍔",
            bestseller: true,
            ingredients: [
              "Hambúrguer",
              "Alface",
              "Tomate",
              "Cebola",
              "Molho especial",
            ],
          },
          {
            id: 2,
            name: "X-Bacon Supremo",
            description:
              "Hambúrguer artesanal, bacon crocante, queijo cheddar, alface e tomate",
            price: 22.9,
            category: "burgers",
            image: "🥓",
            bestseller: true,
            ingredients: [
              "Hambúrguer",
              "Bacon",
              "Queijo cheddar",
              "Alface",
              "Tomate",
            ],
          },
          {
            id: 3,
            name: "Coca-Cola Lata",
            description: "Refrigerante Coca-Cola 350ml gelado",
            price: 5.0,
            category: "drinks",
            image: "🥤",
            ingredients: [],
          },
          {
            id: 4,
            name: "Sorvete Artesanal",
            description: "Sorvete cremoso sabor chocolate ou baunilha",
            price: 8.5,
            category: "desserts",
            image: "🍦",
            ingredients: [],
          },
          {
            id: 5,
            name: "Combo X-Burger",
            description: "X-Burger + Batata + Refrigerante",
            price: 24.9,
            category: "promotions",
            image: "🍟",
            originalPrice: 30.4,
            ingredients: ["X-Burger", "Batata frita", "Refrigerante"],
          },
        ],
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDashboardData((prev) => ({ ...prev, ...mockApiResponse }));
      setLastUpdate(new Date());
      console.log("🔄 Dados sincronizados às", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ Erro ao sincronizar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    ...dashboardData,
    isLoading,
    lastUpdate,
    refreshData,
  };
}

// Componente de Teclado Virtual
function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onSpace,
  onClear,
  onConfirm,
  disabled = false,
}) {
  const [isUpperCase, setIsUpperCase] = useState(false);
  const firstRow = isUpperCase
    ? ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
    : ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const secondRow = isUpperCase
    ? ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
    : ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const thirdRow = isUpperCase
    ? ["Z", "X", "C", "V", "B", "N", "M"]
    : ["z", "x", "c", "v", "b", "n", "m"];
  const numbersRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {numbersRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {firstRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {secondRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {thirdRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          className="h-12"
          onClick={() => setIsUpperCase(!isUpperCase)}
          disabled={disabled}
        >
          {isUpperCase ? "ABC" : "abc"}
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={onSpace}
          disabled={disabled}
        >
          Espaço
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={onBackspace}
          disabled={disabled}
        >
          ⌫
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={onClear}
          disabled={disabled}
        >
          Limpar
        </Button>
        <Button
          className="h-12 bg-green-600"
          onClick={onConfirm}
          disabled={disabled}
        >
          OK
        </Button>
      </div>
    </div>
  );
}

// Componente de Teclado Numérico
function NumericKeyboard({
  onKeyPress,
  onBackspace,
  onClear,
  onConfirm,
  disabled = false,
  confirmDisabled = false,
}) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", ""],
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {numbers.flat().map((num, index) =>
          num ? (
            <Button
              key={`num-${index}`}
              variant="outline"
              className="h-16 text-xl font-mono"
              onClick={() => onKeyPress(num)}
              disabled={disabled}
            >
              {num}
            </Button>
          ) : (
            <div key={`empty-${index}`} className="h-16" />
          )
        )}
      </div>
      <div className="flex gap-2 max-w-xs mx-auto mt-4">
        <Button
          variant="outline"
          className="flex-1 h-16 text-lg"
          onClick={onBackspace}
          disabled={disabled}
        >
          ⌫ Apagar
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-16 text-lg"
          onClick={onClear}
          disabled={disabled}
        >
          Limpar
        </Button>
      </div>
      <Button
        className="w-full h-16 bg-green-600 text-xl mt-2 max-w-xs mx-auto block"
        onClick={onConfirm}
        disabled={disabled || confirmDisabled}
      >
        Confirmar
      </Button>
    </div>
  );
}

// Componente para exibição de CPF
function CPFDisplay({ cpf, showValidation = false }) {
  const isValid = CPFUtils.validate(cpf);
  const isComplete = CPFUtils.isComplete(cpf);

  return (
    <div className="text-center">
      <div
        className={`text-2xl font-mono p-4 rounded-lg border-2 transition-colors ${
          showValidation && cpf
            ? isValid
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        {CPFUtils.getMask(cpf)}
      </div>
      {showValidation && cpf && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {isComplete ? (
            isValid ? (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm">CPF válido</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">CPF inválido</span>
              </div>
            )
          ) : (
            <div className="text-gray-500 text-sm">
              Digite os {11 - CPFUtils.clean(cpf).length} dígitos restantes
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// COMPONENTE PRINCIPAL
export default function TotemMain() {
  const { isLoading, lastUpdate, refreshData, ...dashboardData } =
    useDashboardData();

  // Estados principais
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [orderType, setOrderType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("bestsellers");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [productComplements, setProductComplements] = useState([]);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [customizationStep, setCustomizationStep] = useState("complements");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    cpf: "",
    wantsReceipt: false,
  });
  const [inputStep, setInputStep] = useState("receipt");

  // Estados para as telas adicionais
  const [showAdmin, setShowAdmin] = useState(false);
  const [systemError, setSystemError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Funções principais
  const getProductsByCategory = (category) => {
    if (category === "bestsellers") {
      return dashboardData.products.filter((product) => product.bestseller);
    }
    return dashboardData.products.filter(
      (product) => product.category === category
    );
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const complementsTotal =
        item.complements?.reduce(
          (compTotal, comp) => compTotal + comp.price,
          0
        ) || 0;
      return total + (item.price + complementsTotal) * item.quantity;
    }, 0);
  };

  const handleCategorySelect = (categoryId) => setSelectedCategory(categoryId);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductComplements([]);
    setRemovedIngredients([]);
    setCustomizationStep("complements");
    setCurrentScreen("customize");
  };

  const handleComplementToggle = (complement) => {
    setProductComplements((prev) => {
      const exists = prev.find((c) => c.id === complement.id);
      if (exists) return prev.filter((c) => c.id !== complement.id);
      return [...prev, complement];
    });
  };

  const handleIngredientToggle = (ingredient) => {
    setRemovedIngredients((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      if (exists) return prev.filter((i) => i.id !== ingredient.id);
      return [...prev, ingredient];
    });
  };

  const addToCart = () => {
    const cartItem = {
      id: Date.now(),
      ...selectedProduct,
      complements: productComplements,
      removedIngredients: removedIngredients,
      quantity: 1,
    };
    setCart((prev) => [...prev, cartItem]);
    setCurrentScreen("main");
    setSelectedProduct(null);
    setProductComplements([]);
    setRemovedIngredients([]);
  };

  const updateCartItemQuantity = (itemId, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(0, item.quantity + change);
            return newQuantity === 0
              ? null
              : { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const proceedToPayment = () => {
    setCurrentScreen("customer-data");
    setInputStep("receipt");
  };

  const handleNameKeyPress = (char) => {
    if (customerData.name.length < 50) {
      setCustomerData((prev) => ({ ...prev, name: prev.name + char }));
    }
  };

  const handleNameBackspace = () => {
    setCustomerData((prev) => ({ ...prev, name: prev.name.slice(0, -1) }));
  };

  const handleNameSpace = () => {
    if (customerData.name.length > 0 && !customerData.name.endsWith(" ")) {
      setCustomerData((prev) => ({ ...prev, name: prev.name + " " }));
    }
  };

  const handleNameClear = () => {
    setCustomerData((prev) => ({ ...prev, name: "" }));
  };

  const handleCpfKeyPress = (digit) => {
    const currentCleaned = CPFUtils.clean(customerData.cpf);
    if (currentCleaned.length < 11) {
      const newCpf = CPFUtils.format(currentCleaned + digit);
      setCustomerData((prev) => ({ ...prev, cpf: newCpf }));
    }
  };

  const handleCpfBackspace = () => {
    const currentCleaned = CPFUtils.clean(customerData.cpf);
    if (currentCleaned.length > 0) {
      const newCleaned = currentCleaned.slice(0, -1);
      const newFormatted = CPFUtils.format(newCleaned);
      setCustomerData((prev) => ({ ...prev, cpf: newFormatted }));
    }
  };

  const handleCpfClear = () => {
    setCustomerData((prev) => ({ ...prev, cpf: "" }));
  };

  const handleReceiptOption = (wantsReceipt) => {
    setCustomerData((prev) => ({ ...prev, wantsReceipt }));
    if (wantsReceipt) setInputStep("cpf");
    else setInputStep("name");
  };

  const handleCpfConfirm = () => {
    const isComplete = CPFUtils.isComplete(customerData.cpf);
    const isValid = CPFUtils.validate(customerData.cpf);
    if (isComplete && isValid) setInputStep("name");
  };

  const handleNameConfirm = () => setInputStep("payment");

  const handleCardTypeSelect = (type) => {
    setCardType(type);
    setPaymentMethod(`card_${type}`);
  };

  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
    setCurrentScreen("main");
  };

  const processPayment = () => {
    const orderData = {
      items: cart,
      total: calculateCartTotal(),
      paymentMethod,
      cardType,
      orderType,
      customerData,
      timestamp: new Date().toISOString(),
    };
    let paymentDescription = "";
    if (paymentMethod === "card_credit")
      paymentDescription = "Cartão de Crédito";
    else if (paymentMethod === "card_debit")
      paymentDescription = "Cartão de Débito";
    else paymentDescription = paymentMethod === "pix" ? "PIX" : "Dinheiro";
    const orderTypeDescription =
      orderType === "dine-in" ? "Comer no Local" : "Levar para Viagem";
    alert(
      `Pedido finalizado!\n\n` +
        `Tipo: ${orderTypeDescription}\n` +
        `Cliente: ${customerData.name || "Não informado"}\n` +
        `CPF na nota: ${
          customerData.wantsReceipt
            ? customerData.cpf || "Não informado"
            : "Não solicitado"
        }\n` +
        `Total: R$ ${calculateCartTotal().toFixed(2)}\n` +
        `Pagamento: ${paymentDescription}\n\n` +
        `Obrigado pela preferência!`
    );
    setCart([]);
    setCurrentScreen("welcome");
    setOrderType(null);
    setPaymentMethod(null);
    setCardType(null);
    setCustomerData({ name: "", cpf: "", wantsReceipt: false });
    setInputStep("receipt");
  };

  // VERIFICAÇÕES DE TELA

  // Tela de carregamento inicial
  if (isInitialLoading) {
    return (
      <LoadingScreen
        message="Iniciando sistema..."
        showProgress={true}
        progress={75}
      />
    );
  }

  // Verificação de erro
  if (systemError) {
    return (
      <ErrorScreen
        errorType={systemError}
        onRetry={() => {
          setSystemError(null);
          refreshData();
        }}
        onAdmin={() => setShowAdmin(true)}
      />
    );
  }

  // Tela administrativa
  if (showAdmin) {
    return (
      <AdminScreen
        onBack={() => setShowAdmin(false)}
        dashboardData={dashboardData}
        refreshData={refreshData}
        lastUpdate={lastUpdate}
      />
    );
  }

  // Tela de boas-vindas
  if (currentScreen === "welcome") {
    return (
      <div
        className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 cursor-pointer"
        onClick={() => setCurrentScreen("order-type")}
      >
        <div className="text-center max-w-xl select-none">
          <div className="text-8xl mb-6">{dashboardData.restaurant.logo}</div>
          <h1 className="text-5xl font-semibold text-gray-900 mb-2">
            {dashboardData.restaurant.name}
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            {dashboardData.restaurant.address}
          </p>
          <h2 className="text-3xl font-medium text-gray-700">
            Toque para começar
          </h2>

          {/* Botão secreto para admin */}
          <div
            className="absolute bottom-4 left-4 w-8 h-8 opacity-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowAdmin(true);
            }}
            title="Acesso Administrativo"
          />

          {/* Botões de teste para desenvolvimento */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSystemError("network");
                }}
              >
                Teste Erro Rede
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSystemError("maintenance");
                }}
              >
                Teste Manutenção
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tela de seleção do tipo de pedido
  if (currentScreen === "order-type") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-2xl w-full">
          <div className="text-6xl mb-8">{dashboardData.restaurant.logo}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {dashboardData.restaurant.name}
          </h1>
          <p className="text-lg text-gray-600 mb-12">Como você prefere hoje?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <Card
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleOrderTypeSelect("dine-in")}
            >
              <CardContent className="p-8 text-center">
                <Home className="h-16 w-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Comer no Local
                </h3>
                <p className="text-gray-600">
                  Prefere aproveitar no nosso ambiente
                </p>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleOrderTypeSelect("takeaway")}
            >
              <CardContent className="p-8 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Levar para Viagem
                </h3>
                <p className="text-gray-600">
                  Para levar e aproveitar onde preferir
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal com barra lateral
  if (currentScreen === "main") {
    const products = getProductsByCategory(selectedCategory);

    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Barra lateral fixa */}
        <div className="w-80 bg-white shadow-lg p-6">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">{dashboardData.restaurant.logo}</div>
            <h2 className="text-2xl font-bold text-gray-800">
              {dashboardData.restaurant.name}
            </h2>

            {/* Indicador do tipo de pedido */}
            <div className="mt-2 mb-4">
              <Badge
                variant="secondary"
                className={
                  orderType === "dine-in"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {orderType === "dine-in" ? (
                  <>
                    <Home className="h-3 w-3 mr-1" /> Comer no Local
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3 w-3 mr-1" /> Levar para Viagem
                  </>
                )}
              </Badge>
            </div>

            {isLoading && (
              <div className="text-sm text-yellow-600 mt-1">
                🔄 Carregando dados...
              </div>
            )}
          </div>

          <div className="space-y-2">
            {dashboardData.categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "ghost"
                  }
                  className="w-full justify-start text-left h-16 text-lg"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <IconComponent className="h-6 w-6 mr-3" />
                  {category.name}
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </Button>
              );
            })}

            <Button
              variant={cart.length > 0 ? "default" : "ghost"}
              className="w-full justify-start text-left h-16 text-lg bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setCurrentScreen("cart")}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Carrinho
              {cart.length > 0 && (
                <Badge className="ml-auto bg-red-500">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
            </Button>

            {/* Botão para alterar tipo de pedido */}
            <Button
              variant="outline"
              className="w-full justify-start text-left h-12 text-md mt-4"
              onClick={() => setCurrentScreen("order-type")}
            >
              <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
              Alterar Tipo
            </Button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {
                dashboardData.categories.find((c) => c.id === selectedCategory)
                  ?.name
              }
            </h1>

            {/* Indicador do tipo de pedido no header */}
            <Badge
              variant="secondary"
              className={
                orderType === "dine-in"
                  ? "bg-green-100 text-green-800 text-lg"
                  : "bg-blue-100 text-blue-800 text-lg"
              }
            >
              {orderType === "dine-in"
                ? "🍽️ Comer no Local"
                : "🥡 Levar para Viagem"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => handleProductSelect(product)}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{product.image}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>

                    {product.bestseller && (
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="h-4 w-4 mr-1" />
                        Mais Vendido
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Esta categoria ainda não possui produtos disponíveis.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tela de personalização
  if (currentScreen === "customize" && selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header do produto com tipo de pedido */}
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant="secondary"
              className={
                orderType === "dine-in"
                  ? "bg-green-100 text-green-800 text-lg"
                  : "bg-blue-100 text-blue-800 text-lg"
              }
            >
              {orderType === "dine-in"
                ? "🍽️ Comer no Local"
                : "🥡 Levar para Viagem"}
            </Badge>
            <Button variant="outline" onClick={() => setCurrentScreen("main")}>
              Voltar ao Cardápio
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="text-6xl mr-6">{selectedProduct.image}</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {selectedProduct.description}
                  </p>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {selectedProduct.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navegação entre etapas */}
          <div className="flex mb-6">
            <Button
              variant={
                customizationStep === "complements" ? "default" : "outline"
              }
              className="flex-1 mr-2"
              onClick={() => setCustomizationStep("complements")}
            >
              1. Adicionar Complementos
            </Button>
            <Button
              variant={
                customizationStep === "ingredients" ? "default" : "outline"
              }
              className="flex-1 ml-2"
              onClick={() => setCustomizationStep("ingredients")}
            >
              2. Remover Ingredientes
            </Button>
          </div>

          {/* Complementos opcionais */}
          {customizationStep === "complements" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Complementos Opcionais
                </CardTitle>
                <CardDescription className="text-lg">
                  Selecione os complementos que deseja adicionar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.complementItems.map((complement) => {
                    const isSelected = productComplements.find(
                      (c) => c.id === complement.id
                    );

                    return (
                      <div
                        key={complement.id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleComplementToggle(complement)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                              isSelected
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold">
                              {complement.name}
                            </h4>
                            <p className="text-green-600 font-bold">
                              + R$ {complement.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentScreen("main")}
                  >
                    Voltar
                  </Button>
                  <Button onClick={() => setCustomizationStep("ingredients")}>
                    Próximo: Ingredientes
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Remoção de ingredientes */}
          {customizationStep === "ingredients" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">Remover Ingredientes</CardTitle>
                <CardDescription className="text-lg">
                  Selecione os ingredientes que NÃO deseja no seu produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.removableIngredients.map((ingredient) => {
                    const isSelected = removedIngredients.find(
                      (i) => i.id === ingredient.id
                    );

                    return (
                      <div
                        key={ingredient.id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleIngredientToggle(ingredient)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                              isSelected
                                ? "border-red-500 bg-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && <X className="h-4 w-4 text-white" />}
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold">
                              {ingredient.name}
                            </h4>
                            {isSelected && (
                              <p className="text-red-600 font-bold">
                                Será removido
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCustomizationStep("complements")}
                  >
                    Voltar: Complementos
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={addToCart}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumo do produto */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Produto:</strong> {selectedProduct.name}
                </p>
                <p>
                  <strong>Preço base:</strong> R${" "}
                  {selectedProduct.price.toFixed(2)}
                </p>

                {productComplements.length > 0 && (
                  <div>
                    <p>
                      <strong>Complementos:</strong>
                    </p>
                    <ul className="ml-4">
                      {productComplements.map((comp) => (
                        <li key={comp.id}>
                          • {comp.name} (+R$ {comp.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {removedIngredients.length > 0 && (
                  <div>
                    <p>
                      <strong>Ingredientes removidos:</strong>
                    </p>
                    <ul className="ml-4">
                      {removedIngredients.map((ing) => (
                        <li key={ing.id} className="text-red-600">
                          • Sem {ing.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-xl font-bold text-green-600 pt-2 border-t">
                  Total: R${" "}
                  {(
                    selectedProduct.price +
                    productComplements.reduce(
                      (total, comp) => total + comp.price,
                      0
                    )
                  ).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela do carrinho
  if (currentScreen === "cart") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Seu Carrinho</h1>
              <Badge
                variant="secondary"
                className={
                  orderType === "dine-in"
                    ? "bg-green-100 text-green-800 mt-2"
                    : "bg-blue-100 text-blue-800 mt-2"
                }
              >
                {orderType === "dine-in"
                  ? "🍽️ Comer no Local"
                  : "🥡 Levar para Viagem"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentScreen("order-type")}
              >
                Alterar Tipo
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentScreen("main")}
              >
                Continuar Comprando
              </Button>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Carrinho vazio
              </h3>
              <p className="text-gray-500 mb-6">
                Adicione alguns produtos para continuar.
              </p>
              <Button onClick={() => setCurrentScreen("main")}>
                Voltar às Compras
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-4xl mr-4">{item.image}</div>
                          <div>
                            <h3 className="text-xl font-bold">{item.name}</h3>

                            {item.complements &&
                              item.complements.length > 0 && (
                                <div className="text-sm text-green-600 mt-1">
                                  <strong>Complementos:</strong>{" "}
                                  {item.complements
                                    .map((comp) => comp.name)
                                    .join(", ")}
                                </div>
                              )}

                            {item.removedIngredients &&
                              item.removedIngredients.length > 0 && (
                                <div className="text-sm text-red-600 mt-1">
                                  <strong>Sem:</strong>{" "}
                                  {item.removedIngredients
                                    .map((ing) => ing.name)
                                    .join(", ")}
                                </div>
                              )}

                            <div className="text-lg font-bold text-green-600 mt-2">
                              R${" "}
                              {(
                                (item.price +
                                  (item.complements?.reduce(
                                    (total, comp) => total + comp.price,
                                    0
                                  ) || 0)) *
                                item.quantity
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartItemQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-4 text-xl font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartItemQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">Total do Pedido:</span>
                    <span className="text-3xl font-bold text-green-600">
                      R$ {calculateCartTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentScreen("main")}
                    >
                      Continuar Comprando
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={proceedToPayment}
                    >
                      Finalizar Pedido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  // Tela de dados do cliente
  if (currentScreen === "customer-data") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Dados do Cliente
              </h1>
              <Badge
                variant="secondary"
                className={
                  orderType === "dine-in"
                    ? "bg-green-100 text-green-800 mt-2"
                    : "bg-blue-100 text-blue-800 mt-2"
                }
              >
                {orderType === "dine-in"
                  ? "🍽️ Comer no Local"
                  : "🥡 Levar para Viagem"}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => setCurrentScreen("cart")}>
              Voltar ao Carrinho
            </Button>
          </div>

          {/* Resumo do pedido */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      R${" "}
                      {(
                        (item.price +
                          (item.complements?.reduce(
                            (total, comp) => total + comp.price,
                            0
                          ) || 0)) *
                        item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-xl">
                  <span>Total:</span>
                  <span className="text-green-600">
                    R$ {calculateCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opção de CPF na nota */}
          {inputStep === "receipt" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  CPF na Nota Fiscal
                </CardTitle>
                <CardDescription>
                  Deseja incluir seu CPF na nota fiscal?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    className="flex-1 h-16 text-lg"
                    variant={customerData.wantsReceipt ? "default" : "outline"}
                    onClick={() => handleReceiptOption(true)}
                  >
                    Sim, incluir CPF
                  </Button>
                  <Button
                    className="flex-1 h-16 text-lg"
                    variant={!customerData.wantsReceipt ? "default" : "outline"}
                    onClick={() => handleReceiptOption(false)}
                  >
                    Não, obrigado
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inserção de CPF */}
          {inputStep === "cpf" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Informe seu CPF
                </CardTitle>
                <CardDescription>
                  Digite seu CPF para inclusão na nota fiscal. Será validado
                  automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CPFDisplay cpf={customerData.cpf} showValidation={true} />

                <NumericKeyboard
                  onKeyPress={handleCpfKeyPress}
                  onBackspace={handleCpfBackspace}
                  onClear={handleCpfClear}
                  onConfirm={handleCpfConfirm}
                  disabled={isLoading}
                  confirmDisabled={
                    !CPFUtils.isComplete(customerData.cpf) ||
                    !CPFUtils.validate(customerData.cpf)
                  }
                />

                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setInputStep("name")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Pular e continuar sem CPF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inserção do nome */}
          {inputStep === "name" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Seu Nome (Opcional)
                </CardTitle>
                <CardDescription>
                  Digite seu nome para identificação do pedido. Máximo 50
                  caracteres.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-xl bg-gray-100 p-4 rounded-lg min-h-[60px] border-2">
                    {customerData.name || (
                      <span className="text-gray-400 italic">
                        Digite seu nome...
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {customerData.name.length}/50 caracteres
                  </div>
                </div>

                <VirtualKeyboard
                  onKeyPress={handleNameKeyPress}
                  onBackspace={handleNameBackspace}
                  onSpace={handleNameSpace}
                  onClear={handleNameClear}
                  onConfirm={handleNameConfirm}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
          )}

          {/* Seleção de pagamento */}
          {inputStep === "payment" && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Resumo dos Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Nome:</strong>{" "}
                      {customerData.name?.trim() || "Não informado"}
                    </p>
                    <p>
                      <strong>CPF na nota:</strong>{" "}
                      {customerData.wantsReceipt && customerData.cpf
                        ? customerData.cpf + " ✅"
                        : customerData.wantsReceipt
                        ? "Não informado"
                        : "Não solicitado"}
                    </p>
                    <p>
                      <strong>Tipo de pedido:</strong>{" "}
                      {orderType === "dine-in"
                        ? "Comer no Local"
                        : "Levar para Viagem"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Escolha a forma de pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Opção Cartão (com sub-opções) */}
                    <div
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        paymentMethod?.startsWith("card_")
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          paymentMethod?.startsWith("card_")
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod?.startsWith("card_") && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <CreditCard className="h-8 w-8 mr-4" />
                      <span className="text-xl font-semibold">Cartão</span>
                    </div>

                    {/* Sub-opções do cartão */}
                    {paymentMethod === "card" && (
                      <div className="ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
                        <div
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                            cardType === "credit"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleCardTypeSelect("credit")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              cardType === "credit"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {cardType === "credit" && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <Landmark className="h-5 w-5 mr-3 text-blue-500" />
                          <span>Cartão de Crédito</span>
                        </div>

                        <div
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                            cardType === "debit"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleCardTypeSelect("debit")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              cardType === "debit"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {cardType === "debit" && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <CreditCard className="h-5 w-5 mr-3 text-green-500" />
                          <span>Cartão de Débito</span>
                        </div>
                      </div>
                    )}

                    {/* Outras opções de pagamento */}
                    {[
                      { id: "pix", name: "PIX", icon: Smartphone },
                      { id: "cash", name: "Dinheiro", icon: DollarSign },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setPaymentMethod(method.id);
                          setCardType(null);
                        }}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                            paymentMethod === method.id
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === method.id && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <method.icon className="h-8 w-8 mr-4" />
                        <span className="text-xl font-semibold">
                          {method.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setInputStep("name")}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={processPayment}
                  disabled={
                    !paymentMethod || (paymentMethod === "card" && !cardType)
                  }
                >
                  Confirmar Pagamento - R$ {calculateCartTotal().toFixed(2)}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
