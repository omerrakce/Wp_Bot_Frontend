import useThemeStore from '../../store/themeStore'

const formatla = (rakamlar) => {
  const d = rakamlar.slice(0, 10)
  if (d.length === 0) return ''
  if (d.length <= 3) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6)}`
}

export const sadeceRakam = (deger = '') => {
  let d = String(deger).replace(/\D/g, '')
  if (d.startsWith('90')) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  return d.slice(0, 10)
}

export const gosterTelefon = (deger) => {
  const d = sadeceRakam(deger)
  if (d.length !== 10) return `+90 ${d}`
  return `+90 ${d.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2 $3')}`
}

export default function PhoneInput({ label, value, onChange, hint }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const rakamlar = sadeceRakam(value)
  const gecerli = rakamlar.length === 10
  const bosMu = rakamlar.length === 0

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const inputBg = isDark ? '#111827' : 'white'
  const prefixBg = isDark ? '#1F2937' : '#F3F4F6'

  const kenarRengi = bosMu ? (isDark ? '#374151' : '#E5E7EB') : gecerli ? '#10B981' : '#F59E0B'

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>{label}</label>
      )}
      <div className="flex items-stretch rounded-lg overflow-hidden" style={{ border: `1px solid ${kenarRengi}` }}>
        <span className="flex items-center px-3 text-sm font-semibold select-none border-r"
          style={{ backgroundColor: prefixBg, color: textPrimary, borderColor: kenarRengi }}>+90</span>
        <input
          type="tel" inputMode="numeric"
          value={formatla(rakamlar)}
          onChange={(e) => onChange(sadeceRakam(e.target.value))}
          placeholder="(5XX) XXX XXXX"
          className="flex-1 px-3 py-2 text-sm outline-none tracking-wide"
          style={{ backgroundColor: inputBg, color: textPrimary }}
        />
      </div>
      {!bosMu && !gecerli && (
        <span className="text-xs" style={{ color: '#F59E0B' }}>Numara 10 haneli olmalı — {rakamlar.length}/10</span>
      )}
      {hint && bosMu && <span className="text-xs" style={{ color: textSecondary }}>{hint}</span>}
    </div>
  )
}