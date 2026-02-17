import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById, updateBookingStatus, type Booking } from "../api/bookingApi";

const DetailBookingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<number>(0);
    const [statusNote, setStatusNote] = useState<string>("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const statusOptions = [
        { id: 1, name: "Pending", color: "yellow", icon: "⏳" },
        { id: 2, name: "Approved", color: "green", icon: "✓" },
        { id: 3, name: "Rejected", color: "red", icon: "✕" },
        { id: 4, name: "Cancelled", color: "gray", icon: "⊘" },
    ];

    useEffect(() => {
        loadBookingDetail();
    }, [id]);

    const loadBookingDetail = async () => {
        try {
            setLoading(true);
            const data = await getBookingById(Number(id));
            setBooking(data);
            setSelectedStatus(data.statusId);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response?.data?.message || 
                    err.response?.data || 
                    "An error occurred while processing your request."
                );
                console.error(err.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!booking || selectedStatus === booking.statusId) {
            setShowStatusModal(false);
            return;
        }

        try {
            setUpdatingStatus(true);
            await updateBookingStatus(booking.id, selectedStatus, statusNote.trim() ? statusNote.trim() : undefined);
            
            await loadBookingDetail();
            setShowStatusModal(false);
            setStatusNote("");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(
                    err.response?.data?.message || 
                    err.response?.data || 
                    "An error occurred while processing your request."
                );
            }
            console.error(err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (statusId: number) => {
        const status = statusOptions.find(s => s.id === statusId);
        return status?.color || "gray";
    };

    const getStatusIcon = (statusId: number) => {
        const status = statusOptions.find(s => s.id === statusId);
        return status?.icon || "•";
    };

    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        const diff = (endTime.getTime() - startTime.getTime()) / 1000 / 60;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return hours > 0 ? `${hours}h ${minutes > 0 ? minutes + 'm' : ''}` : `${minutes}m`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen6 bg-white flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Booking</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/bookings")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    if (!booking) return null;

    const statusColor = getStatusColor(booking.statusId);
    const statusColorClasses = {
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
        green: "bg-green-100 text-green-800 border-green-200",
        red: "bg-red-100 text-red-800 border-red-200",
        gray: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
        <div className="min-h-screen bg-white-50 py-8 px-4 mt-20">
            <div className="w-full max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/bookings")}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Bookings
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Booking Details
                            </h1>
                            <p className="text-gray-600">
                                Booking ID: #{booking.id}
                            </p>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold border-2 text-lg ${statusColorClasses[statusColor as keyof typeof statusColorClasses]}`}>
                                <span className="mr-2 text-xl">{getStatusIcon(booking.statusId)}</span>
                                {booking.statusId === 1 ? "Pending" : booking.statusId === 2 ? "Approved" : booking.statusId === 3 ? "Rejected" : booking.statusId === 4 ? "Cancelled" : "Cancelled" }
                            </span>
                        </div>
                    </div>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Room Information */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="bg-blue-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Room Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500 font-medium">Room Name</p>
                                            <p className="text-lg font-semibold text-gray-900">{booking.roomName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500 font-medium">Location</p>
                                            <p className="text-lg font-semibold text-gray-900">{booking.roomLocation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Schedule */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="bg-green-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Schedule
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm text-gray-500 font-medium">Date</p>
                                            <p className="text-lg font-semibold text-gray-900">{formatDate(booking.bookingDate)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-500 font-medium">Start Time</p>
                                                <p className="text-lg font-semibold text-gray-900">{booking.startTime}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-500 font-medium">End Time</p>
                                                <p className="text-lg font-semibold text-gray-900">{booking.endTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-indigo-900">Total Duration</span>
                                            <span className="text-2xl font-bold text-indigo-600">
                                                {calculateDuration(booking.startTime, booking.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="bg-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Purpose
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {booking.purpose}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        
                        {/* User Information */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="bg-orange-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Booked By
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="text-center mb-4">
                                    <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-3xl font-bold text-white">
                                            {booking.userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{booking.userName}</h3>
                                    <p className="text-gray-500 font-medium">{booking.userNRP}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Management */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="bg-indigo-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    Status Management
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 font-medium mb-2">Current Status</p>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-xl font-semibold border-2 ${statusColorClasses[statusColor as keyof typeof statusColorClasses]}`}>
                                        <span className="mr-2 text-lg">{getStatusIcon(booking.statusId)}</span>
                                        {booking.statusId === 1 ? "Pending" : booking.statusId === 2 ? "Approved" : booking.statusId === 3 ? "Rejected" : "Cancelled"}
                                    </span>
                                </div>
                                
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 flex items-center justify-center cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Update Status
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="bg-gray-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Quick Actions
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <button
                                    onClick={() => navigate(`/bookings/edit/${booking.id}`)}
                                    className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition flex items-center justify-center border-2 border-blue-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Booking
                                </button>
                                
                                <button
                                    onClick={() => window.print()}
                                    className="w-full px-4 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition flex items-center justify-center border-2 border-gray-200 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-indigo-600 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Update Booking Status</h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">
                                Select the new status for this booking:
                            </p>
                            
                            <div className="space-y-2">
                                {statusOptions.map((status) => (
                                    <label
                                        key={status.id}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                                            selectedStatus === status.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status.id}
                                            checked={selectedStatus === status.id}
                                            onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                            className="w-5 h-5 text-indigo-600"
                                        />
                                        <span className={`ml-3 flex items-center font-medium ${
                                            selectedStatus === status.id ? 'text-indigo-900' : 'text-gray-700'
                                        }`}>
                                            <span className="text-xl mr-2">{status.icon}</span>
                                            {status.name}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700 mb-2">
                                    Note (Optional)
                                </label>
                                <textarea
                                    id="statusNote"
                                    name="statusNote"
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    placeholder="Add a note about this status change..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Optional: Add context or reason for the status change
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                            <button
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setSelectedStatus(booking.statusId);
                                    setStatusNote("");
                                }}
                                disabled={updatingStatus}
                                className="px-6 py-2.5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updatingStatus || selectedStatus === booking.statusId}
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer"
                            >
                                {updatingStatus ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Status'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailBookingPage;