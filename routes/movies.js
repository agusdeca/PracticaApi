import { Router } from "express";
import { MovieModel } from "../models/movie.js";
import { MovieController } from "../controllers/movie.js";
const router = Router();
export const moviesRouter = router;



router.get('/', MovieController.getAll)

router.get('/:id',MovieController.getById)

router.post('/',MovieController.create)

router.patch('/:id',MovieController.update)

router.delete('/:id',MovieController.delete)

