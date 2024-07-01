import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  searchQuery: "",
  filterValue: "",
  totalPages: 1,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  setSearchQuery,
  setFilterValue,
  setTotalPages,
} = notificationSlice.actions;
export default notificationSlice.reducer;
