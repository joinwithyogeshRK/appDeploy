const express = require('express')
const app = express()

app.use(express.json())

let todos = []
let nextId = 1

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() })
})

app.get('/todos', (req, res) => {
  res.json(todos)
})

app.post('/todos', (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  const todo = { id: nextId++, title, done: false }
  todos.push(todo)
  res.status(201).json(todo)
})

app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id))
  if (!todo) return res.status(404).json({ error: 'Not found' })
  todo.done = !todo.done
  res.json(todo)
})

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id))
  res.json({ message: 'Deleted' })
})

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Todo app running on port ${PORT}`)
})

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shut down gracefully')
    process.exit(0)
  })
})