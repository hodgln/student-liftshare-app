import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Avatar } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'

const ProfileDisplay = (props) => {

    const { picture, firstname, surname, rating, completed } = props

    console.log(rating)

    return (


        //add call + text buttons as icons on the same line as profile pic

        // remove completed lifts and ratings

        //add in color gradient, same as the driverRoute one
        // <LinearGradient colors={['#0352A0', '#0466c8', '#238ffb']} start={{x: 0.2, y: 0}} end={{x: 1, y: 0}} style={styles.container}>
        <View style={styles.container}>
            
            <View style={{ flexDirection: 'row' }}>
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
                    <Text style={styles.headerText}>Previous Lifts:</Text>
                    <Text style={styles.boldText}>{completed === undefined ? '0' : completed}</Text>
                </View>

                <View style={styles.columnSection}>
                    <Text style={styles.headerText}>Rating:</Text>
                    <Text style={styles.boldText}>{rating ? JSON.parse(rating).toFixed(1) : '---'}</Text>
                </View>
            </View>
            {/* </LinearGradient> */}
            </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('screen').height * 0.12,
        width: Dimensions.get('screen').width * 0.78,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnSection: {
        alignItems: 'center',
        width: '33%'
    },
    headerText: {
        fontFamily: 'Inter_Regular',
        color: '#0466c8'
    },
    boldText: {
        fontFamily: 'Inter_ExtraBold',
        fontSize: 30,
        color: '#0466c8'
    },
    nameText: {
        fontFamily: 'Inter_SemiBold',
        color: '#0466c8'
    },
    linearGradient: {
        flex: 1
    }
})

export default ProfileDisplay;
