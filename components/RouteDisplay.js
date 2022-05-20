import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const RouteDisplay = (props) => {

    const { from, to, date, time, price, showInfo, infoOnPress } = props

    const showPrice = parseInt(price * 100)


    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '7%', marginBottom: '2%' }}>
                <MaterialCommunityIcons name="record-circle-outline" size={20} color="grey" />
                <View style={styles.verticalLine}></View>
                <Ionicons name="ios-location-outline" size={24} color="#0466c8" />
            </View>
            <View style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.fromTo}>
                        <View>
                            <Text style={{ fontSize: 12, fontFamily: 'Inter_ExtraLight' }}>Leaving From:</Text>
                            <View>
                                <Text style={{ fontSize: 18, fontFamily: 'Inter_Medium', color: '#505050' }}>{JSON.parse(from)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dateTime}>
                        <View style={{ padding: '2%' }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Inter_ExtraLight', padding: '1%' }}>Leaving At:</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'Inter_Regular', padding: '1%' }}>{time}</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'Inter_Regular' }}>{date}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line}></View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.fromTo}>
                        <Text style={{ fontSize: 12, fontFamily: 'Inter_ExtraLight' }}>Going To:</Text>
                        <View>
                            <Text style={{ fontSize: 18, fontFamily: 'Inter_Medium', color: '#0352A0' }}>{JSON.parse(to)}</Text>
                        </View>
                    </View>
                    {showInfo ?

                        (<View style={{ justifyContent: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <Text style={{ fontSize: 16, fontWeight: '600', paddingVertical: '2%', color: '#0352A0' }}>up to </Text> */}
                                <Text style={{ fontSize: 22, fontWeight: '600', padding: '2%', color: '#0352A0' }}>£{(showPrice / 100).toFixed(2)}</Text>
                                <TouchableOpacity onPress={infoOnPress}>
                                    <Ionicons name="information-circle-sharp" size={30} color="#0352A0" />
                                </TouchableOpacity>
                            </View>
                        </View>) :
                        (<View style={[styles.dateTime, { justifyContent: 'flex-end' }]}>
                            <Text style={{ fontSize: 21, fontWeight: '600', padding: '2%', color: '#0352A0' }}>£{(showPrice  / 100).toFixed(2)}</Text>
                        </View>)
                    }
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
        //height: '40%',
        flex: 1,
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
        //height: Dimensions.get('screen').height * 0.18,
        // borderWidth: 2,
        borderColor: '#0466c8',
        padding: '1%'
    }
})

export default RouteDisplay;