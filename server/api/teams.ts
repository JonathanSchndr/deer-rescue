import { readFileSync } from 'fs'

const DB_PATH = './server/data/db.json'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  const db = JSON.parse(readFileSync(DB_PATH, 'utf-8'))
  
  // Return only public team information
  return db.users.rescueTeams.map(team => ({
    id: team.id,
    name: team.name
  }))
})