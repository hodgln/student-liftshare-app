 export const LOGGED_IN = 'LOGGED_IN';

 export const LOGGED_OUT = 'LOGGED_OUT';


export const loggedIn = () => {
    return({ type: LOGGED_IN, token: token, category: category  })
};

export const loggedOut = () => {
    return({ type: LOGGED_OUT })
}