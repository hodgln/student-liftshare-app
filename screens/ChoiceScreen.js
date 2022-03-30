import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Button, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native'
import { Ionicons, Foundation, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import NextButton from '../components/Buttons/NextButton';


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

        <View style={{ flex: 1, backgroundColor: 'white'}}>
        <View style={{ width: '50%', height: '50%', zIndex: 0, borderWidth: 1, backgroundColor: '#0352A0' }}>
        <View style={styles.HomeScreen}>

            <View style={styles.loginElements}>
                <View style={styles.header}>
                    <Image source={require('../assets/SpareseatText.png')} style={styles.SpareseatText} />
                </View>
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
                <View style={styles.goButton}>
                    {/* {isVisible ?
                        <TouchableOpacity onPress={goToLogin}>
                            <Ionicons name="chevron-forward-circle-outline" style={{ fontSize: 40 }} color='#0352A0'></Ionicons>
                        </TouchableOpacity>
                        : null} */}
                        <NextButton onPress={goToLogin} text="next" disabled={!isVisible}/>
                    {/* <Button title="+" onPress={goToLogin} disabled={isLoggedIn ? true : false} /> */}
                </View>
            </View>

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
        width: Dimensions.get('screen').width * 1,
        height: Dimensions.get('window').height * 1
        //backgroundColor: 'black'
    },
    background: {
        //flex:1,
        width: '100%',
        height: '100%'
    },
    header: {
        alignItems: 'center',
        height: "40%",
        backgroundColor: '#0352A0',
        borderBottomRightRadius: 50,
        justifyContent: 'center'
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
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50
    },
    columnButtons: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderTopLeftRadius: 40
    },
    goButton: {
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    SpareseatText: {
        height: '17%',
        width: '75%',
        alignSelf: 'center',
        marginTop: '10%'
    }
})

export default HomeScreen;