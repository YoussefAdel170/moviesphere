import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./features/movies/movieSlice";
import tvReducer from "./features/tv/tvSlice";

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    tv: tvReducer,
  },
});

// types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
