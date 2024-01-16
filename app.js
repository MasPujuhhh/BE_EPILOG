import 'dotenv/config'
import express from 'express';
import routes from './routes/router.js';
import cors from 'cors'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from './config/connection.js';
import { QueryTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const port = 9001

app.use('/assets/pdf', express.static(join(__dirname, 'assets/pdf')));
app.use(express.json());
app.use(cors())
// app.use(express.urlencoded());

app.use('/', routes);

app.use((req,res)=>{
  res.status(500).json({code:490, message:"endpoint tidak ada"})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})