import { combineReducers } from "redux";
import customerSlice from "./features/customers/customerSlice";
import transactionTypeSlice from "./features/transaction/transactionTypeSlice";
import usersSlice from "./features/manageusers/usersSlice";
import accountusers from "./features/accountusers/accountusers";

const rootReducer = combineReducers({
    customers: customerSlice,
    transactionTypes: transactionTypeSlice,
    auth: accountusers,
    users:usersSlice,
  });
  
  export default rootReducer;