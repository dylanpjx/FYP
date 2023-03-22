const express = require('express')
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
require('events').defaultMaxListeners = 15

// Client (e.g., Remote Lab) shall connect to ws://backend_url:8080
wss.on('connection', (ws) => {
    console.log(`Web Backend <-> Remote Lab Connected!`)
    ws.on('close', () => { console.log(`Web Backend <-> Remote Lab Disconnected!`) })
})

const handleSTM32 = (req, res) => {
    // button - "USER", "RESET", "ERASE", or "SENSOR"
    // value - USER: 0 or 1, RESET: Dont Care, ERASE: Dont Care, SENSOR: [X, Y, Z]
    let button = req.body.button 
    let value  = req.body.value
    console.log(button,value)
    try {
        // Broadcast message to connected clients 
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify({
                    button: button,
                    value: value
                }))
            }
        })
        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.handleSTM32 = handleSTM32