import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector } from 'react-redux';
import RouteInput from './RouteInput';

const RouteDropDown = (props) => {

    const [results, setResults] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    // const [fromName, setFromName] = useState()


    useEffect(() => {
        if (results.length !== 0) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [results]);



    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                props.setID(item.id)
                props.setValueName(item.name)
                setIsVisible(false)
                setResults([])
                props.modalClose(false)
            }}>
                <View style={{ justifyContent: 'center', padding: '5%' }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Inter_Regular' }}>{item.name}</Text>
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        )
    }

    return (

        <View style={styles.conatiner}>
            <View>
                <RouteInput
                    placeholder={props.placeholder}
                    setResults={setResults}
                    valueName={props.valueName === undefined ? null : props.valueName}
                    setValueName={props.setValueName}
                    setID={props.setID}
                />
            </View>

            {isVisible ? (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                />
            ) : null}

        </View>

    )
};

export default RouteDropDown;

const styles = StyleSheet.create({
    conatiner: {
        // padding: 5,
        minWidth: Dimensions.get('window').width * 0.85,
        //height: Dimensions.get('window').height * 0.18,
        width: '90%',
        //alignItems: 'center'
    },
    valid: {
        borderColor: 'green',
        borderWidth: 1.8
    },
    line: {
        borderBottomWidth: 0.5,
        width: '100%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    }
});