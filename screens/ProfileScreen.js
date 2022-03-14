import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { LOGGED_OUT } from '../store/actions/authentication';
import { Avatar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
import ProfileComponent from '../components/ProfileComponent';
import * as Linking from 'expo-linking';
import AddProfilePicture from '../components/AddProfilePicture';
import PhoneChange from '../components/PhoneChange';

const ProfileScreen = ({ route, navigation }) => {

    // const [userInfo, setUserInfo] = useState('')
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [profilePicture, setProfilePicture] = useState('empty')
    const [rating, setRating] = useState('')
    const [completed, setCompleted] = useState('')
    const [category, setCategory] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [showPhone, setShowPhone] = useState(false);

    // console.log(route.params.setSigned)


    const token = useSelector(state => state.authorisation.userToken);

    const dispatch = useDispatch()

    const getUserData = async () => {
        try {
            //only render the myLifts section if User category (fetch from backend) is driver
            const response = await fetch("https://spareseat-app.herokuapp.com/dashboard/", {
                method: "GET",
                headers: { token: token }
            });

            const parseRes = await response.json()


            console.log(parseRes.user_account)


            setFirstname(parseRes.userData.user_firstname);
            setSurname(parseRes.userData.user_surname);
            setEmail(parseRes.userData.user_email)
            setPhoneNumber(parseRes.userData.phone_number)
            setProfilePicture(parseRes.userData.profile_picture)
            setRating(parseRes.rating)
            setCompleted(parseRes.completed)
            setCategory(parseRes.userData.user_account)



            //handle this in an 'action/case'

            /* if parseRes.rows.useraccount = passenger or if redux variable = passenger return */

            //when passenger, there arent any 'my lifts available and so the user info is undefined

        } catch (error) {
            console.log(error.message)
        }
    };


    const linkToStripe = async() => {
        // TEST THIS LOGIC!!!

        try {

            const response = await fetch("https://spareseat-app.herokuapp.com/payment/stripelink", {
                method: "GET",
                headers: { token: token }
            });

            const parseRes = await response.json()

            if(typeof parseRes === 'object') {
                // follow the link out of the app
                Linking.openURL(parseRes.url)
            } else {
                Alert.alert(response)
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }

            

    const changeProfilePic = async () => {
        try {

            const newChoice = await AddProfilePicture()

            setProfilePicture(newChoice.url)

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "mutipart/form-data");
            myHeaders.append("token", token);

            const formdata = new FormData()

            // handle different picture formats
            formdata.append('newpic', {
                uri: newChoice.url,
                type: 'image/jpg',
                name: `${firstname}${surname}.jpg`
            });
            
            await fetch("https://spareseat-app.herokuapp.com/auth/changepic", {
                method: "PUT",
                headers: myHeaders,
                body: formdata
            });

        } catch (error) {
            console.log(error.message)
        }
    }


    const changePhoneNo = async (newPhone) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "mutipart/form-data");
            myHeaders.append("token", token);

            const response = await fetch(`https://spareseat-app.herokuapp.com/auth/changephone/${newPhone}`,{
                method: "PUT",
                headers: myHeaders
            });

            const parseRes = await response.json()

            setPhoneNumber(parseRes)

            setShowPhone(false)
            
        } catch (error) {
            console.log(error.message)
        }
    }


    const goPressHandler = async () => {
        dispatch({ type: LOGGED_OUT })
    };


    useEffect(() => { getUserData() }, []);


    return (
        <View style={styles.screenContainer}>
            <View style={styles.topContainer}>
                <View>
                    <TouchableOpacity onPress={
                        async() => {
                            setDisabled(true)
                            await changeProfilePic()
                            setDisabled(false)
                        }
                    } disabled={disabled}>
                    <Avatar
                        rounded
                        size='xlarge'
                        source={{
                            uri:
                                profilePicture !== undefined ? profilePicture : 'empty',
                        }}
                    />
                    </TouchableOpacity>
                </View>

                <Text style={styles.name}>{firstname} {surname}</Text>
                <View style={styles.topMidContainer}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.regularText}>Completed lifts:</Text>
                        <Text style={styles.numberSize}>{completed}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <Text style={styles.regularText}>Driver rating:</Text>
                        <Text style={styles.numberSize}>{rating ? JSON.parse(rating).toFixed(1) : '---'}</Text>
                    </View>
                </View>

            </View>
            <View style={styles.bottomContainer}>
                <View>
                    <ProfileComponent text={email} />
                    <ProfileComponent text={phoneNumber} onPress={() => setShowPhone(true)}/>
                    {category === "driver" ? (
                    <ProfileComponent text="Stripe Dashboard" onPress={linkToStripe}/>
                    ) : (
                        null
                    )}
                    <ProfileComponent text="Terms and Conditions" />
                    <ProfileComponent text="Privacy policy" />
                    <ProfileComponent text="Log out" onPress={goPressHandler}/>

                </View>
            </View>

            {showPhone ?
                (
                    // <View style={styles.flatListView}>
                    /* <Button title="-" onPress={() => setIsVisiblePassengers(false)} /> */
                    <Modal animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.")
                        }}>
                        <View style={styles.centredView}>

                            <View style={styles.QRmodal}>
                                
                                    <PhoneChange 
                                    closeModal={() => setShowPhone(false)}
                                    changePhone={changePhoneNo}
                                    />
                                
                            </View>

                        </View>
                    </Modal>
                    /* </View> */
                ) : null}
        </View>
    )

}

const styles = StyleSheet.create({
    screenContainer: {
        alignItems: 'center',
        // justifyContent: 'center',
        //padding: 20,
        flex: 1,
        //height: Dimensions.get('window').height * 0.7,
        //width: Dimensions.get('screen').width * 1,
        shadowOffset: {
            height: 2,
            width: 0
        },
        shadowRadius: 15,
        shadowOpacity: 0.3
    },
    QRmodal: {
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
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: Dimensions.get('window').height * 0.4,
        width: Dimensions.get('window').width * 0.95,
        justifyContent: 'center'
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.5,
        backgroundColor: 'white',
        width: Dimensions.get('screen').width * 1,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    bottomContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: '2%'
    },
    topMidContainer: {
        flexDirection: 'row'
    },
    name: {
        fontSize: 25,
        fontFamily: 'Inter_600SemiBold',
        padding: '3%',
        color: '#0352A0'
    },
    centredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
        height: Dimensions.get('window').height * 0.4
    },
    statsContainer: {
        alignItems: 'center',
        width: '50%',
        marginTop: Dimensions.get('window').height * 0.05
    },
    emailFont: {
        fontSize: 18,
        fontWeight: '500',
        padding: '1%'
    },
    numberSize: {
        fontSize: 40,
        fontFamily: 'Inter_700Bold',
        color: '#0352A0'
    },
    regularText: {
        fontFamily: 'Inter_200ExtraLight'
    },
    line: {
        borderBottomWidth: 0.5,
        width: Dimensions.get('screen').width * 1,
        borderColor: 'grey',
        padding: '1%',
        marginLeft: '6%'
    }
})

export default ProfileScreen;