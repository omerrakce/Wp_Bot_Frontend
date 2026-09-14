import { useState, useRef, useEffect } from 'react'
import { Check, Plus, ChevronDown } from 'lucide-react'
import useThemeStore from '../../store/themeStore'

export default function CategoryCombobox({ label, value, onChange, options }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [acik, setAcik] = useState(false)
  const [arama, setArama] = useState('')
  const kutuRef = useRef(null)

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const inputBg = isDark ? '#111827' : 'white'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const hoverBg = isDark ? '#1F2937' : '#F9FAFB'

  useEffect(() => {
    const disaTikla = (e) => {
      if (kutuRef.current && !kutuRef.current.contains(e.target)) {
        setAcik(false); setArama('')
      }
    }
    document.addEventListener('mousedown', disaTikla)
    return () => document.removeEventListener('mousedown', disaTikla)
  }, [])

  const filtrelenmis = options.filter((o) => o.toLowerCase().includes(arama.toLowerCase()))
  const tamEslesme = options.some((o) => o.toLowerCase() === arama.trim().toLowerCase())
  const yeniEklenebilir = arama.trim().length > 0 && !tamEslesme

  const sec = (secilen) => { onChange(secilen); setAcik(false); setArama('') }

  return (
    <div className="flex flex-col gap-1 relative" ref={kutuRef}>
      {label && (
        <label className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>{label}</label>
      )}
      <button type="button" onClick={() => setAcik((a) => !a)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none flex items-center justify-between text-left"
        style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: value ? textPrimary : textSecondary }}>
        {value || 'Kategori seçin veya yazın...'}
        <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: textSecondary }} />
      </button>

      {acik && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 overflow-hidden border"
          style={{ backgroundColor: inputBg, borderColor }}>
          <input autoFocus type="text" value={arama} onChange={(e) => setArama(e.target.value)}
            placeholder="Ara veya yeni kategori yaz..."
            className="w-full px-3 py-2 text-sm outline-none border-b"
            style={{ backgroundColor: inputBg, borderColor, color: textPrimary }} />

          <div className="max-h-48 overflow-y-auto">
            {filtrelenmis.map((o) => (
              <button key={o} type="button" onClick={() => sec(o)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors"
                style={{ color: textPrimary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                {o}
                {value === o && <Check className="w-3.5 h-3.5" style={{ color: '#25D366' }} />}
              </button>
            ))}

            {yeniEklenebilir && (
              <button type="button" onClick={() => sec(arama.trim())}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left border-t"
                style={{ color: '#25D366', borderColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Plus className="w-3.5 h-3.5" /> "{arama.trim()}" kategorisini oluştur
              </button>
            )}

            {filtrelenmis.length === 0 && !yeniEklenebilir && (
              <p className="px-3 py-4 text-xs text-center" style={{ color: textSecondary }}>Kategori bulunamadı</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}