import express from "express";
import dotenv from 'dotenv';
import server from './graphql'
import sequelize from './middlewares/dbInstance'
import AppMiddleware from './middlewares/appMiddleware';
import Web from './routes/web'

import { parseJson } from "./middlewares/parseJson";
dotenv.config()

global.parseJson = parseJson
const app = new express();
app.use(AppMiddleware);
app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "frame-src https://codesandbox.io/ https://cdn.flipsnack.com/");
  return next();
});
app.use('/', express.static('public/main'))
app.use('/upload', express.static('public/upload'))
app.use('/techscratch', express.static('public/techscratch'))

app.use('*', Web);

sequelize.authenticate()
  .then(() => {
    console.log('database connected')
  })
  .catch(err => console.log(err))

server.applyMiddleware({
  app,
  path: '/api'
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`server is running on port : ${PORT}, ${server.graphqlPath}`);
});
