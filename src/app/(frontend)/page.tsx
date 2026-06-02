import React from 'react'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const payloadConfig = await config

  return (
    <div>
      <h1>CMS</h1>
      <p>Bem-vindo ao sistema de gerenciamento de conteúdo.</p>
      <div>
        <a href={payloadConfig.routes?.admin || '/admin'}>Ir para o painel admin</a>
      </div>
    </div>
  )
}

export default Page
