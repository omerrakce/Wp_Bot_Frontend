export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="42" height="42" rx="10" fill="#1A1F2E"/>
              <line x1="11" y1="11" x2="11" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <line x1="11" y1="21" x2="31" y2="21" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <line x1="31" y1="11" x2="31" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="31" cy="31" r="5" fill="#00B4B4"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '18px', fontWeight: 300, color: '#1A1F2E', letterSpacing: '2px', lineHeight: 1 }}>
                HUMER<span style={{ fontWeight: 800 }}>SOFT</span>
              </div>
              <div style={{ width: '100%', height: '1px', background: '#E5E7EB', margin: '4px 0' }}></div>
              <div style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '3px' }}>TECHNOLOGY</div>
            </div>
          </div>
          <p className="text-sm mt-4 text-gray-400">Firma Paneline Hoş Geldiniz</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  )
}