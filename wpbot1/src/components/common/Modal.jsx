import { X } from 'lucide-react'
import { useEffect } from 'react'
import useThemeStore from '../../store/themeStore'

export default function Modal({ isOpen, onClose, title, children }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-lg sm:rounded-xl rounded-t-xl shadow-xl z-10 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: isDark ? '#1F2937' : 'white',
          border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
        }}
      >
        <div className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
          <h2 className="font-semibold" style={{ color: isDark ? '#F9FAFB' : '#1F2937' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors"
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}