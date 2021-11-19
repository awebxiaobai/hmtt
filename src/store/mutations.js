import {
    SET_TOKEN,
    GET_USER_INFO,
    DELETE_INFO,
    CHANGE_PROFILE,
    CHANGE_PHOTO,
    GET_USER_CHANNEL
} from "./mutation-types";
export default {
    [SET_TOKEN](state, { tokenObj }) {
        state.tokenObj = tokenObj
    },
    [GET_USER_INFO](state, { userInfo }) {
        state.userInfo = userInfo
    },
    [DELETE_INFO](state) {
        state.tokenObj = {}
        state.userInfo = {}
    },
    [CHANGE_PROFILE](state, { info }) {
        state.userInfo = {
            ...state.userInfo,
            ...info
        }
    },
    [CHANGE_PHOTO](state, { info }) {
        state.userInfo = {
            ...state.userInfo,
            ...info
        }
    },
    // [GET_USER_CHANNEL](state, { userChannels }) {
    //     state.userChannels = userChannels
    // }
}