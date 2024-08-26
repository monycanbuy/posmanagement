import { MAKE_REQ, REQ_GETALL_FAIL, REQ_GETALL_SUCC } from "./ActionType";

export const initialstate = {
  isloading: false,
  customerlist: {},
  customerobj: {},
  errormessage: "",
};

export const CustomerReducer = (state = initialstate, action) => {
  switch (action.type) {
    case MAKE_REQ:
      return {
        ...state,
        isloading: true,
      };
    case REQ_GETALL_SUCC:
      return {
        ...state,
        isloading: false,
         //customerlist: Array.isArray(action.payload) ? action.payload : [],
         customerlist: action.payload,
      };
    case REQ_GETALL_FAIL:
      return {
        ...state,
        isloading: false,
        customerlist: [],
        errormessage: action.payload,
      };
    default:
      return state;
  }
};
