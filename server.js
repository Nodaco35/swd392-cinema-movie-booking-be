import { createApp } from './src/app.js'
import { env } from './src/config/env.js'
import { connectDatabase } from './src/config/sequelize.js'

async function start() {
  await connectDatabase()

  const app = createApp()
  app.listen(env.port, () => {
    // Keep logs minimal and beginner-friendly
    console.log(`Backend listening on port ${env.port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

