const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=6dfc623accbd1af7a76e329f6ba0ab7f&query=' + latitude + ',' + longitude + '&units=m'
    
    request({ url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '. The current temperature is ' + (body.current.temperature) + ' degress out. It feels like ' + (body.current.feelslike) + ' degress out. The current humidity is ' + (body.current.humidity) + ' With a wind speed of ' + (body.current.wind_speed) + ' kilometers/hour')
        }        
    })
}

module.exports = forecast