import { configureStore } from '@reduxjs/toolkit';
import numberPlateReducer from '../store/numberPlateSlice';

export const store = configureStore({
    reducer: {
        numberPlate: numberPlateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
