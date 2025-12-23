import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const USER_ID = import.meta.env.VITE_DEFAULT_USER_ID;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [userData, reservationsData] = await Promise.all([
                fetch(`${API_URL}/Users/${USER_ID}`)
                    .then((res) => res.json())
                    .then((data) => setUser(data)),

                fetch(`${API_URL}/Reservations?userId=${USER_ID}`)
                    .then((res) => res.json())
                    .then((data) => setReservations(data)),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    const activeReservations = reservations.filter((r) => r.status === "Active");
    const pastReservations = reservations.filter((r) => r.status === "Past");

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl">Loading...</div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-2">Profile Page</h1>
            <h2 className="text-xl text-center text-gray-600 mb-8">
                {user.firstName} {user.lastName}
            </h2>
            <div className="space-y-8">
                <ReservationsList reservations={activeReservations} title="Active Reservations" />
                <ReservationsList reservations={pastReservations} title="Past Reservations" />
            </div>
        </div>
    );
};

export default Profile;

const ReservationCard = ({ reservation }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-700">
                <span className="font-semibold">Desk:</span> {reservation.deskId} |
                <span className="font-semibold ml-2">From:</span> {reservation.startDate}
                <span className="font-semibold ml-2">To:</span> {reservation.endDate}
            </p>
        </div>
    );
};

const ReservationsList = ({ reservations, title }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
            {reservations.length === 0 ? (
                <p className="text-gray-500 italic">No {title.toLowerCase()}.</p>
            ) : (
                <div className="space-y-3">
                    {reservations.map((reservation) => (
                        <ReservationCard key={reservation.id} reservation={reservation} />
                    ))}
                </div>
            )}
        </div>
    );
};
