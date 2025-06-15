// src/features/numberPlate/numberPlateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NumberPlate } from '../types/index';
import { numberPlateService } from '../services/api';

interface NumberPlateState {
    current: NumberPlate | null;
    loading: boolean;
    error: string | null;
}

const initialState: NumberPlateState = {
    current: null,
    loading: false,
    error: null,
};

export const fetchCurrentNumberPlate = createAsyncThunk<
    NumberPlate,              // ✅ return type on success
    void,                     // ✅ argument type (you're not passing any payload)
    {
        rejectValue: string     // ✅ custom error type on reject
    }
>(
    'numberPlate/fetchCurrent',
    async (_, thunkAPI) => {
        try {
            const data = await numberPlateService.getCurrentNumberPlate();
            return data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to fetch number plate');
        }
    }
);

const numberPlateSlice = createSlice({
    name: 'numberPlate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentNumberPlate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentNumberPlate.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(fetchCurrentNumberPlate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Unexpected error';
            });

    },
});

export default numberPlateSlice.reducer;
