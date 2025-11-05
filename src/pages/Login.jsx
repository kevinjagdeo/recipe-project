import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'

import { useAuth } from '../contexts/AuthContext.jsx'
import { LOGIN_USER } from '../api/graphql/users.js'

export function Login() {
  const { setToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data?.loginUser) {
        setToken(data.loginUser)
        navigate('/')
      } else {
        alert('Login failed: no token received')
      }
    },
    onError: (error) => {
      alert('Login error: ' + error.message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) return
    loginUser({ variables: { username, password } })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Link to='/'>Back to main page</Link>
      <hr />
      <label htmlFor='username'>Username:</label>
      <input
        id='username'
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <label htmlFor='password'>Password:</label>
      <input
        id='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type='submit' disabled={loading || !username || !password}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </form>
  )
}
