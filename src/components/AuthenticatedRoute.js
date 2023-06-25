// // AuthenticatedRoute.js

// import React from "react";
// import { Route, Navigate } from "react-router-dom";
// import { useAppContext } from "../libs/contextLib";

// export default function AuthenticatedRoute({ element, ...rest }) {
//   const { isAuthenticated } = useAppContext();

//   return (
//     <Route
//       {...rest}
//       element={isAuthenticated ? element : <Navigate to="/login" />}
//     />
//   );
// }
