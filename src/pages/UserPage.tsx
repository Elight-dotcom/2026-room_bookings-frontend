import { useEffect, useState } from "react";
import { getUser, searchUsers } from "../api/userApi";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    nrp: string;
    createdAt: string;
}

function UserPage() {
    const [searchQuery, setSearchQuery] = useState < string > ("");
    const [users, setUsers] = useState < User[] > ([]);
    const [error, setError] = useState < string | null > (null);
    const [loading, setLoading] = useState < boolean > (false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getUser();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Gagal memuat pengguna...");
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
        const searchResult = await searchUsers(searchQuery);
            setUsers(searchResult);
            setError(null);
        } catch (error) {
            console.log(error);
            setError("Gagal memuat pengguna...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-6">
        {/* Header */}
        <div className="text-center w-full mx-auto mt-24">
            <h1 className="text-4xl font-bold text-blue-600">
                User
            </h1>
        </div>

        {/* Search */}
        <div className="flex justify-center mt-10">
            <form onSubmit={handleSearch} className="flex">
                <input
                    type="text"
                    placeholder="Search User..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 transition duration-300"
                >
                    Search
                </button>
            </form>
        </div>

        {/* Error */}
        {error && (
            <div className="text-center text-red-500 mt-4">
                {error}
            </div>
        )}

        {/* Loading */}
        {loading && (
            <div className="flex justify-center items-center mt-6">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {/* User Table */}
        {!loading && !error && (
        <div className="mt-12 bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    NRP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Created At
                    </th>
                </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                    <tr>
                    <td
                        colSpan={6}
                        className="px-6 py-6 text-center text-gray-500"
                    >
                        No users found.
                    </td>
                    </tr>
                ) : (
                    users.map((user) => (
                    <tr
                        key={user.id}
                        className="border-t"
                    >
                        <td className="px-6 py-4 text-sm text-gray-900">
                        {user.id}
                        </td>

                        <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                            {user.role}
                        </span>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {user.name}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                        {user.nrp}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                        {user.email}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
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

export default UserPage;
