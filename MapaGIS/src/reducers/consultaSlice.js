import { createSlice } from '@reduxjs/toolkit';

export const consultaSlice = createSlice({
    name: 'consulta',
    initialState: {
        consulta: [],
        status: null,
    },
    reducers: {
        setConsulta: (state, action) => {
            state.consulta = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        //clear
        clearConsulta: () => {
            state.consulta = [];
        },
    },
});

export const { setConsulta, setStatus, clearConsulta } = consultaSlice.actions;

export default consultaSlice.reducer;