import { DESTINATION_CLICKED, ORIGIN_CLICKED, HOME_CLICKED, ORIGINNAME_CLICKED, DESTINATIONNAME_CLICKED, DISTANCE_BETWEEN } from '../actions/locations'
import { LOGGED_OUT } from '../actions/authentication';

const initialState = {
    origin: '',
    destination: '',
    originName: '',
    destinationName: '',
    distance: ''
}



const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ORIGIN_CLICKED:
            return ({
                ...state,
                origin: action.payload,
            })
        case DESTINATION_CLICKED:
            return ({
                ...state,
                destination: action.payload
            })
        case HOME_CLICKED:
            return ({
                origin: '',
                destination: ''
            })
        case ORIGINNAME_CLICKED:
            return ({
                ...state,
                originName: action.payload
            })
        case DESTINATIONNAME_CLICKED:
            return ({
                ...state,
                destinationName: action.payload
            })
        case DISTANCE_BETWEEN: 
            return ({
                ...state,
                distance: action.payload
            })
        case LOGGED_OUT:
            return ({
                origin: '',
                destination: ''
            })
        default: return state
    }
}

export default locationReducer;