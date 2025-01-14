import { validateSchema, validatePartialMovie } from '../Schemas/movieSchema.js';
import { MovieModel } from '../models/movie.js';
export class MovieController{
    static async getAll(req,res){
        const {genre}= req.query
            const movies= await MovieModel.getAll({genre})
            res.json(movies)
    }

    static async getById(req,res){
        const {id}= req.params
        const movie= await MovieModel.getById({id})
        if(movie) return res.json(movie);
        res.status(404).json({message:"Película no encontrada"})      
    }

    static async create(req,res){
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
            
            const newMovie= await MovieModel.create({input:result})
            res.status(201).json(newMovie)
    }

    static async update(req,res){
        const { id } = req.params;
        const result = validatePartialMovie(req.body);
        if (!result.success) {
             return res.status(400).json({ error: "Datos inválidos" });
        }

        const peliculaActualizada= await MovieModel.update({id,result})
        res.status(200).json(peliculaActualizada)
    }

    static async delete(req,res){
        const {id}=req.params
        const result = await MovieModel.delete({id})
        res.json(result)
    }
}