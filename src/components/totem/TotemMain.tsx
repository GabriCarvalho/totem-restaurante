"use client";

import { useEffect } from "react";
import { useDashboardData } from "./hooks/useDashboardData";
import { useTotemState } from "./hooks/useTotemState";

// Importar todas as telas
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { OrderTypeScreen } from "./screens/OrderTypeScreen";
import { MainScreen } from "./screens/MainScreen";
import { CustomizeScreen } from "./screens/CustomizeScreen";
import { CartScreen } from "./screens/CartScreen";
import { CustomerDataScreen } from "./screens/CustomerDataScreen";
import { AdminScreen } from "./screens/AdminScreen";
import { ErrorScreen } from "./screens/ErrorScreen";
import { LoadingScreen } from "./screens/LoadingScreen";

export default function TotemMain() {
  const dashboardData = useDashboardData();
  const totemState = useTotemState();

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      totemState.setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [totemState]);

  // ✅ Inicializar categoria quando os dados carregarem
  useEffect(() => {
    if (!dashboardData.isLoading && dashboardData.categories.length > 0) {
      totemState.initializeWithFirstCategory(dashboardData.categories);
    }
  }, [dashboardData.isLoading, dashboardData.categories, totemState]);

  // Verificações de tela em ordem de prioridade
  if (totemState.isInitialLoading) {
    return (
      <LoadingScreen
        message="Iniciando sistema..."
        showProgress={true}
        progress={75}
      />
    );
  }

  // Mostrar loading enquanto carrega dados do Supabase
  if (dashboardData.isLoading) {
    return (
      <LoadingScreen
        message="Carregando dados do restaurante..."
        showProgress={true}
        progress={50}
      />
    );
  }

  // Verificar se houve erro no carregamento
  if (dashboardData.restaurant.name === "Erro ao carregar") {
    return (
      <ErrorScreen
        errorType="connection"
        onRetry={() => {
          dashboardData.refreshData();
        }}
        onAdmin={() => totemState.setShowAdmin(true)}
      />
    );
  }

  if (totemState.systemError) {
    return (
      <ErrorScreen
        errorType={totemState.systemError}
        onRetry={() => {
          totemState.setSystemError(null);
          dashboardData.refreshData();
        }}
        onAdmin={() => totemState.setShowAdmin(true)}
      />
    );
  }

  if (totemState.showAdmin) {
    return (
      <AdminScreen
        onBack={() => totemState.setShowAdmin(false)}
        dashboardData={dashboardData}
        refreshData={dashboardData.refreshData}
        lastUpdate={dashboardData.lastUpdate}
      />
    );
  }

  // Roteamento das telas principais
  switch (totemState.currentScreen) {
    case "welcome":
      return (
        <WelcomeScreen
          restaurant={dashboardData.restaurant}
          onStart={() => totemState.setCurrentScreen("order-type")}
          onAdminAccess={() => totemState.setShowAdmin(true)}
          onTriggerError={(errorType) => totemState.setSystemError(errorType)}
        />
      );

    case "order-type":
      return (
        <OrderTypeScreen
          restaurant={dashboardData.restaurant}
          onSelectOrderType={(type) => {
            totemState.setOrderType(type);
            totemState.setCurrentScreen("main");
          }}
        />
      );

    case "main":
      return (
        <MainScreen dashboardData={dashboardData} totemState={totemState} />
      );

    case "customize":
      return (
        <CustomizeScreen
          dashboardData={dashboardData}
          totemState={totemState}
        />
      );

    case "cart":
      return (
        <CartScreen dashboardData={dashboardData} totemState={totemState} />
      );

    case "customer-data":
      return (
        <CustomerDataScreen
          dashboardData={dashboardData}
          totemState={totemState}
        />
      );

    default:
      return (
        <WelcomeScreen
          restaurant={dashboardData.restaurant}
          onStart={() => totemState.setCurrentScreen("order-type")}
          onAdminAccess={() => totemState.setShowAdmin(true)}
          onTriggerError={(errorType) => totemState.setSystemError(errorType)}
        />
      );
  }
}
