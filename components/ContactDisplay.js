import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native'
import { Avatar } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const ContactDisplay = (props) => {

    const { picture, firstname, surname, phone } = props

    return (


        
        <View style={styles.container}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.columnSection}>
                    <Avatar
                        rounded
                        size='medium'
                        source={{
                            uri:
                                picture,
                        }}
                    />

                    <Text style={styles.nameText}>{firstname} {surname}</Text>

                </View>

                <View style={styles.columnSection}>

                        {/* alternatively use expo linking for below */}

                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
                        <Ionicons name="ios-call-outline" size={36} color="#0466c8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.columnSection} onPress={() => Linking.openURL(`sms:${phone}`)}>
                    <TouchableOpacity>
                        <Ionicons name="chatbox-outline" size={36} color="#0466c8" />
                    </TouchableOpacity>
                </View>
            </View>
            {/* </LinearGradient> */}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height * 0.12,
        width: Dimensions.get('screen').width * 0.70,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnSection: {
        alignItems: 'center',
        width: '33%'
    },
    headerText: {
        fontFamily: 'Inter_400Regular',
        color: '#0466c8'
    },
    boldText: {
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 30,
        color: '#0466c8'
    },
    nameText: {
        fontFamily: 'Inter_600SemiBold',
        color: '#0466c8'
    },
    linearGradient: {
        flex: 1
    }
})

export default ContactDisplay;
