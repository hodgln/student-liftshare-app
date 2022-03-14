import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, Button, TextInput, TouchableOpacity } from 'react-native'
import SeatButton from '../components/Buttons/SeatButton'
import DateTimePicker from '@react-native-community/datetimepicker';
import NextButton from '../components/Buttons/NextButton';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';



const DriverRouteTwo = (props) => {

    const {
        date,
        setDate,
        stages,
        setStage,
        regFunc,
        reg,
        isValid
    } = props


    const [show, setShow] = useState(true);



    // console.log(destinationlocation)

    const minimumDate = new Date().setHours(0, 0, 0, 0)

    const mode = 'datetime'

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };


    return (
        <View>
            <BlurView style={styles.componentContainer}>
                <View style={{ padding: '4%' }}>
                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20, color: '#D0D3D4', fontFamily: 'Inter_400Regular' }}>What is your registration number?</Text>
                    </View>
                    <View style={styles.line}></View>
                    <View style={styles.Input}>
                        <View style={{ width: '10%' }}></View>
                        <View style={{ width: '80%', height: '100%', alignItems: 'center', flexDirection: 'row' }}>
                            <TextInput
                                {...props}
                                placeholder={props.placeholder}
                                keyboardType='default'
                                autoCapitalize='none'
                                returnKeyType='done'
                                autoCorrect={false}
                                value={reg}
                                onChangeText={text => regFunc(text)}
                                style={styles.textInput}
                                autoFocus={true}
                                selectionColor={"white"}
                                autoCapitalize="characters"
                                maxLength={7}
                            />
                        </View>
                        <View style={{ width: '10%' }}>
                            {!isValid ? null : (<Ionicons name="checkmark-circle-outline" size={35} color="lightgreen" />) }
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, padding: 15, justifyContent: 'center' }}>

                    <View style={styles.textAlign}>
                        <Text style={{ fontSize: 20, color: '#535454', fontFamily: 'Inter_400Regular' }}>When are you leaving?</Text>
                    </View>

                    <View style={styles.line}></View>

                    <View style={styles.priceArea}>
                        {/* <Text>price:</Text>
                    <Text>£{isNaN(driverprice) ? '0' : driverprice.toFixed(2)}</Text> */}
                        {show && (<DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            minuteInterval={15}
                            minimumDate={minimumDate}
                        />)}
                    </View>

                </View>
                {/* change so that it can be anytime and not today */}

                <View style={styles.bottomline}></View>
                <View style={{ alignSelf: 'center', marginBottom: Dimensions.get('screen').height * 0.03 }}>
                    <NextButton text="next" disabled={date >= new Date() && reg.length > 1 ? false : true} onPress={() => setStage(stages.ROUTE_THREE)} />
                </View>
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    twoSeats: {
        flexDirection: 'row',
        width: '100%'
    },
    textAlign: {
        padding: '3%'
    },
    priceArea: {
        padding: '3%',
        justifyContent: 'center',
        //marginBottom: '5%',
        height: Dimensions.get('window').height * 0.1,
        alignSelf: 'center',
        width: '70%'
    },
    line: {
        borderBottomWidth: 0.5,
        width: '85%',
        borderColor: 'lightgrey',
    },
    bottomline: {
        borderBottomWidth: 1,
        width: '85%',
        borderColor: 'grey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
        // marginVertical: '4%'
    },
    componentContainer: {
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('screen').width * 0.9,
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 20,
    },
    addsubtract: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boldText: {
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 50,
        color: '#F0F3F4'
    },
    Input: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: Dimensions.get('window').height * 0.02,
        height: Dimensions.get('window').height * 0.06,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    textInput: {
        height: '100%',
        fontFamily: 'Inter_400Regular',
        fontSize: 40,
        width: '100%',
        color: 'white',
        textAlign: 'center',
    }
})

export default DriverRouteTwo;