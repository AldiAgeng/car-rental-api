import app from './server'

const PORT = process.env.PORT ?? 8000

app.listen(process.env.PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})
