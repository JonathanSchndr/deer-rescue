import { readFileSync, writeFileSync } from 'fs'

const DB_PATH = './server/data/db.json'

export default defineEventHandler(async (event) => {
  const method = event.method
  const db = JSON.parse(readFileSync(DB_PATH, 'utf-8'))

  // Ensure fields array exists
  if (!db.fields) {
    db.fields = []
  }

  if (method === 'GET') {
    return db.fields
  }

  if (method === 'POST') {
    const field = await readBody(event)
    db.fields.push(field)
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
    return field
  }

  if (method === 'PUT') {
    const field = await readBody(event)
    const index = db.fields.findIndex(f => f.id === field.id)
    if (index !== -1) {
      db.fields[index] = field
      writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
      return field
    }
    throw createError({
      statusCode: 404,
      message: 'Field not found'
    })
  }

  if (method === 'DELETE') {
    const { id } = await readBody(event)
    const initialLength = db.fields.length
    db.fields = db.fields.filter(f => f.id !== id)
    
    if (db.fields.length === initialLength) {
      throw createError({
        statusCode: 404,
        message: 'Field not found'
      })
    }
    
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
    return { success: true }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})