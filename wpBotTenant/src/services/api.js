const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://34.159.214.131:8000'
const TOKEN_KEY = 'wpbot_token'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export const tokenAl = () => localStorage.getItem(TOKEN_KEY)
export const tokenKaydet = (t) => localStorage.setItem(TOKEN_KEY, t)
export const tokenSil = () => localStorage.removeItem(TOKEN_KEY)

const hataMesaji = async (res) => {
  try {
    const veri = await res.json()
    if (Array.isArray(veri.detail)) {
      return veri.detail
        .map((d) => `${d.loc?.slice(1).join('.') || 'alan'}: ${d.msg}`)
        .join(', ')
    }
    if (typeof veri.detail === 'string') return veri.detail
    return 'Beklenmeyen bir hata oluştu'
  } catch {
    return `Sunucu hatası (${res.status})`
  }
}

const istek = async (yol, secenekler = {}) => {
  const { body, headers = {}, yetkisiz = false, ...kalan } = secenekler
  const config = { ...kalan, headers: { ...headers } }

  if (body instanceof FormData) {
    config.body = body
  } else if (body instanceof URLSearchParams) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.body = body.toString()
  } else if (body !== undefined) {
    config.headers['Content-Type'] = 'application/json'
    config.body = JSON.stringify(body)
  }

  if (!yetkisiz) {
    const token = tokenAl()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${yol}`, config)
  } catch {
    throw new ApiError('Sunucuya ulaşılamıyor. Bağlantınızı kontrol edin.', 0)
  }

  // Oturum düştü — token'ı temizle, login'e yönlendir
  if (res.status === 401 && !yetkisiz) {
    tokenSil()
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
    throw new ApiError('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.', 401)
  }

  if (!res.ok) throw new ApiError(await hataMesaji(res), res.status)
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (yol, o) => istek(yol, o),
  post: (yol, body, o) => istek(yol, { method: 'POST', body, ...o }),
  put: (yol, body, o) => istek(yol, { method: 'PUT', body, ...o }),
  patch: (yol, body, o) => istek(yol, { method: 'PATCH', body, ...o }),
  delete: (yol, o) => istek(yol, { method: 'DELETE', ...o }),
}

export { ApiError, BASE_URL }