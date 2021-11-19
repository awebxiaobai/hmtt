import {
    SET_TOKEN,
    GET_USER_INFO,
    DELETE_INFO,
    CHANGE_PROFILE,
    CHANGE_PHOTO,
    // GET_USER_CHANNELs,
} from "./mutation-types"
import { reqChangePhoto, reqChangeProfile, reqGetUserChannel, reqUserInfo } from "../api/index"
import { removeTokenObj, saveTokenObj } from "../utils/handleToken"
export default {
    // 同步记录TokenObj
    recordTokenObj({ commit }, tokenObj) {
        saveTokenObj(tokenObj)
        commit(SET_TOKEN, { tokenObj })
    },
    // 异步读取用户信息
    async getUserInfo({ commit }, callback) {
        try {
            const userInfoData = await reqUserInfo()
            commit(GET_USER_INFO, { userInfo: userInfoData.data })
        } catch {
            callback && callback()
        }
    },
    // 同步退出登录
    deleteInfo({ commit }, callback) {
        removeTokenObj()
        commit(DELETE_INFO)
        callback && callback()
    },
    // 异步修改用户信息
    async changeProfile({ commit }, info) {
        await reqChangeProfile(info)
        commit(CHANGE_PROFILE, { info })
    },
    // 异步上传并更改头像信息
    async changePhoto({ commit }, file) {
        const result=await reqChangePhoto(file)
        commit(CHANGE_PHOTO,{info:result.data})
    },
    // 异步获取用户频道
    // async getUserChannels({commit}){
    //     const result=await reqGetUserChannel()
    //     commit(GET_USER_CHANNEL,{userChannels:result.data.channels})
    // }
}