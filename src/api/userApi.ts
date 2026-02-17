import axios from 'axios';

const API_URL = '/api/user';

export interface User {
    id: number;
    role: string;
    nrp: string;
    name: string;
    email: string;
    createdAt: string;
}

// get user bookings
export const getUser = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}`);
    return response.data;
};

// get user by id
export const getUserById = async (id: number): Promise<User> => {
    const response = await axios.get<User>(`${API_URL}/${id}`);
    return response.data;
}

// search users by name
export const searchUsers = async (query?: string): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}/search`, {
        params: query ? { searchTerm: query } : {}
    });

    return response.data;
};
