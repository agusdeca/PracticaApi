import { Router } from "express";
import { randomUUID } from 'node:crypto';
import { writeFile } from 'fs';
import { join } from 'path';
import { validateSchema, validatePartialMovie } from '../Schemas/movieSchema.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const peliculas = require('../movies.json');
const router = Router();
export const moviesRouter = router;



router.get('/',(req,res)=>{
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


router.get('/:id',(req,res)=>{
    const {id}= req.params
        const movie= peliculas.find(movie=> movie.id==id)
        console.log(movie)
        if(movie) return res.json(movie)

        res.status(404).json({message: 'Pelicula no encontrada'})
})

router.post('/',(req,res)=>{
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
        id:randomUUID(),...result.data
    }
    peliculas.push(newMovie)

    writeFile(join(process.cwd(), 'movies.json'), JSON.stringify(peliculas, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar la película:', err);
            return res.status(500).json({ message: 'Error al guardar la película' });
        }
        res.status(201).json(newMovie);
    });
})

router.patch('/:id',(req,res)=>{
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

    writeFile(join(process.cwd(), 'movies.json'), JSON.stringify(peliculas, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar los cambios:', err);
            return res.status(500).json({ message: 'Error al guardar los cambios' });
        }
        res.json(peliculaActualizada);
    });
})

router.delete('/:id',(req,res)=>{
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

    writeFile(join(process.cwd(), 'movies.json'), JSON.stringify(filteredMovies, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar los cambios:', err);
            return res.status(500).json({ message: "No se pudo escribir el archivo JSON" });
        }
        console.log(`Película con ID ${id} eliminada exitosamente.`);
        res.json({ message: `Película con ID ${id} eliminada exitosamente.` });
    });
    
})

