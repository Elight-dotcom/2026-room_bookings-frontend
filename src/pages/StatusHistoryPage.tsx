import axios from "axios";
import { useEffect, useState } from "react";
import { getStatusHistory, type StatusHistory } from "../api/statusHistoryApi";

function StatusHistoryPage() {
    const [statusHistory, setStatusHistory] = useState < StatusHistory[] > ([]);
    const [error, setError] = useState < string | null > (null);
    const [loading, setLoading] = useState < boolean > (false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getStatusHistory();
                setStatusHistory(data);
            } catch (error) {
                if(axios.isAxiosError(error)) {
                    console.error("Axios error:", error.response?.data || error.message);
                } else {
                    console.error("Error fetching status history data:", error);
                    setError("Gagal memuat status history...");
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="min-h-screen px-6">
        {/* Header */}
        <div className="text-center w-full mx-auto mt-24">
            <h1 className="text-4xl font-bold text-blue-600">
                Status History
            </h1>
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

        {/* Status History Table */}
        {!loading && !error && (
        <div className="mt-12 bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Changed To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Changed At
                    </th>
                </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                {statusHistory.length === 0 ? (
                    <tr>
                    <td
                        colSpan={6}
                        className="px-6 py-6 text-center text-gray-500"
                    >
                        No status history found.
                    </td>
                    </tr>
                ) : (
                    statusHistory.map((history) => (
                    <tr
                        key={history.id}
                        className="border-t"
                    >
                        <td className="px-6 py-4 text-sm text-gray-900">
                        {history.id}
                        </td>

                        <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                            {history.bookingId}
                        </span>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {history.changedByUserName}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                            <span className={`px-2 py-1 text-xs rounded-full text-white ${history.statusId === 1 ? "bg-yellow-500" : history.statusId === 2 ? "bg-green-500" : history.statusId === 3 ? "bg-red-500" : "bg-gray-500"} font-medium`}>
                                {history.statusId === 1 ? "Pending" : history.statusId === 2 ? "Approved" : history.statusId === 3 ? "Rejected" : "Cancelled"}
                            </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                        {history.note == "" || history.note == null ? "-" : history.note}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(history.changedAt).toLocaleDateString()}
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

export default StatusHistoryPage;
