import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

const ScanListCard = (props) => {


    const {
        firstname,
        surname,
        scanned,
        picture,
        price,
        passengers
    } = props

    return (
        //(liftStatus === 'pending') ?
        <View>
            <View style={styles.container}>
                <View style={styles.leftColumn}>
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
                <View style={styles.rightColumn}>
                    <Text style={{ fontSize: 22, fontWeight: '600', padding: '2%', color: '#0352A0' }}>£{(price / passengers).toFixed(2)}</Text>
                </View>
                {scanned ?
                    (

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text style={{ fontSize: 20, fontFamily: 'Inter_500Medium', padding: '1%', color: "#11AC38" }}>Confirmed</Text>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#11AC38" style={{ padding: '1%' }} />

                        </View>
                    )
                    :
                    (

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            {/* <View style={styles.rightColumn}> */}
                            <Text style={{ fontSize: 20, fontFamily: 'Inter_500Medium', padding: '1%', color: '#C86604' }}>Pending</Text>
                            <Ionicons name="time-outline" size={24} color="#C86604" style={{ padding: '1%' }} />
                            {/* </View> */}
                        </View>


                    )
                }
            </View>
            <View style={styles.line}></View>
        </View>
        // ) : null

    )
}

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginVertical: '4%'
    },
    leftColumn: {
        alignItems: 'center'
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    nameText: {
        fontFamily: 'Inter_600SemiBold',
        color: '#0466c8'
    },
    line: {
        borderBottomWidth: 0.5,
        width: '100%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    }
});

export default ScanListCard;
