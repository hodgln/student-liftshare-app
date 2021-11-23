
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, Linking, Image, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';

import moment from 'moment';
import RouteDisplay from '../RouteDisplay';
import ContactDisplay from '../ContactDisplay';
import StatusDisplay from '../StatusDisplay';

const PassengerCard = (props) => {


    const dateFormat = new Date(props.date)

    const token = useSelector(state => state.authorisation.userToken);

    const navigation = useNavigation();

    const [confirmedRequests, setConfirmedRequests] = useState();

    const [isActive, setIsActive] = useState(true)
    const [map, setMap] = useState()


    // const isFocused = useIsFocused()

    const urlpath = "https://maps.googleapis.com/maps/api/staticmap?&size=400x400&path=weight:3%7Ccolor:0x0352A0CC%7Cenc%3AohqfIc_jpCkE%7DCx%40mJdDa%5BbD%7BM%7D%40e%40_MgKiQuVOoFlF%7DVnCnBn%40aDlDkN%7DDwEt%40%7DM%7DB_TjBy%7C%40lEgr%40lMa%60BhSi%7C%40%7COmuAxb%40k%7BGh%5E_%7BFjRor%40%7CaAq%7DC~iAomDle%40i%7BA~d%40ktBbp%40%7DqCvoA%7DjHpm%40uuDzH%7Dm%40sAg%7DB%60Bgy%40%7CHkv%40tTsxAtCgl%40aBoeAwKwaAqG%7B%5CeBc_%40p%40aZx%60%40gcGpNg%7CBGmWa%5CgpFyZolF%7BFgcDyPy%7CEoK_%7BAwm%40%7BqFqZaiBoNsqCuNq%7BHk%60%40crG%7B%5DqkBul%40guC%7BJ%7D%5DaNo%7B%40waA%7DmFsLc_%40_V%7Dh%40icAopBcd%40i_A_w%40mlBwbAiiBmv%40ajDozBibKsZ%7DvAkLm%5DysAk%7DCyr%40i%60BqUkp%40mj%40uoBex%40koAk_E_hG%7B%60Ac%7DAwp%40soAyk%40ogAml%40%7Bg%40qKsNeJw%5DeuA%7D%60Fkm%40czBmK%7Bg%40wCed%40b%40_e%40dT%7BgCzx%40csJrc%40ejFtGi%60CnB_pFhCa%60Gw%40%7Du%40wFwaAmP%7BoA%7Dj%40etBsRm_AiGos%40aCyy%40Lic%40tFohA~NeoCvC_%7CAWm~%40gb%40w~DuLex%40mUk_Ae_%40o_Aol%40qmAgv%40_%7DAaf%40qhAkMcl%40mHwn%40iCuq%40Nqi%40pF%7D%7CE~CyiDmFkgAoUedAcb%40ku%40ma%40cl%40mUko%40sLwr%40mg%40awIoA_aApDe~%40dKytAfw%40kyFtCib%40%7DA%7Bj%40kd%40usBcRgx%40uFwb%40%7BCulAjJmbC~CumAuGwlA_%5Du_C_PqyB%7BI%7DiAwKik%40%7DUcr%40ya%40up%40%7DkB%7DoCoQ%7Da%40aMyf%40an%40wjEimBuwKiYybC%7DLuyBoJ%7DhBuMieAwd%40i%7BB%7B~%40g%60D_Si%5Dsi%40%7Bk%40cPeSuH_T%7DNct%40kNcmC_Gyr%40mq%40_~AkmA%7DkCksByrE_N%7Bc%40oAcs%40%60J%7Bi%40t%7DByaHxNqt%40tGgxA%7CJ%7BkGeJ_aDsQi_HmFwuAmI%7BdA_XijByFgv%40%7DAiwBxDocAdM%7BlAtSmcAfUmaAptAmbGh~AcvGbwBc%7DHff%40shB~Isp%40nQu%7DB%60UsuCbBok%40l%40%7DzAhIwbA~OuaAnYwp%40rYwe%40%7CNke%40zc%40%7BhBrOwRdo%40sf%40xNaTb_%40uy%40ta%40k~%40xTap%40hl%40uiCre%40unHlIi~AlFsc%40rEkk%40aAce%40mL%7DlAwPcyB_GohBzDsqAtMqtA~h%40weDtFkd%40Bi%60%40_XwfEdAag%40dEkM%60%40zAqApJef%40%7BP_o%40sYys%40ai%40yf%40_j%40y_%40oi%40mVi%5EmFqSwAiPtDuQbc%40_nAtZyaAlEkc%40r%40eq%40%7CAo%5BrTwcAtVuz%40vQ%7Dd%40%7CPmb%40xT%7B%5CzZyd%40jG%7BRzL%7Dh%40jr%40ov%40rFiImFqPiD%7BJ&key=AIzaSyAABf0pH3xmQE_riwJXkrazEQADU0fqEss&map_id=76404385f094ea10"

    const getMapImg = async (urlpath) => {
        try {
            const body = { urlpath }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const response = await fetch("http://192.168.1.142:8081/locations/signurl", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            setMap(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }

    const getPolyline = async (origin, destination) => {
        try {

            const body = { origin, destination }

            console.log(origin, destination)

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);


            const response = await fetch("http://192.168.1.142:8081/locations/distance", {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            const encodeParseRes = encodeURIComponent(parseRes.route)

            return (
                `https://maps.googleapis.com/maps/api/staticmap?&size=500x500&path=weight:6%7Ccolor:0x0352A0CC%7Cenc:${encodeParseRes}&key=AIzaSyAABf0pH3xmQE_riwJXkrazEQADU0fqEss&map_id=76404385f094ea10`
            )

        } catch (error) {
            console.log(error.message)
        }
    }

    //add in below function to above useEffect

    // const dateHandler = () => {if(dateFormat === new Date()) {
    //     setIsActive(true)
    // // } else {
    // //     setIsActive(false)
    // // }
    // }
    // }

    useEffect(() => {
        const mapHandler = async() => {
        const polyline = await getPolyline(
            { latitude: props.origin.y, longitude: props.origin.x },
            { latitude: props.destination.y, longitude: props.destination.x }
        );
        getMapImg(polyline)
        }
        mapHandler()
    }, [])

    // const mapHandler = async () => {
    //     const polyline = await getPolyline(
    //         { latitude: props.origin.y, longitude: props.origin.x },
    //         { latitude: props.destination.y, longitude: props.destination.x }
    //     );
    //     getMapImg(polyline)
    // }

    const {
        from,
        to,
        firstname,
        surname,
        status,
        price,
        picture,
        requestid,
        liftid,
        phone,
        isFocused,
        setCancelled,
    } = props



    const priceHandler = (price) => {
        if (confirmedRequests != 0) {
            return `£${((price / confirmedRequests) + 0.5).toFixed(2)}`
        } else {
            return `£${price.toFixed(2)}`
        }
    }

    const messagePressHandler = async () => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", token);

            const response = await fetch(`http://192.168.1.142:8081/conversation/passengerconvo/${liftid}`, {
                method: "GET",
                headers: myHeaders
            });

            const parseRes = await response.json()

            navigation.navigate('Chat', {
                firstname: firstname,
                surname: surname,
                from: from,
                to: to,
                convo_id: parseRes[0].conversation_id,
                user_id: parseRes[0].passenger_id
            });
        } catch (error) {
            console.log(error.message)
        };
        //console.log(convoID)
    }
     


    
    // if seats >= 0 ... use ternary operator
    //send 'price change' notification if no. confirmed requests = >2 
    return (
        <View style={{ flex: 1 }}>
            {map === undefined ? null : (<ImageBackground style={styles.Image} source={{ uri: map }} />)}
            <View style={styles.backgroundContainer}>
                <View style={styles.container}>

                    <View style={{ width: '91%', flexDirection: 'row', paddingTop: '3%', paddingHorizontal: '3%' }}>
                        <RouteDisplay
                            from={from}
                            to={to}
                            time={moment(dateFormat).format('HH:mm')}
                            date={isActive ? "Today" : moment(dateFormat).format('ddd Do MMM')}
                            price={priceHandler(price)}
                        />

                    </View>
                    {/* <Button title="message driver" onPress={messagePressHandler}/> : null} */}

                    <View style={styles.line}></View>

                    <View style={styles.column}>

                        <ContactDisplay
                            picture={picture}
                            firstname={firstname}
                            surname={status === "confirmed" ? surname : ""}
                            phone={phone}
                        />

                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PhoneButton disabled={false} onPress={() => Linking.openURL(`tel:${phone}`)} text="call" type="fill" />
                    <PhoneButton disabled={false} onPress={() => Linking.openURL(`sms:${phone}`)} text="text" type="border" />
                </View> */}


                        {/* <Text style={{ fontSize: 17, fontWeight: '600', padding: '2%' }}>{firstname} {surname}</Text>
                    {status === "confirmed" ? <Text style={{ fontSize: 18, fontWeight: '700', padding: '1%' }}>{phone}</Text> : null} */}
                    </View>
                    <View style={styles.line}></View>
                    <StatusDisplay
                        liftid={liftid}
                        status={status}
                        setConfirmedRequests={setConfirmedRequests}
                        requestid={requestid}
                        isFocused={isFocused}
                        isActive={isActive}
                        navigation={navigation}
                        setCancelled={setCancelled}
                    />
                </View>
            </View>
        </View>
    )
}

//pass props to the messaging screen

//think about passing in props as function parameters if its not working

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        borderRadius: 20,
        borderWidth: 0.1,
        backgroundColor: 'white',

        alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: Dimensions.get('window').height * 0.02,
        alignSelf: 'center'

    },
    column: {
        justifyContent: 'center',
        //alignItems: 'center',
        // width: '90%',,
        marginTop: '3%'
    },
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 0.75,
        borderColor: 'grey',
        padding: '1%',
        marginVertical: '1.5%',
    },
    verticalLine: {
        height: Dimensions.get('window').height * 0.08,
        width: 0.5,
        backgroundColor: '#909090',
        //justifyContent: 'center',

    },
    Image: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: -1,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('screen').width * 1
    },
    backgroundContainer: {
    flex: 1, 
    justifyContent: 'flex-end', 
    shadowOffset: {
        height: 3,
        width: -3
    },
    shadowRadius: 2,
    //shadowColor: 'black',
    shadowOpacity: 0.15
}
})

export default PassengerCard;
