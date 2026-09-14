import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";
import useThemeStore from "../store/themeStore";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Tema değiştiğinde tüm sayfanın arka planını güncelle
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#090C14' : '#F9FAFB';
  }, [isDark]);

  return (
    <div className="min-h-screen flex transition-colors duration-200" style={{ backgroundColor: isDark ? '#090C14' : '#F9FAFB' }}>
      
      {/* Masaüstü Sidebar (Her zaman görünür) */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0 z-20">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>
      
      {/* Mobil Sidebar (Hamburger menüye basılınca açılır) */}
      <div className="lg:hidden">
        {/* Arka plan karartması */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Menünün kendisi */}
        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 transition-transform duration-300 ease-in-out z-50`}>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      {/* Sağ taraf - Navbar ve Değişen İçerik Alanı */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Sayfa içeriklerinin geleceği yer */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}