import WhatsAppBaglanti from '../components/WhatsAppBaglanti'
import useThemeStore from '../store/themeStore'

export default function BotDurumu() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Bot Durumu</h1>
        <p className="text-sm mt-1" style={{ color: textSecondary }}>
          WhatsApp bağlantınızın durumunu görüntüleyin ve yönetin
        </p>
      </div>
      <WhatsAppBaglanti />
    </div>
  )
}