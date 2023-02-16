import {defineStore} from "pinia";

// Option Store
export const userCreateStore = defineStore('user', {
    state: () => ({ count: 0 }),
    getters: {
        double: (state) => state.count * 2
    },
    actions: {
        increment() {
            this.count++
        },
    },
})