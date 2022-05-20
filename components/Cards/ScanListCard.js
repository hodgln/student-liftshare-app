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
        request_id,
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
                    
                </View>
                <View style={styles.rightColumn}>
                <Text style={styles.nameText}>{firstname}</Text>
                {/* <Text style={styles.nameText}>{surname}</Text> */}
                </View>
                {scanned ?
                    (

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text style={{ fontSize: 20, fontFamily: 'Inter_Medium', padding: '1%', color: "#11AC38" }}>Confirmed</Text>
                            <Ionicons name="checkmark-circle-outline" size={24} color="#11AC38" style={{ padding: '1%' }} />

                        </View>
                    )
                    :
                    (

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            {/* <View style={styles.rightColumn}> */}
                            <Text style={{ fontSize: 20, fontFamily: 'Inter_Medium', padding: '1%', color: '#C86604' }}>Pending</Text>
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
        justifyContent: 'center',
        width: '40%'
    },
    nameText: {
        fontFamily: 'Inter_SemiBold',
        fontSize: 18,
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
