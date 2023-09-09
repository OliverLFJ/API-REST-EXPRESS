const express = require('express')
const movies = require('./utils/movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT ?? 1234
app.use(express.json())
app.disable('x-powered-by')
app.use(cors({
    origin: (origin, callback) => {
        const ALLOW_METHODS = [
            'http://localhost/8080',
            'http://127.0.0.1:5500',
            'http://127.0.0.1:5500/'
        ]
        if (ALLOW_METHODS.includes(origin) || !origin) {
            return callback(null, true)
        }
        return callback(new Error('Not Alowed By CORS'))
    }
}))


app.get('/movies', (req, res) => {
    // const origin = req.header('origin')
    //if (ALLOW_METHODS.includes(origin) || !origin) {
    //    res.header('Access-Control-Allow-Origin', origin)
    // }
    const { genre } = req.query
    if (genre) {
        const movieFiltered = movies.filter(
            movie => movie.genre.some(genre => genre.toLowerCase() === genre.toLowerCase())
        )
        return res.json(movieFiltered)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieFind = movies.find(movie => movie.id === id)
    if (movieFind) {
        res.json(movieFind)
    } else {
        res.status(404).json({ message: 'Movie not found' })
    }
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {

    const result = validatePartialMovie(req.body)
    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex < 0) {
        return res.status(404).json({ message: 'Movie not found' })
    }
    const movieUpdated = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = movieUpdated
    return res.json(movieUpdated)
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    //   const origin = req.header('origin')
    // if (ALLOW_METHODS.includes(origin) || !origin) {
    //  res.header('Access-Control-Allow-Origin', origin)
    ///  }
    if (movieIndex < 0) {
        return res.status(404).json({ message: 'Movie not found' })
    }
    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie Deleted' })
})

//app.options('/movies/:id', (req, res) => {
// const origin = req.header('origin')
// if (ALLOW_METHODS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE') // Cambio aquí
// }
//  return res.status(200).send();
//})

app.listen(PORT, () => {
    console.log(`Puerto en ${PORT}`)
})

