import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg';
import * as svg from 'react-native-svg';

const DriverQR = (props) => {
    
    const { ids } = props

    console.log(ids)

    return (
        <View>
            {ids.length === 0 ? (<Text>There are no passengers to check in!</Text>) :
            (<QRCode
                value={ids}
                size={200}
                // sort out the array thing with this - info is in the docs
            />)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
})

export default DriverQR;