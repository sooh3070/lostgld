// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import craftReducer from './craftSlice';

export const store = configureStore({
  reducer: {
    craft: craftReducer,
  },
});