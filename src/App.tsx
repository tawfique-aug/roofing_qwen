import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages with layout */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 pt-16 lg:pt-20">
                  <HomePage />
                </div>
                <Footer />
                <ChatWidget />
              </div>
            }
          />

          {/* Login - no layout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard - minimal layout */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
