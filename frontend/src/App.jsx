import { Route, Routes } from "react-router";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
    );
}

export default App;
