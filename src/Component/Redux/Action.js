import { MAKE_REQ, REQ_GETALL_FAIL, REQ_GETALL_SUCC } from "./ActionType";

export const makeRequest = () => {
  return {
    type: MAKE_REQ,
  };
};

export const getAllRequestSuccess = (data) => {
  return {
    type: REQ_GETALL_SUCC,
    payload: data,
  };
};

export const getAllRequestFail = (err) => {
  return {
    type: REQ_GETALL_FAIL,
    payload: err,
  };
};
