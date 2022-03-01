import { Client } from 'faunadb'

export const fauna = new Client({
  secret: process.env.FAUNA_API_KEY as string, // TODO: error in types
})
