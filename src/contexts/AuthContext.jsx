import { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

// Utility to decode JWT payload
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]
    const jsonPayload = atob(base64Payload)
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  user: null,
})

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      const userInfo = parseJwt(token)
      setUser(userInfo)
    } else {
      setUser(null)
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
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
