import React from 'react'
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import io from 'socket.io-client'
import ChatView from '../components/ChatView'
// import { GiftedChat } from 'react-native-gifted-chat'



const ChatScreen = ({route}) => {

    // const [messages, setMessages] = useState([])

    const {
        from,
        to,
        //  date is a non serialised variable - turn into string first?
        firstname,
        surname,
        convo_id,
        user_id
    } = route.params;

    console.log(`user id ${user_id}`)

    const socket = io('http://192.168.86.99:8081')

    return (
    
        <ChatView 
            socket={socket}
            convo_id={convo_id}
            user_id={user_id}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
})

export default ChatScreen;