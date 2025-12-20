import { useEffect, useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const userId = import.meta.env.VITE_DEFAULTUSER_ID;

        fetch(`${apiUrl}/Users/${userId}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <h1>{user.firstName} {user.lastName}</h1>
        </div>
    ); 
}

export default Profile;