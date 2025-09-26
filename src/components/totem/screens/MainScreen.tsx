// Adicione no início do TotemMain.tsx, junto com as outras importações:
import AdminScreen from "./screens/AdminScreen";
import ErrorScreen from "./screens/ErrorScreen";
import LoadingScreen from "./screens/LoadingScreen";

// Adicione novos estados no TotemMain:
const [showAdmin, setShowAdmin] = useState(false);
const [systemError, setSystemError] = useState<
  "network" | "maintenance" | "general" | null
>(null);
const [isInitialLoading, setIsInitialLoading] = useState(true);

// Adicione no useEffect do fetchDashboardData:
useEffect(() => {
  const loadSystem = async () => {
    try {
      await fetchDashboardData();
      setIsInitialLoading(false);
    } catch (error) {
      setSystemError("network");
      setIsInitialLoading(false);
    }
  };

  loadSystem();
}, []);

// Adicione antes do return principal:
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

// Tela de erro
if (systemError) {
  return (
    <ErrorScreen
      errorType={systemError}
      onRetry={() => {
        setSystemError(null);
        fetchDashboardData();
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
