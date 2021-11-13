import React from 'react'
import { View, StyleSheet, Dimensions, Button, Text, Modal } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import NextButton from '../components/Buttons/NextButton';
import RouteDropDown from '../components/RouteDropDown'
import DummyRouteInput from '../components/DummyRouteInput';
import { LinearGradient } from 'expo-linear-gradient';



const PassengerRoute = props => {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);

    const [originID, setOriginID] = useState(null)
    const [destinationID, setDestinationID] = useState(null)

    const [originLatitude, setOriginLatitude] = useState()
    const [originLongitude, setOriginLongitude] = useState()

    const [destinationLatitude, setDestinationLatitude] = useState()
    const [destinationLongitude, setDestinationLongitude] = useState()

    const [placeholderFrom, setPlaceholderFrom] = useState(null)
    const [placeholderTo, setPlaceholderTo] = useState(null)

    const [fromIsVisible, setFromIsVisible] = useState(false)
    const [toIsVisible, setToIsVisible] = useState(false)

    const token = useSelector(state => state.authorisation.userToken)

    const origin = { latitude: originLatitude, longitude: originLongitude }

    const destination = { latitude: destinationLatitude, longitude: destinationLongitude }

    useEffect(() => {

        if (originID !== null) {

            getCoords(originID).then((data) => {
                setOriginLatitude(data.location.lat)
                setOriginLongitude(data.location.lng)

            }).catch((e) => console.log(e))

        } else {
            setOriginLatitude(null)
            setOriginLongitude(null)

        }


        if (destinationID !== null) {

            getCoords(destinationID).then(data => {
                setDestinationLatitude(data.location.lat)
                setDestinationLongitude(data.location.lng)
            }).catch((e) => console.log(e))
        } else {
            setDestinationLatitude(null)
            setDestinationLongitude(null)

        }

    }, [destinationID, originID])


    const getCoords = async (place_id) => {
        try {

            const response = await fetch(`http://localhost:8081/locations/coords/${place_id}`, {
                method: 'GET',
                headers: {
                    token: token
                }
            });

            const parseRes = await response.json();

            return (parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }




    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onGoPress = () => {
        props.navigation.navigate('Choose Driver', { origin: origin, destination: destination })
    }

    const mode = 'date'

    return (
        
        <View style={styles.container}>

            <View style={styles.circle}>
                <LinearGradient colors={['#0352A0', '#0466c8', '#238ffb']} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
                </LinearGradient>
            </View>

            {/* <View style={styles.circlePosition}></View> */}
            <View style={styles.componentContainer}>
                <View style={{ padding: '4%' }}>
                    <Text style={{ fontSize: 16, color: '#535454', fontFamily: 'Inter_400Regular' }}>Where do you want to go?</Text>
                </View>
                <View style={styles.line}></View>
                <View style={styles.routeContainer}>
                    <View style={{ marginTop: Dimensions.get('screen').height * 0.03 }}>

                        {/* pass down onfocus isvisible setter AND placeholder through routeinput component and when isvisible, open modal of routedropdown */}
                        <View style={{ width: '90%' }}>
                            <DummyRouteInput
                                placeholder="from"
                                setValueName={setPlaceholderFrom}
                                setID={setOriginID}
                                valueName={placeholderFrom}
                                setIsVisible={() => setFromIsVisible(true)}
                            />
                        </View>
                        {/* <RouteDropDown placeholder="from" setID={setOriginID} setValueName={setPlaceholderFrom} valueName={placeholderFrom} /> */}
                    </View>



                    <View style={{ marginBottom: Dimensions.get('screen').height * 0.05 }}>
                        {/* <Text style={{ fontSize: 20 }}>Where are you driving to?</Text> */}

                        {/* <RouteDropDown placeholder="to" setID={setDestinationID} setValueName={setPlaceholderTo} valueName={placeholderTo} onFocus={() => console.log('hi')} /> */}

                        <View style={{ width: '90%' }}>
                            <DummyRouteInput
                                placeholder="to"
                                setValueName={setPlaceholderTo}
                                setID={setDestinationID}
                                valueName={placeholderTo}
                                setIsVisible={() => setToIsVisible(true)}
                            />
                        </View>

                    </View>
                </View>


                {/* <View style={styles.line}></View> */}

                <View style={{ paddingHorizontal: '4%', paddingTop: '4%' }}>
                    <Text style={{ fontSize: 16, color: '#535454', fontFamily: 'Inter_400Regular', paddingBottom: '4%' }}>When are you leaving?</Text>
                </View>

                <View style={styles.line}></View>

                <View style={styles.datetime}>
                 {show && (<DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minuteInterval={15}
                />
                )}
            </View>


            <View style={styles.line}></View>

                <View style={{ alignSelf: 'center' }}>

                    <NextButton disabled={origin.longitude !== null && destination.longitude !== null ? false : true} text="Find Driver" onPress={onGoPress} />
                </View>
            </View>


            {fromIsVisible ?
                (
                    // <View style={styles.flatListView}>
                    /* <Button title="-" onPress={() => setIsVisiblePassengers(false)} /> */
                    <Modal animationType="fade"
                        transparent={true}
                        visible={true}
                    >
                        <View style={styles.centredView}>

                            <View style={styles.inputModal}>
                                <View>
                                    <RouteDropDown
                                        placeholder="from"
                                        setID={setOriginID}
                                        setValueName={setPlaceholderFrom}
                                        valueName={placeholderFrom}
                                        modalClose={setFromIsVisible}
                                    />
                                    <Button title="close" onPress={() => setFromIsVisible(false)} />
                                </View>
                            </View>

                        </View>
                    </Modal>
                    /* </View> */
                ) : null}

            {toIsVisible ?
                (
                    // <View style={styles.flatListView}>
                    /* <Button title="-" onPress={() => setIsVisiblePassengers(false)} /> */
                    <Modal animationType="fade"
                        transparent={true}
                        visible={true}
                    >
                        <View style={styles.centredView}>

                            <View style={styles.inputModal}>
                                <View>
                                    <RouteDropDown
                                        placeholder="to"
                                        setID={setDestinationID}
                                        setValueName={setPlaceholderTo}
                                        valueName={placeholderTo}
                                        modalClose={setToIsVisible}
                                    />
                                    <Button title="close" onPress={() => setToIsVisible(false)} />
                                </View>
                            </View>

                        </View>
                    </Modal>
                    /* </View> */
                ) : null}


        </View>
        
    )
}

const styles = StyleSheet.create({
    routeInputFields: {
        // backgroundColor: '#fff',
        height: Dimensions.get('window').height * 0.15,
        justifyContent: 'center',
    },
    datetime: {
        padding: '3%',
        justifyContent: 'center',
        //marginBottom: '5%',
        height: Dimensions.get('window').height * 0.1,
    },
    list: {
        height: 300
    },
    line: {
        borderBottomWidth: 1,
        width: '85%',
        borderColor: 'lightgrey',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    },
    routeContainer: {
        height: Dimensions.get('window').height * 0.25,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    componentContainer: {
        height: Dimensions.get('window').height * 0.65,
        width: Dimensions.get('screen').width * 0.9,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        backgroundColor: 'white',
    },
    container: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        shadowOffset: {
            height: 3,
            width: -3
        },
        shadowRadius: 5,
        shadowColor: '#0352A0',
        shadowOpacity: 0.3
    },
    inputModal: {
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
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        flex: 1
    },
    circle: {
        width: 800,
        height: 800,
        borderRadius: 800 / 2,
        backgroundColor: "#0470DC",
        marginBottom: Dimensions.get("window").height * 1,
        position: 'absolute',
        top: -500,
        overflow: 'hidden'
    },
    linearGradient: {
        flex: 1
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center",
        //marginTop: 22,
        //height: Dimensions.get('window').height * 0.4
    },
})

export default PassengerRoute