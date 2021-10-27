
const pool = require("../db");
//const router = require("express").Router();

const getSocketMessages = async(convo_id) => {
    try {
        //const { convo_id } = req.params

        console.log(`convo id == ${convo_id}`);

        const getMessages = await pool.query(
            `SELECT * FROM Messages as m 
            WHERE m.conversation_id = $1
            `,[
                convo_id
            ]);

        //console.log(getMessages.rows);

        return(getMessages.rows);

    } catch (error) {
        console.log(error.message)
    }
}

const createSocketMessage = async(msg) => {
    try {

        const createMessage = await pool.query(
            `INSERT INTO Messages (conversation_id, sender_id, text) VALUES ($1, $2, $3) RETURNING *`, [
                msg.convo_id, msg.user_id, msg.message[0].text
            ]
        );

        //console.log(createMessage.rows);

        return(createMessage.rows);
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { getSocketMessages, createSocketMessage };