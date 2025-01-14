import { randomUUID } from 'node:crypto';
import { writeFile } from 'fs';
import { join } from 'path';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const peliculas = require('../movies.json');

export class MovieModel{
    static async getAll ({genre}){
        if(genre){return peliculas.filter(
            movie=> movie.genre.some(g=> g.toLowerCase()===genre.toLowerCase())
        )}
        return peliculas
    }

    static async getById({id}){
        const pelicula= peliculas.find(movie=> movie.id==id)
        return pelicula
    }

    static async create({input}){
        const newMovie={
            id:randomUUID(),...input.data
        }
        peliculas.push(newMovie)
    
        writeFile(join(process.cwd(), 'movies.json'), JSON.stringify(peliculas, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar la película:', err);
                return res.status(500).json({ message: 'Error al guardar la película' });
            }
            
        });
        return newMovie;
    }

    static async update({id,result}){
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
        });
        return peliculaActualizada;
    }

    static async delete({id}){
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
        });
        return {message:"pelicula eliminada"}
    }
}

