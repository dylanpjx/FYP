const express = require('express')
const router = express.Router()
// const { SerialPort } = require('serialport')

// const port  = new SerialPort({
//     path: 'COM8', // change accordingly
//     baudRate: 57600 
// });

router.post("/", (req, res) => {
    let button = req.body.button
    let value = req.body.value

    console.log(req.body)
    switch (button){
        case "RESET":
            // port.write(Uint8Array.from([value]), (err) => {
            //     if (err) return console.log('Error: ',err.message)
            // })
            console.log("Trigger RESET button") // output doesnt matter
            break
        case "USER":
            // port.write(Uint8Array.from([value]), (err) => {
            //     if (err) return console.log('Error: ',err.message)
            // })
            console.log(`Trigger ${button} to ${value}`)
            break
        case "SLIDER":
            value = Math.min(255, Math.max(0,value)) // Limit range to 0-255
            // port.write(Uint8Array.from([value]), (err) => {
            //     if (err) return console.log('Error: ',err.message)
            // })
            console.log(`Action: ${value}`)
            break
        case "MOVEMENT":
            // port.write(Uint8Array.from([value]), (err) => {
            //     if (err) return console.log('Error: ',err.message)
            // })
            console.log(`Movement: ${value}`)
            break
    }
    res.status(200).send("success")
})

module.exports = router