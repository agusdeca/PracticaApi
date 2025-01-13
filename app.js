const express=require('express')
const crypto=require('node:crypto')
const fs = require('fs');
const path = require('path');
const peliculas= require('./movies.json')
const cors=require('cors')
const {validateSchema,validatePartialMovie}=require('./Schemas/movieSchema')

const app= express()
app.use(express.json())
app.use(cors())

const PORT= process.env.PORT ?? 3000;


app.get('/',(req,res)=>{
    res.json({message:"sv funcionando"})
})

app.get('/movies',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    const {genre}= req.query
    if(genre){
        const movies=peliculas.filter(pelicula=> pelicula.genre.includes(genre))
        if(movies){
            res.json(movies)
        }else{
            res.status(404).json({message: 'Genero no encontrado'})
        }
    }
    res.json(peliculas)

    res.status(404).json({message: 'Genero no encontrado'})
})

app.get('/movies/:id',(req,res)=>{
        const {id}= req.params
        const movie= peliculas.find(movie=> movie.id==id)
        console.log(movie)
        if(movie) return res.json(movie)

        res.status(404).json({message: 'Pelicula no encontrada'})
})

app.delete('/movies/:id',(req,res)=>{
    const {id}=req.params
    const movieIndex = peliculas.findIndex(movie => movie.id == id);
    if (movieIndex === -1) {
        return res.status(404).json({ message: "Película no encontrada" });
    } 


    const filteredMovies = peliculas.filter(movie => movie.id !== id);

    if (filteredMovies.length === peliculas.length) {
        console.log('ID no encontrado');
        res.status(404).json({message:"id no encontrado"})
    }

    fs.writeFile('./movies.json', JSON.stringify(filteredMovies, null, 2), (err) => {
        if (err) {
            res.status(404).json({message:"no se pudo escribir el json"})
        }
        console.log(`Película con ID ${id} eliminada exitosamente.`);
    });
})

app.post('/movies',(req,res)=>{
    const result= validateSchema(req.body)

    if (result.error) {
        return res.status(400).json({
            error: result.error.errors.map(err => ({
                path: err.path,
                message: err.message,
                received: err.received,
                expected: err.options,
            })),
        });
    }
    

    const newMovie={
        id:crypto.randomUUID(),...result.data
    }
    peliculas.push(newMovie)

    fs.writeFile('./movies.json', JSON.stringify(peliculas, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar la película:', err);
            return res.status(500).json({ message: 'Error al guardar la película' });
        }
        res.status(201).json(newMovie);
    });
})


app.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);
    if (!result.success) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    const movieIndex = peliculas.findIndex(movie => movie.id == id);
    if (movieIndex === -1) {
        return res.status(404).json({ message: "Película no encontrada" });
    }

    const peliculaActualizada = {
        ...peliculas[movieIndex],
        ...result.data,
    };

    peliculas[movieIndex] = peliculaActualizada;

    fs.writeFile(
        path.join(__dirname, 'movies.json'),
        JSON.stringify(peliculas, null, 2), // Formatear con 2 espacios para que sea legible
        (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Error al guardar los cambios' });
            }
            res.json(peliculaActualizada);
        }
    );
});


app.listen(PORT,()=>{
    console.log(`Server escuchando en http://localhost:${PORT}`)
})

