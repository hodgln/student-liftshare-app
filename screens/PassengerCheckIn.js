import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, LayoutAnimation, Button } from 'react-native'
//import { BarCodeScanner, Permissions } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useSelector } from 'react-redux';


const PassengerCheckIn = ({ route }) => {

    const [QRdata, setQRdata] = useState();

    const { id } = route.params

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

    // const handleBarCodeScanned = async({ type, data }) => {
        const handleBarCodeScanned = async({ type, data }) => {
        setScanned(true);

        // add in route that checks user id with data, function iterates through the data and checks each userid with the current one. 

        // add in api post request for stripe to capture payment

        try {

            const idsArray = ["2fd33a1a-6248-4f20-9032-cd23f0145464", "e463495b-5a8f-4100-97bc-1ff3919913c4", "717d34c9-8b0c-4a95-83bd-bf273cbfa36f"]

            //pass in idsArray = data above when testing

            //"2fd33a1a-6248-4f20-9032-cd23f0145464"

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const body = { idsArray }

            const response = await fetch(`http://192.168.1.142:8081/payment/checkout/capture/${id}`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            console.log(parseRes)

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

    return (
        <View>
            <View style={styles.container}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
            </View>
            <Text>Scan to check in to lift</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '50%',
        width: '80%',
        alignSelf: 'center',
        marginTop: '10%',
        //flex: 1,
        //flexDirection: 'column',
        justifyContent: 'center',
    }
})

export default PassengerCheckIn;