import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import AddBookingPage from "./pages/AddBookingPage";
import BookingPage from "./pages/BookingPage";
import DetailBookingPage from "./pages/DetailBookingPage";
import Home from "./pages/Home";
import StatusHistoryPage from "./pages/StatusHistoryPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <>
      {/* Navbar */}
      <NavBar />

      {/* Main */}
      <main className="main-content bg-white">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <Home />
            }
          />
          {/* Users */}
          <Route
            path="/users" 
            element={
              <UserPage />
            }
          />
          {/* Bookings */}
          <Route
            path="/bookings" 
            element={
              <BookingPage />
            }
          />
          {/* Add Booking */}
          <Route
            path="/bookings/add" 
            element={
              <AddBookingPage />
            }
          />
          {/* Edit Booking */}
          <Route
            path="/bookings/edit/:id" 
            element={
              <AddBookingPage />
            }
          />
          {/* Detail Booking */}
          <Route
            path="/bookings/detail/:id" 
            element={
              <DetailBookingPage />
            }
          />
          {/* History Status */}
          <Route
            path="/history" 
            element={
              <StatusHistoryPage />
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
