import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const RouteDisplay = (props) => {

    const { from, to, date, time, price } = props

    console.log(price)

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '5%' }}>
                <MaterialCommunityIcons name="record-circle-outline" size={20} color="grey" />
                <View style={styles.verticalLine}></View>
                <Ionicons name="ios-location-outline" size={24} color="#0466c8" />
            </View>
            <View style={{ justifyContent: 'center'}}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.fromTo}>
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: 'Inter_200ExtraLight' }}>Leaving From:</Text>
                            <View>
                                <Text style={{ fontSize: 19, fontFamily: 'Inter_500Medium', color: '#505050' }}>{JSON.parse(from)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dateTime}>
                        <View style={{ padding: '2%' }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Inter_200ExtraLight', padding: '1%' }}>Leaving At:</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', padding: '1%' }}>{time}</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular' }}>{date}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line}></View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.fromTo}>
                        <Text style={{ fontSize: 12, fontFamily: 'Inter_200ExtraLight'  }}>Going To:</Text>
                        <View>
                            <Text style={{ fontSize: 19, fontFamily: 'Inter_500Medium', color: '#0352A0' }}>{JSON.parse(to)}</Text>
                        </View>
                    </View>
                    <View style={[styles.dateTime, {justifyContent: 'flex-end'}]}>
                        <Text style={{ fontSize: 22, fontWeight: '600', padding: '2%', color: '#0352A0' }}>£{price}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fromTo: {
        width: '50%',
        padding: '2%',
    },
    dateTime: {
        width: '50%',
    },
    verticalLine: {
        height: '37%',
        width: 1,
        backgroundColor: '#909090',
        //justifyContent: 'center',

    },
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 0.65,
        borderColor: 'white',
        padding: '1%',
        marginVertical: '1.5%'
    },
    container: {
        width: '100%', 
        flexDirection: 'row', 
        height: Dimensions.get('screen').height * 0.18,
        borderRadius: 12,
        // borderWidth: 2,
        borderColor: '#0466c8',
    }
})

export default RouteDisplay;