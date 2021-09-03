/*
 * [index.js]
 * Start express listener
 */

'use strict'

const express = require('express')
require('./model')

const app = express()


app.use(express.json())
app.disable('x-powered-by') // hide express identity
let api = express.Router() // router
app.use('/api', api) // register with middleware


const user = require('./controllers/user.js')
api.use('/user', user)

const condition = require('./controllers/condition.js')
api.use('/condition', condition)

const window = require('./controllers/window.js')
api.use('/window', window)

app.listen(3001, () => {
    console.log('# API server started!')
})