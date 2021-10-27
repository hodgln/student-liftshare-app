const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

router.get("/", authorisation, async (req, res) => {
    try {

        //req.user has the payload
        // res.json(req.user); 

        const userID = await req.user.id;
        //.replace(/"/g, "'")
        console.log(`this is ${req.user.id}`)

        const user = await pool.query(
            `SELECT
            u.user_email, 
            u.user_firstname, 
            u.user_surname,
            u.user_account,
            u.phone_number,
            u.profile_picture
            FROM Users AS u 
            WHERE u.user_id = $1`, [
            userID
        ]);

        res.json(user.rows);


    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

// get just lifts by themself

router.get("/profilelifts", authorisation, async (req, res) => {
    try {

        const userID = await req.user.id;

        const userLifts = await pool.query(
            `SELECT 
            l.liftshare_id,
            l.datepicked, 
            l.originname, 
            l.destinationname,
            l.seats,
            l.liftshare_id,
            l.driverprice
            FROM Liftshares as l
            WHERE l.user_id = $1`, [
            userID
        ]
        );

        res.json(userLifts.rows)
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server Error");
    }
});

router.get("/getrequests/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params
        const getrequests = await pool.query(
            `SELECT
            u.user_firstname,
            u.user_surname,
            u.phone_number,
            u.profile_picture,
            r.status,
            r.request_id,
            r.user_id
            FROM Requests AS r
            INNER JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
            INNER JOIN Users AS u ON u.user_id = r.user_id
            WHERE l.liftshare_id = $1`, [
            id
        ]);

        //add in AND r.status = 'pending' to

        //find a way to differentate between pending and confirmed 

        //AND l.user_id = $2, do this for improved security so people can't easily access other lifts requests

        // if (getrequests.rows.length === 0) {
        //     res.json("you do not have any requests for this lift")
        //     // console.log("you do not have any requests for this lift")
        // } else {
            res.json(getrequests.rows)
        // }

    } catch (error) {
        console.log(error.message)
    }
})

router.get("/getrequests/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params
        const getrequests = await pool.query(
            `SELECT
            u.user_firstname,
            u.user_surname,
            u.phone_number,
            r.status,
            r.request_id,
            r.user_id
            FROM Requests AS r
            INNER JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
            INNER JOIN Users AS u ON u.user_id = r.user_id
            WHERE l.liftshare_id = $1`, [
            id
        ]);

        //add in AND r.status = 'pending' to

        //find a way to differentate between pending and confirmed 

        //AND l.user_id = $2, do this for improved security so people can't easily access other lifts requests

        // if (getrequests.rows.length === 0) {
        //     res.json("you do not have any requests for this lift")
        //     // console.log("you do not have any requests for this lift")
        // } else {
            res.json(getrequests.rows)
        // }

    } catch (error) {
        console.log(error.message)
    }
})

router.get("/passengerprice/:id", authorisation, async(req,res) => {
    try {
        const { id } = req.params

        const getCount = await pool.query(
        "SELECT count(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = $1", [
            id
        ]);

        res.json(getCount.rows[0].count);

        
    } catch (error) {
        console.log(error.message)
    }
})

