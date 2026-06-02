import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { pt } from '@payloadcms/translations/languages/pt'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { GlossaryCategories } from './collections/GlossaryCategories'
import { GlossaryEntries } from './collections/GlossaryEntries'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3001'],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || 'noreply@cms.edu.br',
    defaultFromName: process.env.SMTP_FROM_NAME || 'CMS',

    ...(process.env.SMTP_HOST && {
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
  }),
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/Logo',
        Icon: '/components/Icon',
      },
    },
    meta: {
      titleSuffix: ' — CMS',
    },
  },
  collections: [Users, Posts, Media, Categories, GlossaryCategories, GlossaryEntries],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [],
})
