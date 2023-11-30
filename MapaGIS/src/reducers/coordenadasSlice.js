import { createSlice } from "@reduxjs/toolkit";

export const coordenadasSlice = createSlice({
    name: "coordenadas",
    initialState: {
        coordenadas: {}
    },
    reducers: {
        setCoordenadas: (state, action) => {
            state.coordenadas = action.payload;
        }
    }
});

export const { setCoordenadas } = coordenadasSlice.actions;

export default coordenadasSlice.reducer; 