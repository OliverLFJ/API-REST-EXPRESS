const zod = require('zod')
const movieSchema = zod.object({
    title: zod.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie Title is required'
    }),
    year: zod.number().int().min(1990).max(2023),
    director: zod.string(),
    duration: zod.number().positive().int(),
    rate: zod.number().min(0).max(10).default(5),
    poster: zod.string().url(),
    genre: zod.array(zod.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']))
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}