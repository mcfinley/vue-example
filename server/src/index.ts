import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import swaggerDoc from '../swagger.json'

import clients from './routes/clients'
import providers from './routes/providers'

const app = express()

app.use(bodyParser.json())

/* Disable CORS */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  next()
})

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.use('/clients', clients)
app.use('/providers', providers)

/**
 * Simple error middleware
 */
app.use((err, req, res, next) => {
  if (!!err.code && err.code > 0 && err.code < 600) {
    res.status(err.code).send(err.toString())
  } else {
    res.status(500).send(err.toString())
  }
})

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server is listening at', process.env.SERVER_PORT)
})
