import axios from "axios"

const BACKEND_URL = process.env.BACKEND_URL

export const createUser = (userId) => {
    axios.post(`${BACKEND_URL}/users`, {userId})
        .then(res => {
            return res.data
        })
}