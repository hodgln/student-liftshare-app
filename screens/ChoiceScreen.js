import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, ImageBackground } from 'react-native'
import { Ionicons, Foundation, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'


const HomeScreen = ({ navigation }) => {

    const [passengerClick, setPassengerClick] = useState(false);
    const [driverClick, setDriverClick] = useState(false);
    // const [isDriver, setIsDriver] = useState(true);
    const [isVisible, setIsVisble] = useState(false)

    const passengerClickHandle = () => {
        setPassengerClick(true);
        setDriverClick(false)
        setIsVisble(true)
    }

    const driverClickHandle = () => {
        setPassengerClick(false);
        setDriverClick(true)
        setIsVisble(true)
    }

    const goToLogin = () => {
        let category

        if (driverClick && !passengerClick) {
            // props.navigation.navigate('DLogIn', { category: 'driver' })
            category = 'driver'
        }
        if (passengerClick && !driverClick) {
            // props.navigation.navigate('DLogIn', { category: 'passenger' })
            category = 'passenger'
        }
        if (!passengerClick && !driverClick) {
            console.log('please select one of the above options')
        }

        navigation.navigate('LogIn', { category: category })
    }




    return (


        <View style={styles.HomeScreen}>

            <View style={styles.loginElements}>
                <View style={styles.header}></View>
                <View style={styles.loginButtons}>
                    <View style={styles.columnButtons}>
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={passengerClickHandle} >

                            
                            <Text style={{ fontFamily: 'Inter_400Regular' }}>I am a</Text>
                            <Text style={{ fontSize: 28, fontFamily: 'Inter_600SemiBold', padding: '2%', color: passengerClick ? '#C80466' : '#0352A0' }}>Passenger</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.verticalLine}>
                    </View>
                    <View style={styles.columnButtons}>
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={driverClickHandle} >

                            <Text style={{ fontFamily: 'Inter_400Regular' }}>I am a</Text>
                            <Text style={{ fontSize: 28, fontFamily: 'Inter_600SemiBold', padding: '2%', color: driverClick ? '#C80466' : '#0352A0' }}>Driver</Text>
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={styles.goButton} >
                    {isVisible ?
                        <TouchableOpacity onPress={goToLogin}>
                            <Ionicons name="chevron-forward-circle-outline" style={{ fontSize: 40 }} color='#0352A0'></Ionicons>
                        </TouchableOpacity>
                        : null}
                    {/* <Button title="+" onPress={goToLogin} disabled={isLoggedIn ? true : false} /> */}
                </View>
            </View>

        </View>

    )
}


const styles = StyleSheet.create({
    HomeScreen: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%',
        //backgroundColor: 'black'
    },
    background: {
        //flex:1,
        width: '100%',
        height: '100%'
    },
    header: {
        alignItems: 'center',
        height: "33%"
    },
    routeFinder: {
        alignItems: 'center',
        height: '100%',
        borderRadius: 40,
        overflow: 'hidden'
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#909090',
        //justifyContent: 'center',
    },
    icons: {
        flexDirection: 'row',
    },
    loginElements: {
        flex: 1,
        // alignItems: 'center',
        //justifyContent: 'center'
        flexDirection: 'column',
        justifyContent: 'center'
    },
    loginButtons: {
        flexDirection: 'row',
        height: '33%',

    },
    columnButtons: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goButton: {
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default HomeScreen;