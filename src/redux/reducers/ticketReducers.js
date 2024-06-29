import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  detailTicket: null,
  id: null,
  allPassenger: [],
  isLoading: false,
  error: null,
};

const ticketSlicer = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setDetailTicket: (state, action) => {
      state.detailTicket = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setAllPassenger: (state, action) => {
      state.allPassenger = action.payload;
    },
  },
});

export const { setDetailTicket, setId, setAllPassenger } = ticketSlicer.actions;

export default ticketSlicer.reducer;
