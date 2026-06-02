import React from 'react'

export const Logo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
      <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pyramid / Delta shape */}
        <polygon points="50,15 15,80 85,80" fill="currentColor" opacity="0.1" />
        <line x1="50" y1="15" x2="15" y2="80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="50" y1="15" x2="85" y2="80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="15" y1="80" x2="85" y2="80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Inner stylized eye or horizon sun line */}
        <circle cx="50" cy="55" r="10" stroke="currentColor" strokeWidth="5" />
        <line x1="30" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="4" />
      </svg>
      <div style={{ fontSize: '26px', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--theme-elevation-800, #111827)' }}>
         <span style={{ color: '#d97706' }}>CMS</span>
      </div>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, color: 'var(--theme-elevation-600, #4b5563)', textAlign: 'center' }}>
        Gestão de conteúdo
      </div>
    </div>
  )
}

export default Logo
