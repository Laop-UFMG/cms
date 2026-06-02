import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoria',
    plural: 'Categorias',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Blog',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return Boolean(
        user?.roles?.includes('admin') || user?.roles?.includes('revisor'),
      )
    },
    update: ({ req: { user } }) => {
      return Boolean(
        user?.roles?.includes('admin') || user?.roles?.includes('revisor'),
      )
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
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
    },
  ],
}
