import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar fixed bg-blue-500 top-0 left-0 right-0 z-50 py-5">
            <div className="navbar-container flex items-center justify-between mx-12">
                {/* Navbar brand */}
                <div className="navbar-brand">
                    <Link to="/" className="navbar-item text-white text-2xl font-bold">Rumah Resep</Link>
                </div>
                {/* Navbar links */}
                <div className="navbar-links flex items-center flex-row text-white gap-6 font-semibold">
                    <Link to="/" className="navbar-item hover:text-gray-300 transition ease-in-out duration-300 cursor-pointer">Home</Link>
                    <Link to="/users" className="navbar-item hover:text-gray-300 transition ease-in-out duration-300 cursor-pointer">User</Link>
                    <Link to="/bookings" className="navbar-item hover:text-gray-300 transition ease-in-out duration-300 cursor-pointer">Bookings</Link>
                    <Link to="/history" className="navbar-item hover:text-gray-300 transition ease-in-out duration-300 cursor-pointer">History</Link>
                </div>
                <div>

                </div>
            </div>
        </nav>
    )
}