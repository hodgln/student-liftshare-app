import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 


const RatingButton = (props) => {

    const { Styles, onPress } = props

    return (
     <TouchableOpacity onPress={onPress} >
         <View style={{ padding: '1.5%'}}>
         <Ionicons name="star" size={35} color={Styles ? "orange" : "lightgrey"} />
         </View>
     </TouchableOpacity>
    )
}

//think about passing in props as function parameters if its not working


export default RatingButton;