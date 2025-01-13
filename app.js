import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import cors from 'cors';
//import peliculas from './movies.json' with {type: 'json'};
//otra forma
//import fs from 'node:fs';
//const peliculas= JSON.parse(fs.readFileSync('./movies.json','utf-8'))
const app= express()
app.use(json())
app.use(cors())

app.use('/movies',moviesRouter);


const PORT= process.env.PORT ?? 3000;
app.listen(PORT,()=>{
    console.log(`Server escuchando en http://localhost:${PORT}`)
})

