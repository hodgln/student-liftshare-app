import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const RouteDisplay = (props) => {

    const { from, to, date, time, price } = props

    return (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="record-circle-outline" size={20} color="grey" />
                <View style={styles.verticalLine}></View>
                <Ionicons name="ios-location-outline" size={24} color="black" />
            </View>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.fromTo}>
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: '200' }}>Leaving From:</Text>
                            <View>
                                <Text style={{ fontSize: 19, fontWeight: '500' }}>{JSON.parse(from)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dateTime}>
                        <View style={{ padding: '2%' }}>
                            <Text style={{ fontSize: 12, fontWeight: '200', padding: '1%' }}>Leaving At:</Text>
                            <Text style={{ fontSize: 14, fontWeight: '400', padding: '1%' }}>{time}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '400' }}>{date}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line}></View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.fromTo}>
                        <Text style={{ fontSize: 12, fontWeight: '200' }}>Going To:</Text>
                        <View>
                            <Text style={{ fontSize: 19, fontWeight: '500' }}>{JSON.parse(to)}</Text>
                        </View>
                    </View>
                    <View style={[styles.dateTime, {justifyContent: 'flex-end'}]}>
                        <Text style={{ fontSize: 22, fontWeight: '600', padding: '2%' }}>{price}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fromTo: {
        width: '45%',
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
        borderColor: 'grey',
        padding: '1%',
        marginVertical: '1.5%'
    },
})

export default RouteDisplay;