const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const axios = require('axios');
const notificationSender = require("../utilities/notificationSender");
const passengerPriceCalc = require("../utilities/passengerPriceCalc");

// change back to pool once db upgraded

router.get("/", authorisation, async (req, res) => {
    try {

        //req.user has the payload
        // res.json(req.user); 



        const user = await pool.query(
            `SELECT
            u.user_email, 
            u.user_firstname, 
            u.user_surname,
            u.user_account,
            u.phone_number,
            u.user_account,
            u.profile_picture
            FROM Users AS u 
            WHERE u.user_id = $1`, [
            req.user.id
        ]);

        const getRating = await pool.query(
            `SELECT
            AVG(rating)
            FROM Ratings
            WHERE user_id = $1`, [
            req.user.id
        ]
        );

        if (user.rows[0].user_account === 'passenger') {
            const getCompletedLifts = await pool.query(
                `SELECT
                Count(*)
                FROM Requests as r
                INNER JOIN Liftshares as l ON l.liftshare_id = r.liftshare_id
                WHERE l.completed = true AND r.status = 'confirmed' AND r.user_id = $1`, [
                req.user.id
            ]
            );



            res.json({
                userData: user.rows[0],
                rating: getRating.rows[0].avg,
                completed: getCompletedLifts.rows[0].count
            })


        } else {
            const getCompletedLifts = await pool.query(
                `SELECT
                Count(*)
                FROM Liftshares
                WHERE completed = true AND user_id = $1`, [
                req.user.id
            ]
            );



            res.json({
                userData: user.rows[0],
                rating: getRating.rows[0].avg,
                completed: getCompletedLifts.rows[0].count
            })


        }




    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

// get just lifts by themself

router.get("/profilelifts", authorisation, async (req, res) => {
    try {


        const userLifts = await pool.query(
            `SELECT 
            l.liftshare_id,
            l.datepicked,
            l.originname,
            l.originlocation,
            l.destinationlocation,
            l.destinationname,
            l.liftshare_id,
            l.driverprice,
            l.seats,
            (SELECT COUNT(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = l.liftshare_id) as passengers
            FROM Liftshares as l
            LEFT OUTER JOIN Requests as r ON r.liftshare_id = l.liftshare_id
            WHERE l.user_id = $1 AND l.completed = false
            GROUP BY l.liftshare_id`, [
            req.user.id
        ]
        );

        //INNER JOIN Requests as r ON r.liftshare_id = l.liftshare_id




        res.json(userLifts.rows)

    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server Error");
    }
});

router.get("/getrequests/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params



        await pool.query(
            `DELETE FROM Requests 
            WHERE created_at < now() - interval '7 days'
            AND status = 'pending'
            AND liftshare_id = $1`, [
            id
        ]);

        const getrequests = await pool.query(
            `SELECT
            u.user_firstname,
            u.user_surname,
            u.phone_number,
            u.profile_picture,
            r.status,
            r.request_id,
            r.user_id,
            l.driverprice,
            l.passengerprice,
            l.destinationname
            FROM Requests AS r
            INNER JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
            INNER JOIN Users AS u ON u.user_id = r.user_id
            WHERE l.liftshare_id = $1`, [
            id
        ]);




        res.json(getrequests.rows)
        // }

    } catch (error) {
        console.log(error.message)
    }
})

router.get("/countpassengers/:id", authorisation, async (req, res) => {
    try {

        const { id } = req.params



        const countPassengers = await pool.query(
            `SELECT 
            count(*)
            FROM Requests
            WHERE liftshare_id = $1 AND status = 'confirmed'`, [
            id
        ]
        )

        const getSeats = await pool.query(
            `SELECT
            seats
            FROM Liftshares
            WHERE liftshare_id = $1`, [
            id
        ]
        );



        res.json({
            passengers: countPassengers.rows[0].count,
            seats: getSeats.rows[0].seats
        });



    } catch (error) {
        console.log(error.message)
    }
});

router.get("/passengerlifts", authorisation, async (req, res) => {
    try {

        // add in timestamp to requests!



        await pool.query("DELETE FROM Requests WHERE created_at < now() - interval '7 days' AND status = 'pending' AND user_id = $1", [
            req.user.id
        ]);

        const passengerlifts = await pool.query(
            `SELECT 
        l.datepicked,
        l.originname,
        l.destinationname,
        l.passengerprice,
        l.originlocation,
        l.destinationlocation,
        u.user_firstname,
        u.user_surname,
        u.phone_number,
        u.profile_picture,
        r.liftshare_id,
        r.request_id,
        r.user_id,
        r.status
        FROM Requests AS r
        INNER JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
        INNER JOIN Users AS u ON u.user_id = l.user_id
        WHERE r.user_id = $1 AND l.completed = false`, [
            req.user.id
        ]);



        res.json(passengerlifts.rows)

    } catch (error) {
        console.log(error.message)
    }
})

//book a lift - decrement seat no. by one 

router.put("/handlestatus", authorisation, async (req, res) => {
    try {


        const { status, request_id, id, to } = req.body

        console.log(to)



        await pool.query(
            "UPDATE Requests SET status = $1 WHERE request_id = $2", [
            status, request_id
        ]);

        const getPushToken = await pool.query("SELECT u.push_token FROM Requests as r INNER JOIN Users as u ON r.user_id = u.user_id WHERE r.request_id = $1", [
            request_id
        ]);

        if (status === "confirmed") {

            const getDate = await pool.query(
                "UPDATE Liftshares SET seats = seats - 1 WHERE liftshare_id = $1 RETURNING *", [
                id
            ]);



            res.json(getDate.rows[0].datepicked)

            notificationSender({
                somePushTokens: Array(getPushToken.rows[0].push_token),
                someData: { liftshare_id: id },
                body: `Your lift request to ${JSON.parse(to)} has been accepted!`
            })


            // please contact the driver to arrange a meet point

        } else if (status === "declined") {



            notificationSender({
                somePushTokens: Array(getPushToken.rows[0].push_token),
                someData: { liftshare_id: id },
                body: `Your lift request to ${JSON.parse(to)} has been declined`
            })

            res.json("declined")

        }

    } catch (error) {
        console.log(error.message);
    }
})



router.put("/seats/:id", authorisation, async (req, res) => {
    try {

        //does this route work as it should?

        const { id } = req.params



        await pool.query(
            "SELECT count(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = $1", [
            id
        ]
        );


        const decrementSeats = await pool.query(
            "UPDATE Liftshares SET seats = seats - 1 WHERE liftshare_id = $1 RETURNING *", [
            id
        ]);

        //split into two separate queries


        if (decrementSeats.rows.length === 0) {

            return (res.json(false))

        };

        console.log(decrementSeats.rows)



        res.json(true);


        //console.log(decrementSeats.rows)

    } catch (error) {
        console.log(error.message);
    }
});

//post lng/lat

router.post("/Liftshares", authorisation, async (req, res) => {
    try {
        //const userID = (req.user.id).replace(/"/g, "'")
        // do this for userID here to insert into db

        const { datepicked, originlocation, destinationlocation, originname, destinationname, seats, pricenumber } = req.body

        const passengerprice = passengerPriceCalc(pricenumber)



        console.log(passengerprice)

        //call driverprice utility function here on driverprice from req.body



        const newCategory = await pool.query(
            `INSERT INTO Liftshares 
        (datepicked, 
        originlocation, 
        destinationlocation, 
        originname, 
        destinationname, 
        seats, 
        driverprice,
        passengerprice,
        user_id)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [datepicked, originlocation, destinationlocation, originname, destinationname, seats, pricenumber, passengerprice, req.user.id]);

        // insert price calculation in VALUES as the 8th one



        res.json(newCategory)

    } catch (error) {
        console.log(error.message);
    }
});

// app.get("/Users", async (req, res) => {
//     try {
//         const tryusers = await pool.query("SELECT * FROM Users")

//         res.json(tryusers)
//     } catch (err) {
//         console.log(err.message)
//     }
// });
// router.post("/Requests/status", authorisation, async(req, res) => {
//     try {
//         const confirmStatus = 
//     } catch (error) {
//         console.log(error.message)
//     }
// })

router.post("/Requests/post", authorisation, async (req, res) => {
    try {
        // check if requests already exist under this user id and this liftshare id 

        // const checkRequests = await pool.query("SELECT * FROM Requests WHERE user_id = $1 AND liftshare_id = $2", [
        //     liftshare_id, req.user.id
        // ]);

        // if(checkRequests.rows.length !== 0) {
        //     return res.json(false)
        // };



        const { liftid, status, intentID } = req.body
        const enterRequest = await pool.query("INSERT INTO Requests (liftshare_id, user_id, status, payment_intent_id) VALUES ($1, $2, $3, $4) RETURNING *", [
            liftid, req.user.id, status, intentID
        ]);


        const getPushToken = await pool.query("SELECT u.push_token from Users as u INNER JOIN Liftshares as l ON u.user_id = l.user_id INNER JOIN Requests as r ON l.liftshare_id = r.liftshare_id WHERE r.request_id = $1", [
            enterRequest.rows[0].request_id
        ]);


        notificationSender({
            somePushTokens: Array(getPushToken.rows[0].push_token),
            someData: { request_id: enterRequest.rows[0].request_id },
            body: "You have received a request!"
        });




        res.json({ title: "Lift Booked!", body: "Please await confirmation from the driver" });



    } catch (error) {
        console.log(error.message)
    }
});

//delete a request

router.delete("/cancelrequest/:requestid", authorisation, async (req, res) => {
    try {
        const { requestid } = req.params;



        const cancelRequest = await pool.query("DELETE FROM Requests WHERE request_id = $1 AND user_id = $2", [
            requestid, req.user.id
        ]);

        console.log(requestid)
        console.log(req.user.id)

        //check if this works properly

        //this route needs checking!!!
        if (Array.isArray(cancelRequest.rows)) {

            res.json("request was cancelled");

        } else {

            res.json("something went wrong")

        }

    } catch (error) {
        console.log(error)
    }
})

//get distance between origin and destination

router.post("/Liftshares/distance", authorisation, async (req, res) => {
    try {

        const { originlocation, destinationlocation } = req.body

        // const removeLiftshares = await pool.query(
        //     `SELECT r.liftshare_id from Requests AS r where r.user_id = $1`, [
        //         req.user.id
        //     ]
        // )

        // console.log(removeLiftshares.rows);



        const getAll = await pool.query(
            `SELECT 
        l.liftshare_id,
        l.datepicked, 
        l.originname, 
        l.destinationname,
        l.originlocation,
        l.destinationlocation,
        l.seats,
        l.liftshare_id,
        l.driverprice,
        l.passengerprice,
        ((l.originlocation <@> $1) + (l.destinationlocation <@> $2)) as distance,
        l.user_id,
        u.user_firstname,
        u.user_surname,
        u.profile_picture
        FROM Requests as r
        RIGHT JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
        RIGHT JOIN Users AS u ON u.user_id = l.user_id
        WHERE l.liftshare_id NOT IN (SELECT r.liftshare_id FROM Requests as r WHERE r.user_id = $3) AND l.datepicked > NOW()
        order by distance
        LIMIT 10`, [originlocation, destinationlocation, req.user.id]
        );


        //inner join with liftshare and driver ids

        //this needs changing so that if the user id has a request the liftshare_id doesnt show up 



        res.json(getAll.rows);



    } catch (error) {
        console.log(error.message);
    }
});


router.get("/driverprofile/:driver_id", authorisation, async (req, res) => {
    try {

        const { driver_id } = req.params
        // rewrite this from the passengers perspective



        const getRating = await pool.query(
            `SELECT
            AVG(rating)
            FROM Ratings
            WHERE user_id = $1`, [
            driver_id
        ]
        );

        const getCompletedLifts = await pool.query(
            `SELECT
            Count(*)
            FROM Liftshares
            WHERE completed = true AND user_id = $1`, [
            driver_id
        ]
        );



        res.json({
            rating: getRating.rows[0].avg,
            completed: getCompletedLifts.rows[0].count
        });



    } catch (error) {
        console.log(error.message)
    }
})

router.get("/passengerprofile/:passenger_id", authorisation, async (req, res) => {
    try {

        const { passenger_id } = req.params



        const getRating = await pool.query(
            `SELECT
            AVG(rating)
            FROM Ratings
            WHERE user_id = $1`, [
            passenger_id
        ]
        );

        const getCompletedLifts = await pool.query(
            `SELECT
            Count(*)
            FROM Requests as r
            INNER JOIN Liftshares as l ON l.liftshare_id = r.liftshare_id
            WHERE l.completed = true AND r.status = 'confirmed' AND r.user_id = $1`, [
            passenger_id
        ]
        );



        res.json({
            rating: getRating.rows[0].avg,
            completed: getCompletedLifts.rows[0].count
        })



    } catch (error) {
        console.log(error.message)
    }
})
//rate user

router.post("/ratings", authorisation, async (req, res) => {
    try {



        const { user_id, rating, liftshare_id } = req.body

        const passengerRating = await pool.query("INSERT INTO Ratings (user_id, rating, liftshare_id, submitted_by) VALUES ($1, $2, $3, $4) RETURNING *", [
            user_id, rating, liftshare_id, req.user.id
        ]);



        res.json(passengerRating)

    } catch (error) {
        console.log(error.message)
    }
})

// ratings pop up for driver

router.get("/ratings/frompassenger", authorisation, async (req, res) => {
    try {



        const liftIDs = await pool.query(
            `SELECT l.liftshare_id 
            FROM Requests as r
            INNER JOIN Liftshares as l ON l.liftshare_id = r.liftshare_id
            WHERE r.status = 'confirmed' 
            AND l.completed = true
            AND r.user_id = $1`, [
            req.user.id
        ]
        );

        console.log(liftIDs.rows)

        // make similar to below route!!





        const getDriver = async () => {

            let ratingData = []

            for (const element of liftIDs.rows) {

                const getNonRatedDriver = await pool.query(
                    `SELECT 
                        l.liftshare_id,
                        l.destinationname,
                        u.user_firstname,
                        u.profile_picture,
                        l.user_id
                        FROM Liftshares as l
                        INNER JOIN Requests as r ON r.liftshare_id = l.liftshare_id
                        INNER JOIN Users as u ON u.user_id = l.user_id
                        WHERE r.liftshare_id = $1 AND r.status = 'confirmed' AND r.user_id = $2 AND
                        l.user_id NOT IN (SELECT user_id FROM Ratings WHERE liftshare_id = $1 AND submitted_by = $2)`, [
                    element.liftshare_id, req.user.id
                ]);


                // res.json()

                if (getNonRatedDriver.rows.length !== 0) {
                    for (const row of getNonRatedDriver.rows) {
                        ratingData.push(row)
                        // this should work because the liftshareID should not vary if only one set of passengers can get rated at once. 
                    }
                    // res.json(getNonRatedDriver.rows)
                }
                // }

            };

            return (ratingData)
        }

        const unratedDriver = await getDriver()



        res.json(unratedDriver)


    } catch (error) {
        console.log(error.message)
    }
})

router.put("/noshow/:id", authorisation, async (req, res) => {
    try {

        const { id } = req.params;



        const editStatus = await pool.query("UPDATE Requests SET status = $1 WHERE request_id = $2", [
            "noshow", id
        ]);



        res.json(editStatus)



    } catch (error) {
        console.log(error.message)
    }

})

router.get("/ratings/fromdriver", authorisation, async (req, res) => {
    try {



        // confirmed requests from completed lifts
        const liftIDs = await pool.query(
            `SELECT liftshare_id FROM liftshares WHERE completed = true AND user_id = $1`, [
            req.user.id
        ]
        );

        console.log(liftIDs.rows)

        for (const element of liftIDs.rows) {
            console.log(element.liftshare_id)
        }

        // make asynchronous 

        const getPassengerData = async () => {

            let ratingData = []
            let liftshareID

            for (const element of liftIDs.rows) {
                const getNonRatedPassengers = await pool.query(
                    `SELECT 
                    l.liftshare_id,
                    l.destinationname,
                    u.user_firstname,
                    u.profile_picture,
                    r.user_id
                    FROM Requests as r
                    INNER JOIN Liftshares as l ON l.liftshare_id = r.liftshare_id
                    INNER JOIN Users as u ON u.user_id = r.user_id
                    WHERE r.liftshare_id = $1 AND r.status = 'confirmed' AND 
                    r.user_id NOT IN (SELECT user_id FROM Ratings WHERE liftshare_id = $1 AND submitted_by = $2)`, [
                    element.liftshare_id, req.user.id
                ]);



                if (getNonRatedPassengers.rows.length !== 0) {
                    // ratingData.push()

                    for (const row of getNonRatedPassengers.rows) {
                        ratingData.push(row)
                        liftshareID = row.liftshare_id

                        // this should work because the liftshareID should not vary if only one set of passengers can get rated at once. 
                    }

                }
            };

            return ({
                passengers: ratingData,
                liftshareID: liftshareID
            });

        };


        const passengers = await getPassengerData()



        res.json(passengers)




    } catch (error) {
        console.log(error.message)
    }
})

// update completed lift

router.put("/completelift/:liftshare_id", authorisation, async (req, res) => {
    try {

        const { liftshare_id } = req.params

        console.log(` liftshare id is ${liftshare_id}`)



        const completeLift = await pool.query(
            "UPDATE Liftshares SET completed = true WHERE liftshare_id = $1 RETURNING *", [
            liftshare_id
        ]
        );



        res.json(completeLift)


    } catch (error) {
        console.log(error.message)
    }
})

// delete category

router.delete("/Liftshares/:id", authorisation, async (req, res) => {
    try {


        const { id } = req.params;
        await pool.query(
            `DELETE FROM Requests WHERE liftshare_id = $1`, [
            id
        ]);

        await pool.query(
            `DELETE FROM Liftshares WHERE liftshare_id = $1 AND user_id = $2`, [
            id, req.user.id
        ]);



        res.json("liftshare was deleted")


    } catch (error) {
        console.log(error)
    }
});

// check if stripe registered

router.get("/checkifstripe", authorisation, async (req, res) => {
    try {



        const getUser = await pool.query(
            `SELECT * FROM Users WHERE user_id = $1`, [
            req.user.id
        ]);



        res.json(getUser.rows[0])

    } catch (error) {
        console.log(error.message)
    }

});

router.post("/checkregno", authorisation, async (req, res) => {
    try {

        const { registrationNumber } = req.body

        console.log(registrationNumber)

        var data = JSON.stringify({ registrationNumber: registrationNumber });

        const config = {
            method: 'post',
            url:
                'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
            headers: {
                'x-api-key': process.env.DRIVER_API,
                'Content-Type': 'application/json',
            },
            data: data,
        };

        // below is fine for response

        axios(config)
            .then(function (response) {
                console.log(`reponse.status is ${response.status}`)
                res.json({
                    data: response.data,
                    status: response.status
                });
            })
            .catch(function (error) {
                console.log(error.response.status)
                res.json({
                    data: null,
                    status: error.response.status
                });
            });

        


    } catch (error) {
        console.log(error.message)
    }


});









module.exports = router;
