import React, { useState, useEffect } from 'react';
import { Dimensions, Text, ScrollView, Modal, StyleSheet, View, Button, TouchableWithoutFeedback, Pressable, TextInput } from 'react-native'
import NextButton from '../components/Buttons/NextButton';
import RouteDropDown from '../components/RouteDropDown';
import DummyRouteInput from '../components/DummyRouteInput';

//reconstruct driverRoute as components, not screens. 

//make request at start that determines if stripe register component shows up. 


const DriverRouteOne = (props) => {
    const {
        setStage,
        stages,
        setOriginLatitude,
        setOriginLongitude,
        setDestinationLatitude,
        setDestinationLongitude,
        setOriginName,
        setDestinationName,
        origin,
        destination,
        setDistance,
        token
    } = props;

    const [placeholderFrom, setPlaceholderFrom] = useState(null)
    const [placeholderTo, setPlaceholderTo] = useState(null)

    const [fromIsVisible, setFromIsVisible] = useState(false)
    const [toIsVisible, setToIsVisible] = useState(false)

    const [originID, setOriginID] = useState(null)
    const [destinationID, setDestinationID] = useState(null)


    useEffect(() => {

        if (originID !== null) {

            getCoords(originID).then((data) => {
                setOriginLatitude(data.location.lat)
                setOriginLongitude(data.location.lng)
                setOriginName(data.name)
            }).catch((e) => console.log(e))

        } else {
            setOriginLatitude(null)
            setOriginLongitude(null)
            setOriginName(null)
        }


        if (destinationID !== null) {

            getCoords(destinationID).then(data => {
                setDestinationLatitude(data.location.lat)
                setDestinationLongitude(data.location.lng)
                setDestinationName(data.name)
            }).catch((e) => console.log(e))
        } else {
            setDestinationLatitude(null)
            setDestinationLongitude(null)
            setDestinationName(null)
        }

    }, [destinationID, originID]);


    const getCoords = async (place_id) => {
        try {

            const response = await fetch(`http://192.168.1.142:8081/locations/coords/${place_id}`, {
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


    const onNextPress = async () => {
        try {

            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const body = { origin, destination }

            const response = await fetch(`http://192.168.1.142:8081/locations/distance`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            await setDistance(parseRes.distance / 1000)

            // setOriginID(null)
            // setDestinationID(null)
            // setOriginName()
            // setDestinationName()
            // setPlaceholderFrom()
            // setPlaceholderTo()

            await setStage(stages.ROUTE_TWO)

            

        } catch (error) {
            console.log(error.message)
        }
    }



    return (
        <View>
            
            <View style={styles.componentContainer}>
                <View style={{ padding: '4%' }}>
                    <Text style={{ fontSize: 20, color: '#535454', fontFamily: 'Inter_400Regular' }}>Where are you driving?</Text>
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


                <View style={styles.line}></View>
                <View style={{ alignSelf: 'center' }}>

                    <NextButton disabled={origin.longitude !== null && destination.longitude !== null ? false : true} text="next" onPress={onNextPress} />
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
        // {/* </View> */}
    );
};

const styles = StyleSheet.create({
    addressSearch: {
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').width * 1,
    },
    searchBarOne: {
        flex: 1,
    },
    searchBarTwo: {
        flex: 1,
    },
    line: {
        borderBottomWidth: 0.5,
        width: '85%',
        borderColor: '#0352A0',
        alignSelf: 'center',
        // marginBottom: Dimensions.get('screen').height * 0.01
    },
    routeContainer: {
        height: Dimensions.get('window').height * 0.25,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    componentContainer: {
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('screen').width * 0.9,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        backgroundColor: 'white'
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
        shadowOpacity: 0.3,
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center",
        //marginTop: 22,
        //height: Dimensions.get('window').height * 0.4
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
      }
})

export default DriverRouteOne;