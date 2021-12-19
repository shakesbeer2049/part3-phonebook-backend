const express = require('express');
const { reset } = require('nodemon');
const morgan = require('morgan')



const app = express()

app.use(express.json())

morgan.token('body',(req,res)=> JSON.stringify(req.body))

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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
//Get All
app.get('/api/persons',(req,res)=>{

    res.json(persons)
})

//Get info
app.get('/info',(req,res)=>{
    const date = new Date()
    res.send(`<div>
    <h4>Phonebook has info for ${persons.length} people</h4>
    <h4>${date}</h4>
    </div>`)
})

//Get one
app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    
    const person = persons.find(person => person.id ===id)
    console.log(person)
    if(!person) return res.status(404).json("Contact not found/present") 
    
    res.json(person)
    
})

//Delete one

app.delete('/api/persons/:id',(req,res)=>{

    const id = Number(req.params.id)
    
    persons = persons.filter(person => person.id !==id)
    res.status(204).end()
    
})
const randomId = () => {
    const rid = persons.length + 1  + Math.floor(Math.random() * (persons.length + 7))
    return rid
}

//POST

app.post('/api/persons',(req,res)=>{

    const body = req.body;
    
    
    if(!body) {
        return res.status(400).json({
        error: "Body cannot be empty"
    })
}   else if(!req.body.name|| !req.body.number)  return res.status(400).json({
    error: "Name or number missing"
})
    else {
       const found = persons.find(name => req.body.name === name.name)
       if(found) return res.status(400).json({
           error:"Name must be unique"
       })
    }

    const person = {
        name: body.name,
        number : body.number,
        id: randomId(),
    }

    persons = persons.concat(person)
    res.json(persons)
})

//Middleware at the end

const unknownEndPt = (req,res) => {
    res.status(404).json({error : 'unknown endpoint'})
}
app.use(unknownEndPt)

const PORT = 3001

app.listen(PORT,()=> console.log(`Server running on Port ${PORT}`)
)