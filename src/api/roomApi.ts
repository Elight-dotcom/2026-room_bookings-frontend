import axios from 'axios';

const API_URL = '/api/room';

export interface Room {
    id: number;
    name: string;
    capacity: number;
    location: string;
    description: string;
    createdAt: string;
}

// get user bookings
export const getRooms = async (): Promise<Room[]> => {
    const response = await axios.get<Room[]>(`${API_URL}`);
    return response.data;
};

// get user by id
export const getRoomById = async (id: number): Promise<Room> => {
    const response = await axios.get<Room>(`${API_URL}/${id}`);
    return response.data;
}

// search users by name
export const searchRooms = async (query?: string): Promise<Room[]> => {
    const response = await axios.get<Room[]>(`${API_URL}/search`, {
        params: query ? { searchTerm: query } : {}
    });

    return response.data;
};
