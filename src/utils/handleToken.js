const KEY='token'
export function saveTokenObj(token) {
    localStorage.setItem(KEY, JSON.stringify(token))
}

export function getTokenObj() {
    return JSON.parse(localStorage.getItem(KEY))
}

export function removeTokenObj() {
    localStorage.removeItem(KEY)
}