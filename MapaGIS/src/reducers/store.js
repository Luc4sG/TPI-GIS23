import { configureStore } from '@reduxjs/toolkit';
import consultaReducer from './consultaSlice';
import coordenadasReducer from './coordenadasSlice';

export default configureStore({
    reducer: {
        consulta: consultaReducer,
        coordenadas: coordenadasReducer,
    }
});