router.get("/passengerlifts", authorisation, async (req, res) => {
    try {
        const passengerlifts = await pool.query(
            `SELECT 
        l.datepicked,
        l.originname,
        l.destinationname,
        l.driverprice,
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
        WHERE r.user_id = $1`, [
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


        const { status, request_id } = req.body

        const confirmStatus = await pool.query(
            "UPDATE Requests SET status = $1 WHERE request_id = $2 RETURNING *", [
            status, request_id
        ]);

        //split into two separate queries

        if (confirmStatus.rows.length === 0) {
            return res.json(false)
        };

        res.json(confirmStatus.rows);

        //console.log(decrementSeats.rows)

    } catch (error) {
        console.log(error.message);
    }
})



router.put("/seats/:id", authorisation, async (req, res) => {
    try {



        const { id } = req.params

        const getConfirmed = await pool.query(
            "SELECT count(*) FROM Requests WHERE status = 'confirmed' AND liftshare_id = $1", [
                id
            ]
        );

        // const updatePrice = await pool.query(
        //     "UPDATE Liftshares SET passengerprice = (passengerprice / $1) + 0.5 WHERE liftshare_id = $2 RETURNING *", [
        //         getConfirmed.count, id
        //     ]
        // );

        const decrementSeats = await pool.query(
            "UPDATE Liftshares SET seats = seats - 1 WHERE liftshare_id = $1 RETURNING *", [
            id
        ]);

        //split into two separate queries


        if (decrementSeats.rows.length === 0) {
            return res.json(false)
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

        const { datepicked, originlocation, destinationlocation, originname, destinationname, seats, driverprice } = req.body
        const newCategory = await pool.query(
            `INSERT INTO Liftshares 
        (datepicked, 
        originlocation, 
        destinationlocation, 
        originname, 
        destinationname, 
        seats, 
        driverprice,
        user_id)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [datepicked, originlocation, destinationlocation, originname, destinationname, seats, driverprice, req.user.id]);

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


        console.log(enterRequest.rows);


        res.json({ title: "Lift Booked!", body: "Please await confirmation from the driver" });

    } catch (error) {
        console.log(error.message)
    }
});

//delete a request

router.delete("/cancelrequest/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM Requests WHERE request_id = $1 AND user_id = $2", [
            id, req.user.id
        ]);

        console.log(req.params)
        console.log(req.user.id)

        //check if this works properly

        //this route needs checking!!!

        res.json("request was deleted");
    } catch (error) {
        console.log(error)
    }
})

//get distance between origin and destination

router.post("/Liftshares/distance", authorisation, async (req, res) => {
    try {

        const { originlocation, destinationlocation } = req.body

        console.log(req.body)

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
        l.seats,
        l.liftshare_id,
        l.driverprice,
        ((l.originlocation <@> $1) + (l.destinationlocation <@> $2)) as distance,
        r.user_id,
        u.user_firstname,
        u.user_surname,
        u.profile_picture
        FROM Requests as r
        RIGHT JOIN Liftshares AS l ON l.liftshare_id = r.liftshare_id
        RIGHT JOIN Users AS u ON u.user_id = l.user_id
        WHERE l.liftshare_id NOT IN (SELECT r.liftshare_id FROM Requests as r WHERE r.user_id = $3)
        order by distance`, [originlocation, destinationlocation, req.user.id]
        );
        

        //inner join with liftshare and driver ids

        //this needs changing so that if the user id has a request the liftshare_id doesnt show up 

        res.json(getAll.rows);

        console.log(getAll.rows)
        
    } catch (error) {
        console.log(error.message);
    }
});

// delete category

router.delete("/Liftshares/:id", authorisation, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteRequests = await pool.query(
            `DELETE FROM Requests WHERE liftshare_id = $1`, [
            id
        ]);
        
        const deleteLiftShare = await pool.query(
        `DELETE FROM Liftshares WHERE liftshare_id = $1 AND user_id = $2`, [
            id, req.user.id
        ]);

        res.json("liftshare was deleted")
    } catch (error) {
        console.log(error)
    }
});



router.put("/resetpassword", async (req, res) => {
    try {

        
        const { email, password } = req.body


        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPassword = await bcrypt.hash(password, salt);


        const updatePassword = await pool.query(
            "UPDATE Users SET password = $1 WHERE user_email = $2 RETURNING *", [
            bcryptPassword, email
        ]);

        //split into two separate queries

        if (updatePassword.rows.length === 0) {
            return res.json('could not update password')
        };

        res.json(updatePassword.rows);

        //console.log(decrementSeats.rows)

    } catch (error) {
        console.log(error.message);
    }
})



module.exports = router;
