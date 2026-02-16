import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addBooking, getBookingById, updateBooking } from "../api/bookingApi";
import { getRooms, type Room } from "../api/roomApi";
import { getUser, type User } from "../api/userApi";

const AddBookingPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [userData, roomData] = await Promise.all([
                    getUser(),
                    getRooms(),
                ]);
                setUsers(userData);
                setRooms(roomData);

                if (isEditing && id) {
                    const booking = await getBookingById(Number(id));
                    setForm({
                        userId: booking.userId.toString(),
                        roomId: booking.roomId.toString(),
                        bookingDate: booking.bookingDate,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                        purpose: booking.purpose,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please refresh the page.");
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, [isEditing, id]);

    const [form, setForm] = useState({
        userId: "",
        roomId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Clear field-specific error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: "" });
        }
        if (error) setError("");
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        // Validate date is not in the past (only for new bookings)
        if (!isEditing) {
            const today = new Date().toISOString().split('T')[0];
            if (form.bookingDate < today) {
                errors.bookingDate = "Booking date cannot be in the past";
            }
        }

        // Validate time range
        if (form.startTime && form.endTime && form.startTime >= form.endTime) {
            errors.endTime = "End time must be after start time";
        }

        // Validate purpose length
        if (form.purpose.trim().length < 10) {
            errors.purpose = "Purpose must be at least 10 characters";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const bookingData = {
                userId: Number(form.userId),
                roomId: Number(form.roomId),
                bookingDate: form.bookingDate,
                startTime: form.startTime,
                endTime: form.endTime,
                purpose: form.purpose.trim(),
            };

            if (isEditing && id) {
                await updateBooking(Number(id), bookingData);
                navigate("/bookings", { 
                    state: { message: "Booking updated successfully!" } 
                });
            } else {
                await addBooking(bookingData);
                navigate("/bookings", { 
                    state: { message: "Booking created successfully!" } 
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response?.data?.message || 
                    err.response?.data || 
                    "An error occurred while processing your request."
                );
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectedRoom = rooms.find(r => r.id === Number(form.roomId));

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-20 py-8 px-4">
            <div className="w-full max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/bookings")}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4 cursor-pointer"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Bookings
                    </button>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {isEditing ? "Edit Booking" : "Create New Booking"}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? "Update the booking details below" : "Fill in the details below to book a room"}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-medium text-red-800">Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8 space-y-6">
                            
                            {/* User & Room Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* User Selection */}
                                <div className="space-y-2">
                                    <label htmlFor="userId" className="block text-sm font-semibold text-gray-700">
                                        Select User <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="userId"
                                            id="userId"
                                            value={form.userId}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                                        >
                                            <option value="" disabled>Choose a user...</option>
                                            {users.filter((user) => user.role !== "Admin").map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.nrp})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Room Selection */}
                                <div className="space-y-2">
                                    <label htmlFor="roomId" className="block text-sm font-semibold text-gray-700">
                                        Select Room <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="roomId"
                                            id="roomId"
                                            value={form.roomId}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                                        >
                                            <option value="" disabled>Choose a room...</option>
                                            {rooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.name} - {room.location}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Room Info */}
                            {selectedRoom && (
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">
                                                Selected: {selectedRoom.name}
                                            </p>
                                            <p className="text-sm text-blue-700">
                                                Location: {selectedRoom.location} • Capacity: {selectedRoom.capacity || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Date & Time */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Date & Time
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Booking Date */}
                                    <div className="space-y-2">
                                        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
                                            Booking Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="bookingDate"
                                            id="bookingDate"
                                            value={form.bookingDate}
                                            onChange={handleChange}
                                            min={isEditing ? undefined : new Date().toISOString().split('T')[0]}
                                            required
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                                fieldErrors.bookingDate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {fieldErrors.bookingDate && (
                                            <p className="text-xs text-red-600">{fieldErrors.bookingDate}</p>
                                        )}
                                    </div>

                                    {/* Start Time */}
                                    <div className="space-y-2">
                                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                            Start Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            id="startTime"
                                            value={form.startTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                    </div>

                                    {/* End Time */}
                                    <div className="space-y-2">
                                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                            End Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            id="endTime"
                                            value={form.endTime}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                                fieldErrors.endTime ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {fieldErrors.endTime && (
                                            <p className="text-xs text-red-600">{fieldErrors.endTime}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Duration Display */}
                                {form.startTime && form.endTime && form.startTime < form.endTime && (
                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Duration: {(() => {
                                            const start = new Date(`2000-01-01T${form.startTime}`);
                                            const end = new Date(`2000-01-01T${form.endTime}`);
                                            const diff = (end.getTime() - start.getTime()) / 1000 / 60;
                                            const hours = Math.floor(diff / 60);
                                            const minutes = diff % 60;
                                            return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Purpose */}
                            <div className="space-y-2">
                                <label htmlFor="purpose" className="block text-sm font-semibold text-gray-700">
                                    Purpose <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="purpose"
                                    id="purpose"
                                    placeholder="Enter the purpose of this booking (min. 10 characters)..."
                                    value={form.purpose}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                                        fieldErrors.purpose ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <div className="flex justify-between items-center">
                                    {fieldErrors.purpose && (
                                        <p className="text-xs text-red-600">{fieldErrors.purpose}</p>
                                    )}
                                    <p className={`text-xs ml-auto ${
                                        form.purpose.length < 10 ? 'text-gray-400' : 'text-green-600'
                                    }`}>
                                        {form.purpose.length} / 10 characters minimum
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-8 py-6 flex justify-end gap-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate("/bookings")}
                                className="px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center shadow-lg shadow-blue-500/30"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEditing ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {isEditing ? "Update Booking" : "Create Booking"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBookingPage;