import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/landing";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotpass";
import Dashboard from "./pages/dashboard/dashboard";
import Children from "./pages/children/children";
import ChildDetails from "./pages/childDetails/childDetails";
import Schedule from "./pages/schedule/schedule";
import Reminders from "./pages/reminders/reminders";
import Profile from "./pages/profile/profile";
import Reports from "./pages/reports/reports";
import Settings from "./pages/settings/settings";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
      <Route
  path="/child-details"
  element={<ChildDetails />}
/>

<Route path="/schedule" element={<Schedule />} />

<Route path="/reminders" element={<Reminders />} />

  <Route path="/profile" element={<Profile />} />   
      
   <Route path="/reports" element={<Reports />} />   
      
   <Route path="/settings" element={<Settings />} />   
   
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;