import request from "./request"

export function login(data) {
    return request.post("/users/login", data)
}

export function register(data) {
    return request.post("/users/register", data)
}

export function getUser(id) {
    return request.get(`/users/${id}`)
}

export function updateUser(id, data) {
    return request.put(`/users/${id}`, data)
}
