import type { CollectionConfig } from 'payload'
import { notifyReviewers } from '../hooks/notifyReviewers'

/**
 * Normaliza uma string removendo acentos e convertendo para minúsculas.
 * Usado para gerar o campo titleNormalized para busca accent-insensitive.
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export const GlossaryEntries: CollectionConfig = {
  slug: 'glossary-entries',
  labels: {
    singular: 'Entrada do Glossário',
    plural: 'Entradas',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Glossário',
    listSearchableFields: ['titleNormalized'],
    defaultColumns: ['title', 'author', '_status', 'createdAt'],
  },
  versions: {
    drafts: true, // Habilita o campo _status (draft/published)
  },
  access: {
    // Qualquer usuário autenticado pode criar entradas
    create: ({ req: { user } }) => {
      return Boolean(user)
    },
    // Entradas publicadas são públicas; drafts só para usuários logados
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    // Autor só edita suas próprias entradas
    // Revisor e Admin podem editar qualquer entrada
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin') || user.roles?.includes('revisor')) {
        return true
      }
      // Autor só pode editar suas próprias entradas
      return { author: { equals: user.id } }
    },
    // Somente Admin pode deletar entradas
    delete: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin'))
    },
  },
  hooks: {
    afterChange: [notifyReviewers('entrada')],
    beforeChange: [
      ({ req, data, operation }) => {
        const user = req.user
        if (!user) return data

        // Atribuir autor automaticamente na criação
        if (operation === 'create') {
          data.author = user.id
        }

        // Se o usuário é APENAS Autor (sem revisor ou admin), forçar status como draft
        const isOnlyAutor =
          user.roles?.includes('autor') &&
          !user.roles?.includes('revisor') &&
          !user.roles?.includes('admin')

        if (isOnlyAutor) {
          data._status = 'draft'
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      unique: true,
    },
    {
      name: 'titleNormalized',
      type: 'text',
      label: 'Título',
      admin: {
        hidden: true,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.title) {
              return normalizeText(siblingData.title)
            }
          },
        ],
      },
    },
    {
      name: 'transcription',
      type: 'text',
      label: 'Transcrição',
    },
    {
      name: 'definition',
      type: 'textarea',
      label: 'Definição',
      required: true,
    },
    {
      name: 'observation',
      type: 'textarea',
      label: 'Observação',
    },
    {
      name: 'reference',
      type: 'text',
      label: 'Referência',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      label: 'Ano',
      required: true,
      min: 1900,
      max: 2100,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Imagem',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      label: 'Autor',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      label: 'Categorias',
      relationTo: 'glossary-categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
