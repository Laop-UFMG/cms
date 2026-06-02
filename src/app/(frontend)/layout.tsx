import React from 'react'
import './styles.css'

export const metadata = {
  description: 'CMS — Sistema de gerenciamento de conteúdo',
  title: 'CMS',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="pt-BR">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
