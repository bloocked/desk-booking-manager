import { Route, Routes } from "react-router";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
    );
}

export default App;
