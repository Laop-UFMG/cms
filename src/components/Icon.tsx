import React from 'react'

export const Icon = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#d97706' }}>
        <polygon points="50,15 15,80 85,80" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="55" r="12" stroke="currentColor" strokeWidth="10" />
      </svg>
      <span style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px', color: 'var(--theme-elevation-800, #111827)' }}>
        CMS
      </span>
    </div>
  )
}

export default Icon
