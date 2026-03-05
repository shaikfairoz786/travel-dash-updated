import React, { useEffect, useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import { API_BASE_URL } from "../../config/api";

interface Booking {
  id: string;
  customer: { name: string; email: string; phone?: string | null };
  package: { title: string; slug: string };
  quantity: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
  travelStart?: string;
  travelEnd?: string;
  notes?: string;
}

const AdminBookingsPage: React.FC = () => {
  const { session } = useAuth();
  const accessToken = session?.access_token;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!accessToken) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [accessToken]);

  const handleStatusChange = async (bookingId: string, newStatus: 'approved' | 'cancelled') => {
    if (!accessToken) {
      alert('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert(`Booking ${bookingId} status updated to ${newStatus}`);
      fetchBookings(); // Refresh the list
    } catch (err: unknown) {
      alert(`Failed to update booking status: ${err instanceof Error ? err.message : 'An error occurred'}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xl font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 flex flex-col sm:table-row mb-4 sm:mb-0 bg-white border-b sm:border-b-0 border-gray-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words max-w-[150px]">
                    <div className="flex items-center gap-2" title={booking.id}>
                      <span className="font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs border border-slate-200">
                        {booking.id.substring(0, 8)}...
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(booking.id);
                          alert('Booking ID copied to clipboard!');
                        }}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Copy full ID"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 break-words max-w-[200px]">
                    {booking.customer.name}
                    <br />
                    <span className="text-gray-400 text-xs">{booking.customer.email}</span>
                    {booking.customer.phone && (
                      <>
                        <br />
                        <span className="text-indigo-500 font-medium text-xs">{booking.customer.phone}</span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[150px] truncate" title={booking.package.title}>{booking.package.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">${booking.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-48">
                    {booking.status === 'pending' && (
                      <div className="flex items-center space-x-2 justify-end">
                        <button
                          onClick={() => handleStatusChange(booking.id, 'approved')}
                          className="text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-md transition duration-200 font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition duration-200 font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
