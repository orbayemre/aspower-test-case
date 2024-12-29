import { configureStore } from '@reduxjs/toolkit'
import authStoreReducer from "./authStore";


export default configureStore({
    reducer: {
        authStore : authStoreReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
    }),
})
