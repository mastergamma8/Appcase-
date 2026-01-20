import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import InventoryPage from './pages/InventoryPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoadingScreen from './components/LoadingScreen';

function AppContent() {
  const { initData } = useLaunchParams();
  const { isAuthenticated, isLoading, login } = useAuthStore();

  useEffect(() => {
    if (initData?.initDataRaw) {
      login(initData.initDataRaw);
    }
  }, [initData, login]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold text-white mb-2">CS2 Cases</h1>
          <p className="text-gray-400">Авторизация...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="leaderboard" element=<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <SDKProvider acceptCustomStyles>
      <AppContent />
    </SDKProvider>
  );
}

export default App;
