import type { CollectionConfig } from 'payload'
import { notifyReviewers } from '../hooks/notifyReviewers'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Postagem',
    plural: 'Postagens',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Blog',
    defaultColumns: ['title', 'author', '_status', 'createdAt'],
  },
  versions: {
    drafts: true, // Habilita o campo _status (draft/published)
  },
  access: {
    // Qualquer usuário autenticado pode criar posts
    create: ({ req: { user } }) => {
      return Boolean(user)
    },
    // Posts publicados são públicos; drafts só para usuários logados
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    // Autor só edita seus próprios posts
    // Revisor e Admin podem editar qualquer post
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin') || user.roles?.includes('revisor')) {
        return true
      }
      // Autor só pode editar seus próprios posts
      return { author: { equals: user.id } }
    },
    // Somente Admin pode deletar posts
    delete: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin'))
    },
  },
  hooks: {
    afterChange: [notifyReviewers('postagem')],
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
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumo',
      maxLength: 300,
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Imagem de Capa',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Conteúdo',
      required: true,
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
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de Publicação',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
