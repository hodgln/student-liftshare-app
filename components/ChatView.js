
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'

const ChatView = (props) => {

    const { socket, convo_id, user_id } = props

    console.log(` this is ${convo_id}`)

    const [messages, setMessages] = useState([])
    //const [convoID, setConvoID]

    socket.on("connect", () => console.log(`connected to ${socket.id}`))

    // deal with messages array and apply to react native gifted chat object requirements

    socket.on("chat received", msg => setMessages(msg.map(({created_at, sender_id, text, message_id}) => {return({
        _id: message_id,
        createdAt: created_at,
        user: {_id: sender_id},
        text: text
    })})));

    return (
        <GiftedChat
                messages={messages}
                onSend={
                    message => {
                        socket.emit("chat message", {
                            message: message,
                            convo_id: convo_id,
                            user_id: user_id
                        });
                    }}
                user={{
                    _id: 1
                }}
                //onInputTextChanged={(message) => setChatMessage(message)}
            />
    )
};

export default ChatView;

const styles = StyleSheet.create({
    Input: {
        padding: 10
    }
});