import { PackageOpen } from 'lucide-react'
import useThemeStore from '../../store/themeStore'

export default function EmptyState({ title = 'Henüz veri yok', description = 'Buraya eklenmiş içerik görünecek.', action }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: isDark ? '#374151' : '#F3F4F6' }}>
        <PackageOpen className="w-8 h-8" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }} />
      </div>
      <div>
        <p className="font-semibold" style={{ color: isDark ? '#F9FAFB' : '#1F2937' }}>{title}</p>
        <p className="text-sm mt-1" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}