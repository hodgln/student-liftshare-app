import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Button, Dimensions, Modal } from 'react-native'
//import { BarCodeScanner, Permissions } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useSelector } from 'react-redux';
import ScanListCard from '../components/Cards/ScanListCard';
import DriverRatings from '../components/DriverRatings';
import CompleteButton from '../components/Buttons/CompleteButton';



const DriverCheckIn = ({ route }) => {

    const [QRdata, setQRdata] = useState()
    const [isVisibleRatings, setIsVisibleRatings] = useState(false)

    const { passengers, liftshare_id } = route.params

    const scannedPassengers = passengers.filter(item => item.scanned === true)

    const ids = passengers.map(index => index.user_id)

    const token = useSelector(state => state.authorisation.userToken);

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        handleBarCodeScanned()

        //remove above eventually
    }, []);

    const completeLift = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            await fetch(`http://api.spareseat.app/dashboard/completelift/${liftshare_id}`, {
                method: 'PUT',
                headers: myHeaders
            });

            // const parseRes = await response.json()

            // console.log(parseRes)


        } catch (error) {
            console.log(error.message)
        }

    }

    const payDriver = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const body = { liftshare_id, scannedPassengers }

            const response = await fetch(`http://api.spareseat.app/payment/paydriver/${liftshare_id}`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.text()

            console.log(parseRes)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    const completePress = async () => {

        const notScanned = passengers.filter(item => item.scanned === false)

        if(notScanned.length === 0) {

            await completeLift()
            await payDriver()
            
            setIsVisibleRatings(true)

        } else {

            for (const item of notScanned) {

                await noShow(item.request_id)
    
            }

            await completeLift()
            await payDriver()

            setIsVisibleRatings(true)

        }

    }

    const noShow = async (request_id) => {

        // write backend for this

        try {
            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://api.spareseat.app/dashboard/noshow/${request_id}`, {
                method: 'PUT',
                headers: myHeaders
            });

            const parseRes = await response.json()

            console.log(parseRes)



        } catch (error) {
            console.log(error.message)
        }
    }

    // const handleBarCodeScanned = async({ type, data }) => {
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);

        // const id = "d6cfb7c0-4918-4996-b02d-71da4b691f1c"

        // add in route that checks user id with data, function iterates through the data and checks each userid with the current one. 

        // add in api post request for stripe to capture payment

        try {

            if (ids.includes(data)) {
                //pass in data param
                const objIndex = passengers.findIndex((obj => obj.user_id === data));


                passengers[objIndex].scanned = true
                // filter where user_id = data
                //change value of scanned to true
                //confirm passenger

                //payment here?


            } else {
                console.log("this user is not included in the lift")
            }

            // if (passengers.every(item => item.scanned === true)) {
    
            //     await completeLift()

            // }

        } catch (error) {
            console.log(error.message)
        }

        //add all in same request

        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };


    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // useEffect(() => handleBarCodeScanned(), [])

    const renderPassenger = ({ item }) => {
        return (
            <ScanListCard
                firstname={item.user_firstname}
                surname={item.user_surname}
                scanned={item.scanned}
                picture={item.profile_picture}
                price={item.driverprice}
                request_id={item.request_id}
                passengers={passengers.length}
            />
        )
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            {passengers.length !== 0 ?
                (
                    <View>
                        <View>

                            <View style={styles.cameraContainer}>
                                <BarCodeScanner
                                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                    style={StyleSheet.absoluteFillObject}
                                />
                                {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
                            </View>
                            <Text style={{ padding: '1%', alignSelf: 'center' }}>Scan to check in passengers</Text>
                            {/* <Button title="press" onPress={handleBarCodeScanned}/> */}
                        </View>
                        <View style={styles.listContainer}>
                            <View style={{ flex: 1 }}>
                            <FlatList
                                style={styles.flatlist}
                                data={passengers}
                                renderItem={renderPassenger}
                                keyExtractor={item => JSON.stringify(item.user_id)}
                            />
                            </View>
                            <View>
                                <CompleteButton text="Complete Lift" onPress={() => completePress()}/>
                            </View>
                        </View>

                        {
                            isVisibleRatings ?

                                (<Modal animationType="slide"
                                    transparent={true}
                                    visible={true}
                                    onRequestClose={() => {
                                        Alert.alert("Modal has been closed.")
                                    }}>
                                    <View style={styles.centredView}>
                                        <DriverRatings passengers={scannedPassengers} liftshare_id={liftshare_id} setIsVisibleRatings={setIsVisibleRatings} />
                                    </View>

                                </Modal>) : null}
                    </View>
                )
                :
                (
                    <View>
                        <Text>You do not have any passengers for this lift</Text>
                    </View>
                )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.3,
        width: Dimensions.get('screen').width * 0.8,
        // alignSelf: 'center',
        marginTop: '10%',
        //flex: 1,
        //flexDirection: 'column',
        justifyContent: 'center',
    },
    listContainer: {
        height: Dimensions.get('window').height * 0.42,
        width: Dimensions.get('screen').width * 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlist: {
        alignSelf: 'center'
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.7
    }
})

export default DriverCheckIn;