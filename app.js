// Importing required packages
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

// Parse the data from user to JSON
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// app.use(cors({origin: 'http://127.0.0.1:5500'}));
app.use(cors({origin: 'https://vi-r-us.github.io/Train-WebApp/'}));

// Mongoose configuration
const url = "mongodb+srv://" + process.env.MONGO_USER_NAME +  ":" + process.env.MONGO_PASSWORD + "@cluster.ixbofk8.mongodb.net/trainDB";
mongoose.connect(url, {useNewUrlParser: true}); 

// Seats Entity 
const seatEntity = new mongoose.Schema({
    seatNo: {
        type: Number,
        required: true
    },
    isBooked: Boolean,
    seatType: String
});
const Seat = new mongoose.model('Seat', seatEntity);

// Train Entity
const trainEntity = new mongoose.Schema({
    trainNo: {
        type: String,
        required: true
    },
    name: String,
    source: String,
    destination: String,
    seats: [seatEntity]
});
const Train = new mongoose.model('Train', trainEntity);

// Get train by train number
app.get("/train/:trainNo", function(req, res) {
    const trainNo = req.params.trainNo;

    Train.findOne({trainNo: trainNo})
    .then((foundTrain)=>{
        if (foundTrain) {
            const result = {train: foundTrain}
            res.send(result);
        } else {
            result.message = "Train not found";
            res.status(404).send(result);
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}) 

// Creates a new train entity
app.post("/create", function(req, res) {
    const trainNo = generateTrainNumber();
    const trainName = req.body.trainName;
    const source = req.body.source;
    const destination = req.body.destination;

    // Create an array of 80 seats
    const seatsArray = [];
    for (let i = 0; i < 80; i++) {
        seatsArray.push( new Seat({
            seatNo: i+1,
            isBooked: false,
            seatType: 'UB'
        }));
    }

    // Create a new train
    const newTrain = new Train({
        trainNo: trainNo,
        name: trainName,
        source: source,
        destination: destination,
        seats: seatsArray
    });

    newTrain.save();
    res.send(newTrain);
})

// Book seats on a train
app.post("/book", function(req, res) {
    console.log(req.body);

    const trainNo = req.body.trainNo;
    const numberOfSeats = req.body.numberOfSeats;
    const result = {
        message : "",
        bookedSeats: []
    }

    Train.findOne({trainNo: trainNo})
    .then((foundTrain)=>{
        if (foundTrain) {
            if (checkRequestedSeatsAvailable(foundTrain, numberOfSeats) == false) {
                console.log("Seats not available");
                result.message = "Seats not available";
                res.send(result);
                return;
            }
        
            result.message = "Seats booked successfully"
            result.bookedSeats = bookSeats(foundTrain.seats, numberOfSeats);
            
            // Book available seats here
            for (let i = 0; i <result.bookedSeats.length; i++) {    
                const currentSeatNo = result.bookedSeats[i]-1;
                foundTrain.seats[currentSeatNo].isBooked = true;
            }   
            
            foundTrain.save();
            res.send(result);
        } else {
            result.message = "Train not found";
            res.status(404).send(result);
        }
    })
    .catch((err)=>{
        console.log(err);
    });

})

app.get("/reset/:trainNo", function(req, res) {
    const trainNo = req.params.trainNo;

    Train.findOne({trainNo: trainNo})
    .then((foundTrain)=>{
        if (foundTrain) {
            // all seats isBooked to false
            for (let i = 0; i < 80; i++) {
                foundTrain.seats[i].isBooked = false;
            } 
            
            foundTrain.save();
            res.send("Train has been reseted");
        } else {
            result.message = "Train not found";
            res.status(404).send(result);
        }
    })
    .catch((err)=>{
        console.log(err);
    });
})

app.listen(8000, function() {
    console.log("Server Started");
})

// function to generate random 5 digit integer and return
function generateTrainNumber() {
    const min = 10000;
    const max = 99999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

// check if train has enough no of seats 
function checkRequestedSeatsAvailable(train, numberOfSeats) {
    // get the total avaliable seats
    let seatsAvailable = 0;
    for (let i = 0; i < 80; i++) {
        if (train.seats[i].isBooked === false) {
            seatsAvailable++;
        }
    }

    if (numberOfSeats <= seatsAvailable)
        return true;
    else   
        return false;
}

function bookSeats(seats, numberOfSeats) {
    // creating a dummy seats array
    const currentSeatsCopy = [];
    for (let i = 0; i < 80; i++) {
        const temp = {
            seatNo: seats[i].seatNo,
            isBooked: seats[i].isBooked
        }
        currentSeatsCopy.push(temp);
    }

    const cols = 7;
    const rows = Math.ceil( currentSeatsCopy.length / cols );

    // function to check if seats are available at index 
    function checkSeatAtIndex(r, c) {
        const index = r * cols + c; 
        if (currentSeatsCopy[index] && currentSeatsCopy[index].isBooked == false) {
            return true;
        } else {
            return false;
        }
    }

    // check for row-wise continuous seats
    for (let i = 0; i < rows; i++) {
        let currentRowCount = 0;
        let continuousSeatsArray = [];
        for (let j = 0; j < cols; j++) {
            if (checkSeatAtIndex(i, j) == true) {
                currentRowCount++;
                continuousSeatsArray.push(currentSeatsCopy[i * cols + j].seatNo);
            } else {
                continuousSeatsArray = [];
                currentRowCount = 0
            }
            // book the seats and post
            if (currentRowCount == numberOfSeats) {
                return continuousSeatsArray;
            }
        }
    }

    const seatsAvailableGroup = []
    // if continuous seats are not available book the first occuring seats 
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (checkSeatAtIndex(i, j) == true) {
                seatsAvailableGroup.push(currentSeatsCopy[i * cols + j].seatNo);
            } 
            // book the seats and post
            if (seatsAvailableGroup.length == numberOfSeats) {
                return seatsAvailableGroup;
            }
        }
    }

    return [];
}

