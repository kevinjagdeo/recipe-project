import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

export function NotificationPopup({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade-out animation
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification, onClose])

  if (!notification || !isVisible) return null

  const handleClick = () => {
    if (notification.postId) {
      navigate(`/posts/${notification.postId}`)
      setIsVisible(false)
      setTimeout(onClose, 300)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        maxWidth: '400px',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)'
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
          🍳 New Recipe Posted!
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation() // Prevent navigation when clicking close button
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
            padding: 0,
            marginLeft: '10px',
          }}
        >
          ×
        </button>
      </div>
      <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
        <strong>{notification.author}</strong> just posted a new recipe:
      </p>
      <p
        style={{
          margin: '4px 0',
          color: '#333',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        &ldquo;{notification.title}&rdquo;
      </p>
    </div>
  )
}

NotificationPopup.propTypes = {
  notification: PropTypes.shape({
    postId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
}
