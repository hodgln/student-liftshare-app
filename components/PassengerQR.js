import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg';
import * as svg from 'react-native-svg';

const PassengerQR = (props) => {
    

    return (
        <View>
            <QRCode
                value={props.id}
                size={200}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
})

export default PassengerQR;