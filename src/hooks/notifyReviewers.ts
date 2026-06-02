import type { CollectionAfterChangeHook } from 'payload'

export const notifyReviewers = (contentType: 'postagem' | 'entrada'): CollectionAfterChangeHook => {
  return async ({ req, doc, operation }) => {
    if (operation === 'create') {
      try {
        // 1. Busca todos os usuários com papel 'revisor'
        const revisores = await req.payload.find({
          collection: 'users',
          where: {
            roles: {
              contains: 'revisor',
            },
          },
          depth: 0,
        })

        if (revisores.docs.length > 0) {
          const typeLabel = contentType === 'postagem' ? 'postagem' : 'entrada do glossário'
          const collectionSlug = contentType === 'postagem' ? 'posts' : 'glossary-entries'
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
          const editUrl = `${serverUrl}/admin/collections/${collectionSlug}/${doc.id}`

          // 2. Dispara e-mails individuais em paralelo para cada revisor com seu respectivo nome
          const emailPromises = revisores.docs.map((revisor: any) => {
            if (!revisor.email) return Promise.resolve()

            const nameLabel = revisor.name || 'Revisor'

            return req.payload.sendEmail({
              to: revisor.email,
              subject: `[CMS] Nova ${contentType === 'postagem' ? 'Postagem' : 'Entrada do glossário'} para Revisão: ${doc.title}`,
              html: `
                <div style="font-family: sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <h2 style="color: #111827; margin-top: 0;">Nova Solicitação de Revisão</h2>
                  <p>Olá <strong>${nameLabel}</strong>,</p>
                  <p>Uma nova <strong>${typeLabel}</strong> intitulada <strong>"${doc.title}"</strong> foi criada e necessita de sua avaliação técnica.</p>
                  
                  <div style="margin: 28px 0;">
                    <a href="${editUrl}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">
                      Avaliar e Publicar no CMS →
                    </a>
                  </div>
                  
                  <p style="font-size: 12px; color: #6b7280; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
                    Caso o botão acima não funcione, copie e cole o seguinte link no seu navegador:<br>
                    <a href="${editUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${editUrl}</a>
                  </p>
                </div>
              `,
            })
          })

          await Promise.all(emailPromises)
        }
      } catch (err) {
        req.payload.logger.error(err as Error, `Erro ao enviar e-mail de notificação para revisores (${contentType})`)
      }
    }
  }
}
