import axios from 'axios'
import { useMemo, useEffect } from 'react'
import useAuth from './useAuth'

const apiUrl = import.meta.env.VITE_API_BASE_URL

const useAxiosPrivate = () => {

    const axiosAuth = useMemo(() => {
        return axios.create({
            baseURL: apiUrl,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
    }, [])

    const { auth, setAuth } = useAuth()

    let isRefreshing = false
    let failedQueue = []

    // Hilfsfunktion zur Verarbeitung der geparkten Requests nach dem Token-Refresh
    const processQueue = (error, response = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error)
            } else {
                prom.resolve(response)
            }
        })
        failedQueue = []
    }


    useEffect(() => {
        axiosAuth.interceptors.response.use(
            response => response,
            async error => {
                console.log('⚠ Interceptor caught error:', error)
                const originalRequest = error.config;

                if (originalRequest.url.includes('/refresh') && error.response.status === 401) {
                    // Sonderfall: Refresh-Token ist ungültig oder abgelaufen
                    console.error('❌ Refresh token has expired or is invalid.')
                    return Promise.reject(error); // direkt fehlschlagen, kein erneuter Versuch
                }

                if (error.response && error.response.status === 401 && !originalRequest._retry) {

                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject })
                        })
                            .then(() => axiosAuth(originalRequest))
                            .catch(err => Promise.reject(err))
                    }

                    originalRequest._retry = true
                    isRefreshing = true;

                    return new Promise((resolve, reject) => {
                        axiosAuth
                            .post('/refresh')
                            .then(() => {
                                processQueue(null)
                                axiosAuth(originalRequest)
                                    .then(resolve)
                                    .catch(reject)

                            })
                            .catch(refreshError => {
                                processQueue(refreshError, null)
                                localStorage.removeItem('user')
                                setAuth(null) // Auth-Status zurücksetzen
                                reject(refreshError) // ursprüngliche Promise-Kette abbrechen
                            })
                            .finally(() => {
                                isRefreshing = false
                            })
                    })
                }
                return Promise.reject(error)
            }
        )

    }, [auth])

    return axiosAuth
}

export default useAxiosPrivate