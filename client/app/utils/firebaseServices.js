import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createUser = (userId) => {
    console.log("backend url:", BACKEND_URL)
    const payload = {
        "userId": String(userId)
    }
    return axios.post(`${BACKEND_URL}/users`, payload)
        .then(res => {
            console.log("res:", res.data)
            return res.data
        })
}