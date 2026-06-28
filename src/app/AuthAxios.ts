import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const lang = localStorage.getItem('lang') || 'en'

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      config.params = { ...config.params, lang }
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle logout / refresh flow here
    }
    return Promise.reject(error)
  }
)

export default axiosInstance