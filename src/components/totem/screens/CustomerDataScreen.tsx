"use client";

import { useState } from "react";
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
  FileText,
  User,
  CreditCard,
  Smartphone,
  DollarSign,
  Check,
  Home,
  ShoppingBag,
  Landmark,
} from "lucide-react";
import { DashboardData } from "../types";
import { useTotemState } from "../hooks/useTotemState";
import { VirtualKeyboard, NumericKeyboard } from "../../keyboards";
import { CPFDisplay } from "../../displays";

// Importação condicional do orderService
let orderService: any;
try {
  orderService = require("@/lib/services/orderService").orderService;
} catch (error) {
  console.warn("OrderService não encontrado, usando processamento local");
  orderService = null;
}

// CPFUtils diretamente no arquivo
const CPFUtils = {
  clean: (cpf: string): string => cpf.replace(/\D/g, ""),

  format: (cpf: string): string => {
    const cleaned = CPFUtils.clean(cpf);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
    if (cleaned.length <= 9)
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
  },

  validate: (cpf: string): boolean => {
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

  isComplete: (cpf: string): boolean => CPFUtils.clean(cpf).length === 11,
};

interface CustomerDataScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function CustomerDataScreen({
  dashboardData,
  totemState,
}: CustomerDataScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Funções para manipulação do nome
  const handleNameKeyPress = (char: string) => {
    if (totemState.customerData.name.length < 50) {
      totemState.setCustomerData((prev) => ({
        ...prev,
        name: prev.name + char,
      }));
    }
  };

  const handleNameBackspace = () => {
    totemState.setCustomerData((prev) => ({
      ...prev,
      name: prev.name.slice(0, -1),
    }));
  };

  const handleNameSpace = () => {
    if (
      totemState.customerData.name.length > 0 &&
      !totemState.customerData.name.endsWith(" ")
    ) {
      totemState.setCustomerData((prev) => ({
        ...prev,
        name: prev.name + " ",
      }));
    }
  };

  const handleNameClear = () => {
    totemState.setCustomerData((prev) => ({
      ...prev,
      name: "",
    }));
  };

  // Funções para manipulação do CPF
  const handleCpfKeyPress = (digit: string) => {
    const currentCleaned = CPFUtils.clean(totemState.customerData.cpf);
    if (currentCleaned.length < 11) {
      const newCpf = CPFUtils.format(currentCleaned + digit);
      totemState.setCustomerData((prev) => ({
        ...prev,
        cpf: newCpf,
      }));
    }
  };

  const handleCpfBackspace = () => {
    const currentCleaned = CPFUtils.clean(totemState.customerData.cpf);
    if (currentCleaned.length > 0) {
      const newCleaned = currentCleaned.slice(0, -1);
      const newFormatted = CPFUtils.format(newCleaned);
      totemState.setCustomerData((prev) => ({
        ...prev,
        cpf: newFormatted,
      }));
    }
  };

  const handleCpfClear = () => {
    totemState.setCustomerData((prev) => ({
      ...prev,
      cpf: "",
    }));
  };

  // Funções de navegação
  const handleReceiptOption = (wantsReceipt: boolean) => {
    totemState.setCustomerData((prev) => ({
      ...prev,
      wantsReceipt,
    }));
    if (wantsReceipt) {
      totemState.setInputStep("cpf");
    } else {
      totemState.setInputStep("name");
    }
  };

  const handleCpfConfirm = () => {
    const isComplete = CPFUtils.isComplete(totemState.customerData.cpf);
    const isValid = CPFUtils.validate(totemState.customerData.cpf);
    if (isComplete && isValid) {
      totemState.setInputStep("name");
    }
  };

  const handleNameConfirm = () => {
    totemState.setInputStep("payment");
  };

  // Funções de pagamento
  const handlePaymentSelect = (
    method: "card_credit" | "card_debit" | "pix" | "cash"
  ) => {
    totemState.setPaymentMethod(method);
    if (method === "card_credit") {
      totemState.setCardType("credit");
    } else if (method === "card_debit") {
      totemState.setCardType("debit");
    } else {
      totemState.setCardType(null);
    }
  };

  const processPayment = async () => {
    try {
      setIsLoading(true);

      let orderId = null;

      // Tentar usar o orderService se disponível
      if (orderService) {
        const orderData = {
          orderType: totemState.orderType!,
          customerData: totemState.customerData,
          paymentMethod: totemState.paymentMethod!,
          cardType: totemState.cardType,
          cart: totemState.cart,
          totalAmount: totemState.calculateCartTotal(),
        };

        orderId = await orderService.createOrder(orderData);
      }

      // Preparar descrições
      let paymentDescription = "";
      if (totemState.paymentMethod === "card_credit")
        paymentDescription = "Cartão de Crédito";
      else if (totemState.paymentMethod === "card_debit")
        paymentDescription = "Cartão de Débito";
      else
        paymentDescription =
          totemState.paymentMethod === "pix" ? "PIX" : "Dinheiro";

      const orderTypeDescription =
        totemState.orderType === "dine-in"
          ? "Comer no Local"
          : "Levar para Viagem";

      // Mostrar confirmação
      const orderNumber = orderId
        ? orderId.substring(0, 8).toUpperCase()
        : `LOCAL-${Date.now().toString().slice(-6)}`;

      alert(
        `✅ Pedido realizado com sucesso!\n\n` +
          `Número do pedido: ${orderNumber}\n` +
          `Tipo: ${orderTypeDescription}\n` +
          `Cliente: ${totemState.customerData.name || "Não informado"}\n` +
          `CPF na nota: ${
            totemState.customerData.wantsReceipt
              ? totemState.customerData.cpf || "Não informado"
              : "Não solicitado"
          }\n` +
          `Total: R$ ${totemState.calculateCartTotal().toFixed(2)}\n` +
          `Pagamento: ${paymentDescription}\n\n` +
          `Obrigado pela preferência!\n` +
          `Aguarde a preparação do seu pedido.`
      );

      // Reset do sistema
      totemState.resetOrder();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("❌ Erro ao processar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
                totemState.orderType === "dine-in"
                  ? "bg-green-100 text-green-800 mt-2"
                  : "bg-blue-100 text-blue-800 mt-2"
              }
            >
              {totemState.orderType === "dine-in" ? (
                <>
                  <Home className="h-4 w-4 mr-1" /> Comer no Local
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-1" /> Levar para Viagem
                </>
              )}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => totemState.setCurrentScreen("cart")}
          >
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
              {totemState.cart.map((item) => (
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
                  R$ {totemState.calculateCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opção de CPF na nota */}
        {totemState.inputStep === "receipt" && (
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
                  variant={
                    totemState.customerData.wantsReceipt ? "default" : "outline"
                  }
                  onClick={() => handleReceiptOption(true)}
                >
                  Sim, incluir CPF
                </Button>
                <Button
                  className="flex-1 h-16 text-lg"
                  variant={
                    !totemState.customerData.wantsReceipt
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleReceiptOption(false)}
                >
                  Não, obrigado
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inserção de CPF */}
        {totemState.inputStep === "cpf" && (
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
              <CPFDisplay
                cpf={totemState.customerData.cpf}
                showValidation={true}
              />

              <NumericKeyboard
                onKeyPress={handleCpfKeyPress}
                onBackspace={handleCpfBackspace}
                onClear={handleCpfClear}
                onConfirm={handleCpfConfirm}
                disabled={isLoading}
                confirmDisabled={
                  !CPFUtils.isComplete(totemState.customerData.cpf) ||
                  !CPFUtils.validate(totemState.customerData.cpf)
                }
              />

              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => totemState.setInputStep("name")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Pular e continuar sem CPF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inserção do nome */}
        {totemState.inputStep === "name" && (
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
                  {totemState.customerData.name || (
                    <span className="text-gray-400 italic">
                      Digite seu nome...
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {totemState.customerData.name.length}/50 caracteres
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
        {totemState.inputStep === "payment" && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resumo dos Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Nome:</strong>{" "}
                    {totemState.customerData.name?.trim() || "Não informado"}
                  </p>
                  <p>
                    <strong>CPF na nota:</strong>{" "}
                    {totemState.customerData.wantsReceipt &&
                    totemState.customerData.cpf
                      ? totemState.customerData.cpf + " ✅"
                      : totemState.customerData.wantsReceipt
                      ? "Não informado"
                      : "Não solicitado"}
                  </p>
                  <p>
                    <strong>Tipo de pedido:</strong>{" "}
                    {totemState.orderType === "dine-in"
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
                  {/* Cartão de Crédito */}
                  <div
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      totemState.paymentMethod === "card_credit"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentSelect("card_credit")}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        totemState.paymentMethod === "card_credit"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {totemState.paymentMethod === "card_credit" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <Landmark className="h-8 w-8 mr-4 text-blue-500" />
                    <span className="text-xl font-semibold">
                      Cartão de Crédito
                    </span>
                  </div>

                  {/* Cartão de Débito */}
                  <div
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      totemState.paymentMethod === "card_debit"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentSelect("card_debit")}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        totemState.paymentMethod === "card_debit"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {totemState.paymentMethod === "card_debit" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <CreditCard className="h-8 w-8 mr-4 text-green-500" />
                    <span className="text-xl font-semibold">
                      Cartão de Débito
                    </span>
                  </div>

                  {/* PIX */}
                  <div
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      totemState.paymentMethod === "pix"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentSelect("pix")}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        totemState.paymentMethod === "pix"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {totemState.paymentMethod === "pix" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <Smartphone className="h-8 w-8 mr-4" />
                    <span className="text-xl font-semibold">PIX</span>
                  </div>

                  {/* Dinheiro */}
                  <div
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      totemState.paymentMethod === "cash"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentSelect("cash")}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        totemState.paymentMethod === "cash"
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {totemState.paymentMethod === "cash" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <DollarSign className="h-8 w-8 mr-4" />
                    <span className="text-xl font-semibold">Dinheiro</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => totemState.setInputStep("name")}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={processPayment}
                disabled={!totemState.paymentMethod || isLoading}
              >
                {isLoading
                  ? "Processando..."
                  : `Confirmar Pagamento - R$ ${totemState
                      .calculateCartTotal()
                      .toFixed(2)}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
