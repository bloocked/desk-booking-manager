const NavButton = ({ to, label }) => {
    return (
        <a href={to} className="flex justify-center border border-black px-4 py-2 w-40 rounded hover:bg-gray-200">
            {label}
        </a>
    );
}

export default NavButton;