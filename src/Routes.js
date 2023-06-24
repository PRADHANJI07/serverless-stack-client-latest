import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
// import Login from "./containers/Login";
// import Signup from "./containers/Signup";
// import NewNote from "./containers/NewNote"; 

export default function MyRoutes() {
  return (
    <Routes>
      {/* <Route path="/Login" element={<Login />} /> */}
      <Route path="/" element={<Home />} />
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      {/* <Route path="/notes/new" element={<NewNote />} />  */}
    </Routes>
  );
}
