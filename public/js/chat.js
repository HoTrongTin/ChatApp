const socket = io()

// Username + password
const query = location.search.substring(1)
const username = Qs.parse(query).username
const room = Qs.parse(query).room

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const $location = document.querySelector('#location')
const locationTemplate = document.querySelector('#location-template').innerHTML
const roomInfoTemplate = document.querySelector('#room-info-template').innerHTML
const $roomInfo = document.querySelector('#room-info')

//Get server messages: message
socket.on('message', (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    $messages.scrollTop = $messages.scrollHeight
})

//Get server messages: location
socket.on('locationMessage', (url) => {
    // console.log(message)
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    $messages.scrollTop = $messages.scrollHeight
})

//Send message event
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

//Send location event
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

//Join room from login page
window.addEventListener('load', () => {
    socket.emit('join', {
        username,
        room
    }, (error) => {
        if (error) {
            alert(error)
            location.href('/')
        }
    })
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(roomInfoTemplate, {
        room,
        users
    })
    console.log(users)
    $roomInfo.innerHTML = html
})