const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('jsonPost', function getPost(req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :jsonPost'
  )
)

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '3208031758',
    id: 4,
  },
  {
    name: 'Potato Lexa',
    number: '3200803215468',
    id: 5,
  },
  {
    name: 'Hello SPanck',
    number: '1806065487',
    id: 6,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// GET PERSONS
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// GET PERSONS ID
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({
      error: 'person with id:' + id + ' not found',
    })
  }
})

// POST
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  } else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

// DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// INFO
app.get('/info', (request, response) => {
  const totalEntries = persons.length
  const date = new Date()
  response.send(`<p>Phonebook has info for ${totalEntries} people</p>
    <p>${date} </p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
