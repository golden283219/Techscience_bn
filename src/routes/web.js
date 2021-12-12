import express from 'express';
import { join } from "path";

const Web = express.Router();

Web.get('/*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api'))
    return next()

  if (req.originalUrl.startsWith('/techscratch'))
    return res.sendFile(join(__dirname, '../../public/tech'))

  return res.sendFile(join(__dirname, '../../public/main/index.html'))
})

export default Web;