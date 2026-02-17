import axios from "axios";

const API_URL = '/api/roombooking';

export interface Booking {
    id: number;
    userId: number;
    userName: string;
    userNRP: string;
    roomId: number;
    roomName: string;
    roomLocation: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
    statusId: number;
    statusName: string;
    createdAt: string;
}

// get all bookings
export const getBookings = async (): Promise<Booking[]> => {
    const response = await axios.get<Booking[]>(`${API_URL}`);
    return response.data;
};

// get booking by id
export const getBookingById = async (id: number): Promise<Booking> => {
    const response = await axios.get<Booking>(`${API_URL}/${id}`);
    return response.data;
}

// add booking
export const addBooking = async (bookingData: {
    userId: number;
    roomId: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
}): Promise<Booking> => {
    const response = await axios.post<Booking>(`${API_URL}`, bookingData);
    return response.data;
};

// update booking
export const updateBooking = async (id: number, bookingData: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking> => {
    const response = await axios.put<Booking>(`${API_URL}/${id}`, bookingData);
    return response.data;
};

// delete booking
export const deleteBooking = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

// Search bookings by name, room or date
export const searchBookings = async (params: {
        query?: string;
        roomId?: number;
        bookingDate?: string;
    }) => {
    const response = await axios.get(`${API_URL}/search`, {
        params,
    });

    return response.data;
};

// Update booking status
export const updateBookingStatus = async (id: number, statusId: number, statusNote?: string): Promise<Booking> => {
    const response = await axios.put<Booking>(`${API_URL}/${id}/status`, { statusId, statusNote });
    return response.data;
}
