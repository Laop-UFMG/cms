import type { CollectionConfig, Where } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin'))
    },

    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      if (user) {
        return {
          or: [
            { id: { equals: user.id } },
            { roles: { contains: 'autor' } },
            { roles: { contains: 'revisor' } }
          ]
        } as Where
      }
      return {
        or: [
          { roles: { contains: 'autor' } },
          { roles: { contains: 'revisor' } }
        ]
      } as Where
    },
    
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    
    delete: ({ req: { user } }) => {
      return Boolean(user?.roles?.includes('admin'))
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      label: 'Permissões',
      hasMany: true,
      saveToJWT: true,
      required: true,
      defaultValue: ['autor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Revisor', value: 'revisor' },
        { label: 'Autor', value: 'autor' },
      ],
      access: {

        update: ({ req: { user } }) => {
          return Boolean(user?.roles?.includes('admin'))
        },
      },
    },
  ],
}
