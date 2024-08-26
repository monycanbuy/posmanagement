import { getAllRequestFail, getAllRequestSuccess, makeRequest } from "./Action";
import axios from "axios";

export const GetALLCustomers = () => {
  return (dispatch) => {
    dispatch(makeRequest());
    axios
      .get("https://justgitclicks.azurewebsites.net/api/customer")
      .then((res) => {
        const _list = Array.isArray(res.data) ? res.data : []; // Ensure it's an array
        dispatch(getAllRequestSuccess(_list));
      })
      .catch((err) => {
        dispatch(getAllRequestFail(err.message));
      });
  };
};
