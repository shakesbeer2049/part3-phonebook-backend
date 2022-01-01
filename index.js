

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./Models/person')


const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body',(req) => JSON.stringify(req.body))

app.use(morgan('tiny'))
app.use(morgan(':body'))

//Custom Middleware
// const reqLogger = (req,res,next) => {
//     console.log('Method: ', req.method)
//     console.log('Path: ', req.path)
//     console.log('Body: ', req.body)
//     console.log('---')
//     next()
// }
// app.use(reqLogger)


//Get All
app.get('/api/persons',(req,res) => {
  Person.find({}).then(people => res.json(people))

})

//Get info
app.get('/info',(req,res) => {
  Person.find({})
    .then(people => res.json(people))
})

//Get one
app.get('/api/persons/:id',(req,res,next) => {
  const id = req.params.id

  Person.findById(id)
    .then(person => res.json(person))
    .catch(err => next(err))


  // const person = persons.find(person => person.id ===id)
  // console.log(person)
  // if(!person) return res.status(404).json("Contact not found/present")



})

//Delete one

app.delete('/api/persons/:id',(req) => {
  Person.findByIdAndRemove(req.params.id, { new:true })
    .then(res => {
      res.status(204).end()
    })
    .catch(err => console.log(err.message)
    )


})
// const randomId = () => {
//   const rid = persons.length + 1  + Math.floor(Math.random() * (persons.length + 7))
//   return rid
// }

//POST

app.post('/api/persons',(req,res,next) => {

  const body = req.body

  if(!body) {
    return res.status(400).json({
      error: 'Body cannot be empty'
    })
  }
  console.log(body)


  const person = new Person({

    name: body.name,
    number : body.number,
    date: new Date()

  })
  console.log(person)
  person.save().then(saved => {
    res.json(saved)

  }).catch(err => next(err)
  )


})

//UPDATE
app.put('/api/persons/:id',(req,res,next) => {

  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new:true, runValidators:true,context:'query' })
    .then(updatedData => {
      res.json(updatedData)
    }).catch(err => next(err))

})


//Middleware at the end

//error handler
const errorhandler = (err, req, res , next) => {
  console.error(err.message)

  if(err.name === 'CastError'){
    return res.status(400).send({ err : 'malformatted id' })
  } else if(err.name === 'ValidationError'){
    return res.status(400).send({ err:err.message })
  }

  next(err) // express error handler
}

const unknownEndPt = (req,res) => {
  res.status(404).json({ error : 'unknown endpoint' })
}
app.use(unknownEndPt)
app.use(errorhandler)

const PORT = process.env.PORT
app.listen(PORT,() => console.log(`Server running on Port ${PORT}`)
)