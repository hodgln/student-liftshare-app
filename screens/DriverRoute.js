const PasswordResetScreen = ({ navigation }) => {

    const stages = {
        STRIPE_SIGNUP: 'STRIPE_SIGNUP',
        ROUTE_ONE: 'ROUTE_ONE',
        ROUTE_TW0: 'ROUTE_TWO'
    }

    const [stage, setStage] = useState(stages.ENTER_EMAIL)
    const [email, setEmail] = useState()

    console.log(stage)

    return (
        <View style={styles.container}>
            <View style={styles.headerComponent}>
                <View style={styles.backButton}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>
            </View>

            <View style={styles.mainComponent}>
            <Text style={{fontWeight: '700', fontSize: 25}}>Password Reset</Text>
            <View>
            {stage === stages.ENTER_EMAIL &&
            <EnterEmail 
            setStage={setStage}
            stages={stages}
            setEmail={setEmail}
            email={email}
            />
           }
           {stage === stages.VALIDATE_CODE &&
            <ValidateCode
            setStage={setStage}
            stages={stages}
            email={email}
            />
           }
           {stage === stages.CHANGE_PASSWORD &&
            <ChangePassword
            email={email}
            navigation={navigation}
            />
           }
           </View>
            </View>
        </View>
    )
}

export default PasswordResetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '3%'
    },
    backButton: {
        alignSelf: 'flex-start',
        // width: '100%',,

    },
    headerComponent: {
        width: '100%',
        marginTop: Dimensions.get('window').height * 0.025,
        //alignItems: 'center',
        flexDirection: 'row'
    },
    mainComponent: {
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1
    }
});