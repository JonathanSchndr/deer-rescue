import { readFileSync } from 'fs'

const AUTH_CONFIG_PATH = './server/config/auth.json'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const authConfig = JSON.parse(readFileSync(AUTH_CONFIG_PATH, 'utf-8'))
    const body = await readBody(event)
    const { type, username, password } = body

    if (!type || !username || !password) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    if (type === 'rescuer') {
      const rescuer = authConfig.rescueTeams.find(r => r.username === username)
      if (!rescuer) {
        return { success: false }
      }
      
      const isValid = password === rescuer.password
      if (!isValid) {
        return { success: false }
      }
      
      return {
        success: true,
        user: {
          id: rescuer.id,
          name: rescuer.name,
          type: 'rescuer',
          username: rescuer.username
        }
      }
    }

    if (type === 'admin') {
      if (username === authConfig.admin.username) {
        const isValid = password === authConfig.admin.password
        if (!isValid) {
          return { success: false }
        }
        
        return {
          success: true,
          user: {
            name: 'Administrator',
            type: 'admin',
            username
          }
        }
      }
    }

    return { success: false }
  } catch (error) {
    console.error('Auth error:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})