import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


const SeatButton = (props) => {

    const { Styles, onPress } = props

    return (
     <TouchableOpacity onPress={onPress} >
         <View>
         <MaterialCommunityIcons name="seatbelt" size={70} color={Styles ? "green" : "black"} />
         </View>
     </TouchableOpacity>
    )
}

//think about passing in props as function parameters if its not working


export default SeatButton;