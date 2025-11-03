import { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode' // Correct import of jwt-decode

export const AuthContext = createContext({
  token: null,
  userId: null,
  setToken: () => {},
  setUserId: () => {},
})

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  // Decode token and set userId whenever token changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserId(decoded.sub || null)
      } catch (error) {
        setUserId(null)
      }
    } else {
      setUserId(null)
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export function useAuth() {
  return useContext(AuthContext)
}
