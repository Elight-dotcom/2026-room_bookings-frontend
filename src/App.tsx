import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <>
      {/* Navbar */}
      <NavBar />

      {/* Main */}
      <main className="main-content bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route
            path="/users" 
            element={
              <UserPage />
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
