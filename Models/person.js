const mongoose = require('mongoose') //define mongoose
const validator = require('mongoose-unique-validator')

const url = process.env.MONGO_URI //define url
console.log(`connecting to ${url}`)


// connect to url => then and catch
mongoose.connect(url)
  .then(res => console.log('connected to mongodb')
  ).catch(err => console.log('error connected',err.message)
  )




// define schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8
  },
  date: Date,

})

//edit the returned obect
personSchema.set('toJSON',{
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})
//plugin
mongoose.plugin(validator)

//export model/schema
module.exports = mongoose.model('Person', personSchema)