import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/auth";
import EventsPage from "./pages/events";
import BookingsPage from "./pages/bookings";
import MainNavigation from "./components/navigation/mainnavigation";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <MainNavigation />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
