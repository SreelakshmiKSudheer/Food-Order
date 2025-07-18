import React from 'react'

const Header = () => {
return (
    <header className="flex justify-between items-center p-4">
        <h1 className="m-0 text-2xl font-bold text-amber-600">Foodie</h1>
        <nav>
            <a href="/profile" className="mr-4 hover:underline">Profile</a>
            <a href="/about" className="hover:underline">About</a>
        </nav>
    </header>
)
}

export default Header