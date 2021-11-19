import ajax from "./ajax";

const BASE_URL = 'http://toutiao.itheima.net'
// 登录
export const reqLogin = (data) => ajax(BASE_URL + '/v1_0/authorizations', data, 'POST')
// 获取用户资料
export const reqUserInfo = () => ajax(BASE_URL + '/v1_0/user/profile')
// 更改用户信息
export const reqChangeProfile = (data) => ajax(BASE_URL + '/v1_0/user/profile', data, 'PATCH')
// 更改头像
export const reqChangePhoto = (data) => ajax(BASE_URL + '/v1_0/user/photo', data, 'PATCH')
// 获取用户频道
export const reqGetUserChannels = () => ajax(BASE_URL + '/v1_0/user/channels')
// 获取推荐文章新闻
export const reqGetArticleNews = (data) => ajax(BASE_URL + '/v1_0/articles', data)
// 获取新闻详情
export const reqGetNewsDetail = (data) => ajax(`${BASE_URL}/v1_0/articles/${data.article_id}`)
// 获取评论或回复
export const reqGetCommentOrBack = (data) => ajax(BASE_URL + '/v1_0/comments', data)
// 对文章或者评论进行评论
export const reqAddComments = (data) => ajax(BASE_URL + '/v1_0/comments', data, 'POST')
//获取所有频道列表
export const reqGetAllChannels = () => ajax(BASE_URL + '/v1_0/channels')
// 设置用户的频道（部分）
export const reqSetUserChannels = (data) => ajax(BASE_URL + '/v1_0/user/channels', data, 'PATCH')
// 删除指定用户频道
export const reqDeleteUserChannels = (data) => ajax(BASE_URL + `/v1_0/user/channels/${data}`, {}, 'DELETE')
// 获取联想建议
export const reqGetSuggestions = (data) => ajax(BASE_URL + '/v1_0/suggestion', data)
// 获取搜索结果
export const reqGetSearchResults = (data) => ajax(BASE_URL + '/v1_0/search', data)