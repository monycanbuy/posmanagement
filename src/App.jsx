import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles"; // Correct import

import ProtectedRoute from "./Component/ProtectedRoute";
import store from "./store";
import theme from "./themes/theme";
import { CssBaseline } from "@mui/material";
import AdminDashBoard from "./Admin/AdminDashBoard";
import Accountusers from "./features/accountusers/accountusers";
import SignInSide from "./Component/AuthSection/Login";

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
            <Route path="/login" element={<SignInSide />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <ToastContainer position="top-right" />
    </Provider>
  );
}

export default App;
