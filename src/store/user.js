import { defineStore } from "pinia"

import { login as loginApi, getUser, updateUser } from "../api/user"
import {
    getStoredUser,
    setStoredUser,
    clearStoredUser,
    displayNameOf
} from "../utils/session"

export const useUserStore = defineStore("user", {
    state: () => ({
        user: getStoredUser(),
        loading: false
    }),

    getters: {
        isLoggedIn: state => Boolean(state.user?.userId),
        userId: state => state.user?.userId || null,
        displayName: state => displayNameOf(state.user),
        initials: state => {
            const name = displayNameOf(state.user)
            return name ? name.slice(0, 1).toUpperCase() : "U"
        }
    },

    actions: {
        async login(payload) {
            const user = await loginApi(payload)
            this.setUser(user)
            return user
        },

        setUser(user) {
            this.user = user
            setStoredUser(user)
        },

        async fetchProfile() {
            if (!this.userId) return null
            this.loading = true
            try {
                const user = await getUser(this.userId)
                this.setUser(user)
                return user
            } finally {
                this.loading = false
            }
        },

        async saveProfile(payload) {
            if (!this.userId) throw new Error("登录状态已失效，请重新登录")
            const user = await updateUser(this.userId, payload)
            this.setUser(user)
            return user
        },

        logout() {
            this.user = null
            clearStoredUser()
        }
    }
})
