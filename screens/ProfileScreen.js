import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, Dimensions, FlatList } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux'
import { LOGGED_OUT } from '../store/actions/authentication';
import { Avatar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'; 

const ProfileScreen = (props) => {

    const [isShowing, setIsShowing] = useState(false);
    const [userInfo, setUserInfo] = useState('')
    const [urlEnding, setUrlEnding] = useState()


    const token = useSelector(state => state.authorisation.userToken);

    const dispatch = useDispatch()

    const getUserData = async () => {
        try {
            //only render the myLifts section if User category (fetch from backend) is driver
            const response = await fetch("http://localhost:8081/dashboard/", {
                method: "GET",
                headers: { token: token }
            });

            const parseRes = await response.json()



            setUserInfo(parseRes[0]);

            //handle this in an 'action/case'

            /* if parseRes.rows.useraccount = passenger or if redux variable = passenger return */

            //when passenger, there arent any 'my lifts available and so the user info is undefined

        } catch (error) {
            console.log(error.message)
        }
    };

    const goPressHandler = () => {
        //props.navigation.navigate("Choice")
        dispatch({ type: LOGGED_OUT })
    };


    useEffect(() => { getUserData() }, []);


    return (
        <View style={styles.screenContainer}>
            <View style={styles.topContainer}>
                <View>
                    <Avatar
                        rounded
                        size='xlarge'
                        source={{
                            uri:
                                userInfo.profile_picture,
                        }}
                    />
                </View>

                <Text style={styles.name}>{userInfo.user_firstname} {userInfo.user_surname}</Text>
                <View style={styles.topMidContainer}>
                    <View style={styles.statsContainer}>
                        <Text>Completed lifts:</Text>
                        <Text style={styles.numberSize}>3</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <Text>Driver rating:</Text>
                        <Text style={styles.numberSize}>89%</Text>
                    </View>
                </View>

            </View>
            <View style={styles.bottomContainer}>
                <View>
                    <View style={{ flexDirection: "row", padding: '2%' }}>
                        <Ionicons name="mail-outline" size={24} color="black" />
                        <Text style={styles.emailFont}>: {userInfo.user_email} </Text>
                    </View>
                    <View style={{ flexDirection: "row", padding: '2%' }}>
                        <Ionicons name="call-outline" size={24} color="black" />
                        <Text style={styles.emailFont}>: {userInfo.phone_number}</Text>
                    </View>
                    <Button title="log out" onPress={goPressHandler} />
                </View>
            </View>
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
    },
    topMidContainer: {
        flexDirection: 'row'
    },
    name: {
        fontSize: 25,
        fontWeight: '600',
        padding: '3%'
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
        fontWeight: '700',
        fontSize: 40
    }
})

export default ProfileScreen;