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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <h1>
                {user.firstName} {user.lastName}
            </h1>
            <ReservationsList reservations={activeReservations} title="Active Reservations" />
            <ReservationsList reservations={pastReservations} title="Past Reservations" />
        </div>
    );
};

export default Profile;

const ReservationCard = ({ reservation }) => {
    return (
        <div>
            <h2>
                Desk: {reservation.deskId} | From: {reservation.startDate} To: {reservation.endDate}
            </h2>
        </div>
    );
};

const ReservationsList = ({ reservations, title }) => {
    return (
        <div>
            <h2>{title}</h2>
            {reservations.length === 0 ? (
                <p>No {title.toLowerCase()}.</p>
            ) : (
                reservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                ))
            )}
        </div>
    );
};
