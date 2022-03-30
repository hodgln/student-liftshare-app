import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import RouteDisplay from '../RouteDisplay';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/core';



const PreviewCard = (props) => {

    const navigation = useNavigation()

    const [isActive, setIsActive] = useState()

    const dateFormat = new Date(props.date)

    useEffect(() => {
        if (moment(dateFormat).format('DDMMYYYY') === moment(new Date).format('DDMMYYYY')) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }}, []);

        

    // the way the props are passed is causing the warning error, 
    // append isactive to the props and pass as one
    // OR 
    // destructure props and pass them one by one

    // destructure props object into navigation and non-navigation and then pass the non-navigation in route params

    const active = { isActive: isActive } 

    return (
        
        <TouchableOpacity 
        style={isActive ? [styles.container, styles.isActive] : styles.container}
        onPress={() => navigation.navigate(props.nextScreen, {...props, ...active} )}    
        //shared element transition here
        >
            
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <View style={{ width: '80%'}}>
            <RouteDisplay
                from={props.from}
                to={props.to}
                date={isActive ? "Today" : moment(dateFormat).format('ddd Do MMM')}
                time={moment(dateFormat).format('HH:mm')}
                price={props.displayPrice !== undefined ? props.displayPrice : props.price}
            />
            </View>
            <View>
            <Ionicons name="chevron-forward" size={50} color="lightgrey" />
            </View>
            </View>
            
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.225,
        // flex: 1,
        borderRadius: 30,
        // borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginVertical: '2%'
        //flexDirection: 'row'
    },
    isActive: {
        borderColor: 'lightgreen',
        borderWidth: 3
    },
    buttons: {
        flexDirection: 'row',
        width: "100%",
        // height: "100%",
        justifyContent: 'center',
        // padding: '2%'
        // alignItems: 'center'
    },
    columns: {
        flexDirection: 'row'
    },
    modal: {
        //width: Dimensions.get('window').width * 0.8,
        //height: Dimensions.get('window').height * 0.2,
        // borderWidth: 7,
        alignSelf: 'center'
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.4
    },
    flatListView: {
        alignItems: 'center',
        justifyContent: 'center',
        // width: '100%'
        //position: 'relative'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: '3%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.9,
        width: Dimensions.get('window').width * 0.9,
    },
    QRmodal: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.8,
        justifyContent: 'center'
    },
    halfContainer: {
        //alignItems: 'center',
        flexDirection: 'row',
        width: '90%'
    },
    line: {
        borderBottomWidth: 0.5,
        width: '80%',
        borderColor: 'grey',
        alignSelf: 'center',
        padding: '1%'
    },
    verticalLine: {
        height: '90%',
        width: 1,
        backgroundColor: '#909090',
        justifyContent: 'center',
        marginRight: Dimensions.get('screen').width * 0.08
    }

});


export default PreviewCard;