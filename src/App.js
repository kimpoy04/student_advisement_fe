import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.css";
import AppRouter from "./AppRouter";

export default function App() {

  return (
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
  );
}