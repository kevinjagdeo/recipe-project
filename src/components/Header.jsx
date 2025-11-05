import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'
import { useQuery } from '@tanstack/react-query'
import { getUserInfo } from '../api/users.js'

// Basic JWT payload decoder base64 -> JSON parsing
function decodeJwtPayload(token) {
  try {
    const base64Payload = token.split('.')[1]
    const jsonPayload = atob(base64Payload)
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.warn('Failed to decode JWT payload:', e)
    return null
  }
}

export function Header() {
  const { token, setToken } = useAuth()

  let sub = null
  if (token) {
    const payload = decodeJwtPayload(token)
    sub = payload?.sub
  }

  const userInfoQuery = useQuery({
    queryKey: ['users', sub],
    queryFn: () => getUserInfo(sub),
    enabled: Boolean(sub),
  })

  const userInfo = userInfoQuery.data

  if (token && userInfo) {
    return (
      <div>
        <h1>Welcome to my Recipes Website!</h1>
        Logged in as <User {...userInfo} />
        <br />
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }
  return (
    <div>
      <h1>Welcome to my Recipes Website!</h1>
      <div>
        <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  )
}
