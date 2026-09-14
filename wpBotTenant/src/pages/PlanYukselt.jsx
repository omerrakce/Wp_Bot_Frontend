import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Check, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import useThemeStore from '../store/themeStore'

const planlar = [
  {
    id: 'starter',
    isim: 'Starter',
    fiyat: '990',
    aciklama: 'Küçük işletmeler için ideal başlangıç paketi',
    ozellikler: [
      '500 aylık AI eşleştirme',
      '100 ürün katalogu',
      '1 WhatsApp hattı',
      'Görsel arama',
      'Günlük kapsül',
      'E-posta destek',
    ],
    populer: false,
  },
  {
    id: 'pro',
    isim: 'Pro',
    fiyat: '2.490',
    aciklama: 'Büyüyen markalar için güçlü AI motoru',
    ozellikler: [
      '50.000 aylık AI eşleştirme',
      '1.000 ürün katalogu',
      '1 WhatsApp hattı',
      'Görsel arama',
      'Günlük kapsül',
      'Öncelikli destek',
      'Detaylı analitik',
      'Sıcak talep raporları',
    ],
    populer: true,
  },
  {
    id: 'enterprise',
    isim: 'Enterprise',
    fiyat: '5.990',
    aciklama: 'Büyük markalar için sınırsız güç',
    ozellikler: [
      'Sınırsız AI eşleştirme',
      'Sınırsız ürün katalogu',
      '3 WhatsApp hattı',
      'Görsel arama',
      'Günlük kapsül',
      '7/24 öncelikli destek',
      'Gelişmiş analitik',
      'Özel entegrasyon',
      'Dedicated account manager',
    ],
    populer: false,
  },
]

export default function PlanYukselt() {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [loading, setLoading] = useState(null)
  const mevcutPlan = user?.plan?.toLowerCase()

  const textPrimary = isDark ? '#F9FAFB' : '#111827'
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280'
  const cardBg = isDark ? '#1F2937' : 'white'
  const cardBorder = isDark ? '#374151' : '#E5E7EB'

  const handleSecim = (planId) => {
    if (planId === mevcutPlan) return
    setLoading(planId)
    setTimeout(() => {
      setLoading(null)
      toast.success(`${planId.charAt(0).toUpperCase() + planId.slice(1)} planına geçiş talebiniz alındı!`)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold" style={{ color: textPrimary }}>Plan Seçimi</h1>
        <p className="text-sm mt-1" style={{ color: textSecondary }}>İşletmenize uygun planı seçin</p>
      </div>

      {/* Mevcut Plan */}
      <div className="flex items-center gap-3 p-4 rounded-xl border w-fit"
        style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
        <Zap className="w-5 h-5" style={{ color: '#25D366' }} />
        <div>
          <p className="text-sm" style={{ color: textSecondary }}>Mevcut planınız</p>
          <p className="text-sm font-semibold" style={{ color: textPrimary }}>{user?.plan} Plan</p>
        </div>
      </div>

      {/* Plan Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planlar.map((plan) => {
          const mevcutMu = plan.isim.toLowerCase() === mevcutPlan
          return (
            <div
              key={plan.id}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: cardBg,
                border: `${plan.populer ? '2px' : '1px'} solid ${plan.populer ? '#25D366' : cardBorder}`,
              }}
            >
              {plan.populer && (
                <div className="text-center py-1.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: '#25D366' }}>
                  ⭐ En Popüler
                </div>
              )}

              <div className="p-6 flex flex-col flex-1 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={mevcutMu
                        ? { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: textSecondary }
                        : plan.populer
                          ? { backgroundColor: '#25D366', color: 'white' }
                          : { backgroundColor: isDark ? '#374151' : '#090C14', color: 'white' }
                      }>
                      {plan.isim}
                    </span>
                    {mevcutMu && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: isDark ? 'rgba(37,211,102,0.15)' : '#E0F7F7', color: '#25D366' }}>
                        Mevcut Plan
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold mt-4" style={{ color: textPrimary }}>
                    {plan.fiyat} ₺
                    <span className="text-sm font-normal" style={{ color: textSecondary }}> / ay</span>
                  </p>
                  <p className="text-sm mt-1" style={{ color: textSecondary }}>{plan.aciklama}</p>
                </div>

                <div className="flex flex-col gap-2.5 flex-1">
                  {plan.ozellikler.map((ozellik) => (
                    <div key={ozellik} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#25D366' }} />
                      <span className="text-sm" style={{ color: textSecondary }}>{ozellik}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSecim(plan.id)}
                  disabled={mevcutMu || loading === plan.id}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  style={mevcutMu
                    ? { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: textSecondary }
                    : plan.populer
                      ? { backgroundColor: '#25D366', color: 'white' }
                      : { backgroundColor: '#090C14', color: 'white' }
                  }
                >
                  {loading === plan.id ? 'İşleniyor...' :
                    mevcutMu ? 'Mevcut Planınız' :
                    plan.id === 'starter' ? 'Düşür' : 'Yükselt'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bilgi Notu */}
      <Card>
        <h2 className="font-semibold mb-3" style={{ color: textPrimary }}>Plan Değişikliği Hakkında</h2>
        <div className="flex flex-col gap-2">
          {[
            'Plan yükseltme talepleri 1 iş günü içinde işleme alınır.',
            'Yükseltme sonrası fark tutarı bir sonraki fatura döneminde yansıtılır.',
            'Plan düşürme bir sonraki fatura döneminde geçerli olur.',
            'Tüm planlarda 14 gün ücretsiz deneme hakkınız bulunmaktadır.',
          ].map((not) => (
            <div key={not} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: isDark ? '#374151' : '#D1D5DB' }} />
              <p className="text-sm" style={{ color: textSecondary }}>{not}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}