# Train Booking API

This is a Train Booking API that allows users to book seats on a train. The API follows certain rules and algorithms to handle seat reservations in a coach.

## Front-End
You can check out the front-end of the project at [Train-WebApp](https://github.com/Vi-r-us/Train-WebApp). It provides a user interface to interact with the Train Booking API and perform seat reservations.

## Functionality
The Train Booking API provides the following functionality:

- The train has 80 seats in a coach, arranged in rows. Each row has 7 seats, except for the last row which has only 3 seats.
- Users can reserve up to 7 seats at a time.
- The API prioritizes booking seats in one row if available.
- If seats in one row are not available, the booking algorithm will attempt to book nearby seats.
- Users can book as many tickets as they want until the coach is full.

## Local Quick Start

- Clone to your local
- Install dependencies `npm install`
- Add MongoDB password in `.env`
- Update MongoDB url in `app.js`
- Run locally `node app.js`
- Make requests
  - Book Train: `http://localhost:3000/book`
  - Get Train: `http://localhost:3000/train/:train-number`
  - Create Train: `http://localhost:3000/create`
  - Reset Train : `http://localhost:3000/reset/:train-number`

## Database Structure

- `Demo` https://calm-puce-drill-cape.cyclic.app
- `MongoDB` is used in backend as database
- **Mongoose schemas :**
- Train: A Train having different attributes  
    - Train Number(Req), Name, Source Station, Destination Station, Seats[]

![App Screenshot](https://raw.githubusercontent.com/Vi-r-us/Train-API/master/screenshots/Screenshot%202023-07-01%20115829.png)

- Seats: A Seat having different attributes 
    - Seat Number, Is Booked, Seat Type

![App Screenshot](https://raw.githubusercontent.com/Vi-r-us/Train-API/master/screenshots/Screenshot%202023-07-01%20115704.png)

## Contributing

Contributions to the Train Booking Site are welcome! If you find any bugs, have feature requests, or would like to contribute code, please open an issue or submit a pull request to the GitHub repository.


## 🔗 Links
[![Static Badge](https://img.shields.io/badge/Leetcode-black?style=for-the-badge&logo=leetcode)](https://leetcode.com/Sahil_K/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sahil-kumar-2301/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)

