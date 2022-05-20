import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileComponent = (props) => {

    return (
        
        <View style={styles.container}>
            <TouchableOpacity onPress={props.onPress}>
            <View style={{ flexDirection: 'row', marginLeft: '6%', alignItems: 'center' }}>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontFamily: 'Inter_Regular' }}>{props.text}</Text>
                </View>
                <View style={{ width: '45%', alignItems: 'flex-end' }}>
                    <Ionicons name="chevron-forward" size={25} color="lightgrey" />
                </View>
            </View>
            
            </TouchableOpacity>
            <View style={styles.line}></View>
        </View>

    )

};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Dimensions.get('screen').height * 0.05,
        justifyContent: 'center'
    },
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 1,
        borderColor: 'grey',
        padding: '1%',
        marginLeft: '6%'
    }
});

export default ProfileComponent;