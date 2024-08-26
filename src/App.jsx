import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles"; // Correct import
// import CustomerList from "./Component/CustomerList";
import ProtectedRoute from "./Component/ProtectedRoute";
import store from "./store";
// import TransactionTypeDropdown from "./Component/TransactionTypeDropdown";
// import UserAuthentication from "./Component/UserAuthenication/UserAuthentication";
// import MainLayout from "./MainLayout";
// import Register from "./Component/Authentication/register/Register";
// import SignIn from "./Component/Authentication/signin/SignIn";
// import AccountUsers from "./Component/Authentication/AccountUsers";
//import AdminDashBoard from "./Admin/AdminDashBoard";
import theme from "./themes/theme";
import { CssBaseline } from "@mui/material";
import AdminDashBoard from "./Admin/AdminDashBoard";
import Accountusers from "./features/accountusers/accountusers";
import SignInSide from "./Component/AuthSection/Login";

//const theme = createTheme(); // Use createTheme function here

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AdminDashBoard />} exact />
              <Route path="/users" element={<Accountusers />} />
            </Route>
            {/* <Route path="/register" element={<Register />} /> */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/users" element={<AccountUsers />} /> */}
            <Route path="/login" element={<SignInSide />} />
            {/* <Route path="/" element={<AdminDashBoard />} /> */}

            {/* <Route
              path="/users"
              element={<ProtectedRoute element={UserAuthentication} />}
            /> */}
            {/* <Route
              path="/dropdown"
              element={<ProtectedRoute element={TransactionTypeDropdown} />}
            /> */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer position="top-right" />
    </Provider>
  );
}

export default App;
