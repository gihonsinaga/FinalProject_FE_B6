import axios from "axios";
import {
  setNotifications,
  addNotification,
  markAsRead,
} from "../reducers/notificationReducers";
import {
  setSearchQuery,
  setFilterValue,
} from "../reducers/notificationReducers";
import toast from "react-hot-toast";

// Fetch Notifications
// export const fetchAllNotifications = () => async (dispatch, getState) => {
//   try {
//     const token = getState().auth.token; // Get the token from the state
//     if (!token) {
//       throw new Error("Token is not available");
//     }

//     const response = await axios.get(
//       "https://express-development-3576.up.railway.app/api/v1/notifications",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.data.status === true) {
//       dispatch(setNotifications(response.data.data));
//       toast.success("Notifications retrieved successfully!");
//     } else {
//       toast.error(response.data.message || "Failed to retrieve notifications!");
//     }
//   } catch (error) {
//     toast.error("An error occurred while fetching notifications!");
//     console.error("Fetch notifications error:", error);

//     if (axios.isAxiosError(error)) {
//       // Specific axios error
//       console.error("Axios error response:", error.response);
//     } else {
//       // General error
//       console.error("General error:", error);
//     }
//   }
// };

export const fetchNotifications = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    if (!token) {
      throw new Error("Token is not available");
    }

    const searchQuery = getState().notifications.searchQuery;
    const filterValue = getState().notifications.filterValue;

    // Construct the query parameters conditionally
    let queryParams = [];
    if (searchQuery) {
      queryParams.push(`find=${encodeURIComponent(searchQuery)}`);
    }
    if (filterValue) {
      queryParams.push(`filter=${encodeURIComponent(filterValue)}`);
    }
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    const response = await axios.get(
      `https://express-development-3576.up.railway.app/api/v1/notifications${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === true) {
      dispatch(setNotifications(response.data.data));
      // toast.success("Notifications retrieved successfully!");
    } else {
      toast.error(response.data.message || "Failed to retrieve notifications!");
    }
  } catch (error) {
    toast.error("An error occurred while fetching notifications!");
    console.error("Fetch notifications error:", error);
  }
};

export const fetchNotificationsPage = (page) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    if (!token) {
      throw new Error("Token is not available");
    }

    const searchQuery = getState().notifications.searchQuery;
    const filterValue = getState().notifications.filterValue;

    // Construct the query parameters conditionally
    let queryParams = [];
    if (searchQuery) {
      queryParams.push(`find=${encodeURIComponent(searchQuery)}`);
    }
    if (filterValue) {
      queryParams.push(`filter=${encodeURIComponent(filterValue)}`);
    }
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    const response = await axios.get(
      `https://express-development-3576.up.railway.app/api/v1/notifications${queryString}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === true) {
      dispatch(setNotifications(response.data.data));
      // toast.success("Notifications retrieved successfully!");
    } else {
      toast.error(response.data.message || "Failed to retrieve notifications!");
    }
  } catch (error) {
    toast.error("An error occurred while fetching notifications!");
    console.error("Fetch notifications error:", error);
  }
};

export const updateSearchQuery = (query) => (dispatch) => {
  dispatch(setSearchQuery(query));
};

export const updateFilterValue = (value) => (dispatch) => {
  dispatch(setFilterValue(value));
};

// Post Notification
export const postNotification = (data) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token; // Get the token from the state
    if (!token) {
      throw new Error("Token is not available");
    }

    const response = await axios.post(
      "https://express-development-3576.up.railway.app/api/v1/admin/notifications",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.status === true) {
      dispatch(addNotification(response.data.data));
    } else {
      toast.error(response.data.message || "Failed to post notification!");
    }
  } catch (error) {
    toast.error("An error occurred while posting notification!");
    console.error("Post notification error:", error);
  }
};

// Mark Notification as Read
export const updateNotificationStatus =
  (notificationId) => async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `https://express-development-3576.up.railway.app/api/v1/notification/markAsRead/${notificationId}`,
        {}, // Empty object as second argument for axios.put
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        dispatch(markAsRead(notificationId));
        toast.success("Notification marked as read!");
      } else {
        toast.error(
          response.data.message || "Failed to mark notification as read!"
        );
      }
    } catch (error) {
      toast.error("An error occurred while updating notification status!");
      console.error("Update notification status error:", error);
    }
  };

export const updateAllNotificationStatus = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await axios.put(
      `https://express-development-3576.up.railway.app/api/v1/notifications/markAsRead/all`,
      {}, // Empty object as second argument for axios.put
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === true) {
      dispatch(markAsRead(response.data.data));
      toast.success("Notification marked as read!");
    } else {
      toast.error(
        response.data.message || "Failed to mark notification as read!"
      );
    }
  } catch (error) {
    toast.error("An error occurred while updating notification status!");
    console.error("Update notification status error:", error);
  }
};
