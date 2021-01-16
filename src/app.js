const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { createSecretKey } = require('crypto')

const app = express()
const port = process.env.PORT || 3000

const address = process.argv[2]

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Ferdinand Farmer'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ferdinand Farmer'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help & FAQs',
        helpmessage: 'This is the help page for the weather application',
        name: 'Ferdinand Farmer'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send ({
            error: 'Address must be provided!' 
        })
    } else {
        geocode (req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error })
            }
        
            forecast (latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                }
            
                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                })  
            })
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ferdinand Farmer',        
        errorMessage: 'Help artical not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ferdinand Farmer',          
        errorMessage: 'Page not found!'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})