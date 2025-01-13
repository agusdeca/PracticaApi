import z from 'zod'

const movieSchema= z.object({
    title: z.string({invalid_type_error:"titulo es un string",required_error:"titulo es necesario"}),
    year: z.number().int().min(1900).max(2025),
    director: z.string(),
    duration: z.number().positive().int(),
    poster: z.string().url({ message: "poster will be a valid url"}),
    genre: z.enum(["Animation","Adventure","Drama","Sci-Fi","Romance","Fantasy","Action"]).array(),
    rate: z.number().min(0).max(10)
})

export function validateSchema(object){
    return movieSchema.safeParse(object)  
}

export function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)//hace todas las variables opcionales
}
