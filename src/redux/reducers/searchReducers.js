import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fromDestination: "Tangerang",
  toDestination: "Surabaya",
  startDate: new Date().toISOString(),
  fromDate: formatDate(new Date()),
  penumpang: {
    adult: 2,
    children: 0,
    baby: 0,
  },
  totalPenumpang: 2,
  seatClass: 1,
};

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const searchSlicer = createSlice({
  name: "search",
  initialState,
  reducers: {
    setFromDestination: (state, action) => {
      // console.log("action", action);
      state.fromDestination = action.payload;
    },
    setToDestination: (state, action) => {
      state.toDestination = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
      state.fromDate = formatDate(new Date(action.payload));
    },
    setPenumpang: (state, action) => {
      state.penumpang = action.payload;
      state.totalPenumpang =
        action.payload.adult + action.payload.children + action.payload.baby;
    },
    setSeatClass: (state, action) => {
      state.seatClass = parseInt(action.payload, 10);
    },
  },
});

export const {
  setFromDestination,
  setToDestination,
  setStartDate,
  setPenumpang,
  setSeatClass,
} = searchSlicer.actions;

export default searchSlicer.reducer;
