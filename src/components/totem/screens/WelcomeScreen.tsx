// src/components/totem/screens/WelcomeScreen.tsx
interface WelcomeScreenProps {
  dashboardData: any;
  setCurrentScreen: (screen: string) => void;
}

export default function WelcomeScreen({
  dashboardData,
  setCurrentScreen,
}: WelcomeScreenProps) {
  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 cursor-pointer"
      onClick={() => setCurrentScreen("order-type")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setCurrentScreen("order-type");
        }
      }}
      aria-label="Toque para começar"
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
      </div>
    </div>
  );
}
