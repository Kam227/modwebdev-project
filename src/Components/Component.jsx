import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MapView from "./MapView";
import ContactPage from "./Contact";
import AuthModule from "./Auth/Auth";
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./Auth/AuthRoute";
import Profile from "./Profile";
import ContactList from "./ContactList";
import Messaging from "./Messaging";

export default function Component() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes (redirect away if already logged in) */}
        <Route path="/auth" element={<AuthRoute children={<AuthModule />} />} />
        <Route path="/register" element={<AuthRoute children={<AuthRegister />} />} />
        <Route path="/login" element={<AuthRoute children={<AuthLogin />} />} />

        {/* Map is the home screen */}
        <Route path="/" element={<ProtectedRoute children={<MapView />} />} />

        {/* Contact / employer profile */}
        <Route
          path="/contacts/:id"
          element={<ProtectedRoute children={<ContactPage />} />}
        />

        {/* profile screen */}
        <Route path="/profile/${user.id}" element= {<ProtectedRoute children={<Profile />} />} />
        {/* contacts */}
        <Route path="/contacts" element={<ContactList />} />
         {/* chat window */}
        <Route path="/chat/:id" element={<Messaging />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
