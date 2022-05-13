import { LOGGED_IN, LOGGED_OUT, REFRESH_TOKEN } from "../actions/authentication";

const initialState = {
    isLoggedIn: false,
    userToken: '',
    userCategory: null
};

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOGGED_IN: 
        return({
            ...state,
            userToken: action.token,
            userCategory: action.category,
            isLoggedIn: true
        });
        case LOGGED_OUT:
        return({
            userToken: null,
            userCategory: null,
            isLoggedIn: false
        });
        case REFRESH_TOKEN:
            return({
                ...state,
                userToken: action.token
            })
        default: return state;
    }
};

export default authReducer;
    