import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import { Outlet } from 'react-router-dom'
import useThemeStore from '../store/themeStore'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#090C14' : '#F9FAFB'
  }, [isDark])

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: isDark ? '#090C14' : '#F9FAFB' }}>
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}