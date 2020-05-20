import {LOGIN, LOGOUT, REGISTER} from './types'


export const LoginUser = data =>{
    localStorage.setItem('userInfo', JSON.stringify([data]))
    return {
        payload: data,
        type: LOGIN
    }
}

export const LogoutUser  = ()=>{
    localStorage.removeItem('userInfo');
    return {
        payload: {},
        type: LOGOUT
    }
}

export const RegisterUser = data =>{
    return{
        payload: data,
        type: REGISTER
    }
}