import request from "./request"

export function getDevices(userId) {
    return request.get("/devices", { params: { userId } })
}

export function addDevice(userId, data) {
    return request.post("/devices", data, { params: { userId } })
}

export function updateDevice(id, data) {
    return request.put(`/devices/${id}`, data)
}

export function deleteDevice(id) {
    return request.delete(`/devices/${id}`)
}

export function getDevice(id) {
    return request.get(`/devices/${id}`)
}

export function getDeviceHealth(id) {
    return request.get(`/devices/${id}/health`)
}

export function saveDeviceHealth(id, data) {
    return request.post(`/devices/${id}/health`, data)
}

export function getDeviceEvents(id) {
    return request.get(`/devices/${id}/events`)
}

export function addDeviceEvent(id, data) {
    return request.post(`/devices/${id}/events`, data)
}

export function deleteDeviceEvent(id, eventId) {
    return request.delete(`/devices/${id}/events/${eventId}`)
}

export function getDeviceTotalCost(id) {
    return request.get(`/devices/${id}/total-cost`)
}
