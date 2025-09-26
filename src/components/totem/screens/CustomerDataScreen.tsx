// src/components/totem/screens/CustomerDataScreen.tsx
"use client";

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
import { CPFDisplay } from "../../displays/CPFDisplay";
import { CPFUtils } from "../utils/cpf";

interface CustomerDataScreenProps {
  dashboardData: DashboardData;
  totemState: ReturnType<typeof useTotemState>;
}

export function CustomerDataScreen({
  dashboardData,
  totemState,
}: CustomerDataScreenProps) {
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
  const handleCardTypeSelect = (type: "credit" | "debit") => {
    totemState.setCardType(type);
    totemState.setPaymentMethod(`card_${type}` as any);
  };

  const processPayment = () => {
    const orderData = {
      items: totemState.cart,
      total: totemState.calculateCartTotal(),
      paymentMethod: totemState.paymentMethod,
      cardType: totemState.cardType,
      orderType: totemState.orderType,
      customerData: totemState.customerData,
      timestamp: new Date().toISOString(),
    };

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

    alert(
      `Pedido finalizado!\n\n` +
        `Tipo: ${orderTypeDescription}\n` +
        `Cliente: ${totemState.customerData.name || "Não informado"}\n` +
        `CPF na nota: ${
          totemState.customerData.wantsReceipt
            ? totemState.customerData.cpf || "Não informado"
            : "Não solicitado"
        }\n` +
        `Total: R$ ${totemState.calculateCartTotal().toFixed(2)}\n` +
        `Pagamento: ${paymentDescription}\n\n` +
        `Obrigado pela preferência!`
    );

    // Reset do sistema
    totemState.resetOrder();
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
                disabled={dashboardData.isLoading}
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
                disabled={dashboardData.isLoading}
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
                  {/* Opção Cartão (com sub-opções) */}
                  <div
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      totemState.paymentMethod?.startsWith("card_")
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => totemState.setPaymentMethod("card" as any)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        totemState.paymentMethod?.startsWith("card_")
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {totemState.paymentMethod?.startsWith("card_") && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <CreditCard className="h-8 w-8 mr-4" />
                    <span className="text-xl font-semibold">Cartão</span>
                  </div>

                  {/* Sub-opções do cartão */}
                  {totemState.paymentMethod === "card" && (
                    <div className="ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
                      <div
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          totemState.cardType === "credit"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleCardTypeSelect("credit")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            totemState.cardType === "credit"
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {totemState.cardType === "credit" && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <Landmark className="h-5 w-5 mr-3 text-blue-500" />
                        <span>Cartão de Crédito</span>
                      </div>

                      <div
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          totemState.cardType === "debit"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleCardTypeSelect("debit")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            totemState.cardType === "debit"
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {totemState.cardType === "debit" && (
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
                        totemState.paymentMethod === method.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        totemState.setPaymentMethod(method.id as any);
                        totemState.setCardType(null);
                      }}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          totemState.paymentMethod === method.id
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {totemState.paymentMethod === method.id && (
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
                onClick={() => totemState.setInputStep("name")}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={processPayment}
                disabled={
                  !totemState.paymentMethod ||
                  (totemState.paymentMethod === "card" && !totemState.cardType)
                }
              >
                Confirmar Pagamento - R${" "}
                {totemState.calculateCartTotal().toFixed(2)}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
