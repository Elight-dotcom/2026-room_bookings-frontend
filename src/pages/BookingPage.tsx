import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBooking, getBookings, searchBookings, type Booking } from "../api/bookingApi";
import { getRooms, type Room } from "../api/roomApi";

function BookingPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoomId, setSelectedRoomId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getBookings();
                const roomData = await getRooms();
                setRooms(roomData);
                setBookings(data);
            } catch (error) {
                console.error("Error fetching booking data:", error);
                setError("Gagal memuat booking...");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const searchResult = await searchBookings({
                query: searchQuery, 
                roomId: selectedRoomId ? Number(selectedRoomId) : undefined, 
                bookingDate: selectedDate || undefined
            });

            setBookings(searchResult);
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || "Gagal mencari booking...");
            } else {
                setError("Gagal mencari booking...");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) return;

        try {
            await deleteBooking(id);
            setBookings(bookings.filter((booking) => booking.id !== id));
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || "Gagal menghapus booking...");
            } else {
                setError("Gagal menghapus booking...");
            }
        }
    };

    return (
        <div className="min-h-screen px-6 mt-20">
            <div className="w-full flex items-center mt-24 mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold text-blue-600">
                    Room Bookings
                </h1>
            </div>

            {/* Add Booking Button */}
            <div className="w-full flex items-center justify-between mx-auto mt-7">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex items-center">
                    <input
                        name="userName"
                        type="text"
                        placeholder="Search by name"
                        className="px-4 py-2 border border-gray-300 rounded-l-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select name="roomId" onChange={(e) => setSelectedRoomId(e.target.value)} className="px-4 py-2 border border-gray-300">
                        <option value="">All</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                    </select>

                    <input type="date" name="bookingDate" onChange={(e) => setSelectedDate(e.target.value)} className="px-4 py-2 border border-gray-300"/>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
                    >
                        Search
                    </button>
                </form>
                <Link
                    to="/bookings/add"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Add New Booking
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="text-center text-red-500 mt-4">
                    {error}
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center mt-6">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Booking Table */}
            {!loading && !error && (
            <div className="mt-12 bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Room Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Booking Date</th>  
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Start Time</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">End Time</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.id}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.userName}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {booking.roomName}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {booking.bookingDate}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {booking.startTime}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {booking.endTime}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 text-xs rounded-full text-white ${booking.statusId === 1 ? "bg-yellow-500" : booking.statusId === 2 ? "bg-green-500" : booking.statusId === 3 ? "bg-red-500" : "bg-gray-500"} font-medium`}>
                                                {booking.statusId === 1 ? "Pending" : booking.statusId === 2 ? "Approved" : booking.statusId === 3 ? "Rejected" : "Cancelled"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <Link to={`/bookings/detail/${booking.id}`} className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                                                Detail
                                            </Link>
                                            {booking.statusId === 1? (
                                                <Link to={`/bookings/edit/${booking.id}`} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                                    Edit
                                                </Link>
                                            ) : (
                                                <button className="px-3 py-1.5 text-sm bg-blue-200 text-white rounded-md hover:bg-blue-300 transition cursor-not-allowed">
                                                    Edit
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(booking.id)} className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer">
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
        </div>
    );
}

export default BookingPage;