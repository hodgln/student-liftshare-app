const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
// const io = require("../index")



router.get("/driverconvo/:liftid", authorisation, async (req,res) => {
    try {
        
        //create conversation from drivers end with passenger

        const { id } = req.params;

        //request id for passenger

        const createConvoDriver = await pool.query(
            `SELECT
            conversation_id
            FROM Conversations as c
            WHERE c.driver_id = $1 AND c.passenger = (SELECT r.user_id FROM Requests as r WHERE r.request_id = $2)`, [
                req.user.id, id
            ]);

        

            // await... select conversation_id where liftshare_id is x and user_id from requests is x 

            //if(rows.x === 0) {res.json("not possible")} else 

            // when requesting for prev messages using conversation_id, if no convo_id present res.json something that triggers a convo start

            //get last 10 or so messages from the database, create new table with messages, sender/reciever and convo ids

            // use liftshare_id ?

        res.json(getMessengerInfo.rows)

    } catch (error) {
        console.log(error.message)
    }
});

//create route from passenger perspective 'message driver'

// await select convo again, input with 

router.get("/passengerconvo/:liftid", authorisation, async (req,res) => {
    try {
        
        //create conversation from drivers end with passenger

        const { liftid } = req.params;

        //request id for passenger

        //CHECK THIS ROUTE IS WORKING WITH NEW USER - 12/08/21

        const createConvoDriver = await pool.query(
            `SELECT
            conversation_id,
            passenger_id
            FROM Conversations as c
            WHERE c.passenger_id = $1 AND c.driver_id = (SELECT l.user_id FROM Liftshares as l WHERE l.liftshare_id = $2)`, [
                req.user.id, liftid
            ]);

        //console.log(createConvoDriver.rows.length)

        if(createConvoDriver.rows.length === 0) {
            const insertConvo = await pool.query(
                `INSERT INTO Conversations
                (driver_id, passenger_id)
                VALUES((SELECT l.user_id FROM Liftshares as l WHERE l.liftshare_id = $1), $2)
                RETURNING conversation_id, passenger_id`, [
                liftid, req.user.id
            ]);

            res.json(insertConvo.rows)
        } else {
            res.json(createConvoDriver.rows)
        }

        

            // await... select conversation_id where liftshare_id is x and user_id from requests is x 

            //if(rows.x === 0) {res.json("not possible")} else 

            // when requesting for prev messages using conversation_id, if no convo_id present res.json something that triggers a convo start

            //get last 10 or so messages from the database, create new table with messages, sender/reciever and convo ids

            // use liftshare_id ?

    } catch (error) {
        console.log(error.message)
    }
});



module.exports = router;