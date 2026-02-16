import axios from 'axios';

const API_URL = '/api/statushistory';

export interface StatusHistory {
    id: number;
    bookingId: number;
    changedByUserId: number;
    changedByUserName: string;
    statusId: number;
    statusName: string;
    note: string;
    changedAt: string;
}

// get user bookings
export const getStatusHistory = async (): Promise<StatusHistory[]> => {
    const response = await axios.get<StatusHistory[]>(`${API_URL}`);
    console.log("Fetched status history:", response.data);
    return response.data;
};

// get user by id
export const getStatusHistoryById = async (id: number): Promise<StatusHistory> => {
    const response = await axios.get<StatusHistory>(`${API_URL}/${id}`);
    return response.data;
}

// search users by name
export const searchUsers = async (query?: string): Promise<StatusHistory[]> => {
    const response = await axios.get<StatusHistory[]>(`${API_URL}/search`, {
        params: query ? { searchTerm: query } : {}
    });

    return response.data;
};
