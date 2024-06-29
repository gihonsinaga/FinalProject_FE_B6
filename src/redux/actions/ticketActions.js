import axios from "axios";
import {
  setDetailTicket,
  setId,
  setAllPassenger,
} from "../reducers/ticketReducers";

export const DetailTicket = (props) => async (dispatch) => {
  console.log("dispatch id", props);

  try {
    const response = await axios.get(
      `https://express-development-3576.up.railway.app/api/v1/ticket/flight/${props?.id}?passenger=${props?.passenger}`,

      {
        headers: { accept: "application/json" },
      }
    );

    console.log("api detail flight", response.data.data);
    dispatch(setDetailTicket(response.data.data));
    dispatch(setId(props.id));
    dispatch(setAllPassenger(props.passenger2));

    return;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
