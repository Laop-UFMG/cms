import type { CollectionConfig } from 'payload'

export const GlossaryCategories: CollectionConfig = {
  slug: 'glossary-categories',
  labels: {
    singular: 'Categoria do Glossário',
    plural: 'Categorias',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Glossário',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
      unique: true,
    },
  ],
}
