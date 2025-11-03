import React from 'react'
import { CircleUserRound } from 'lucide-react'

const Header = () => {
return (
    <header className="flex justify-between items-center p-4">
        <h1 className="m-0 text-2xl font-bold text-amber-600">Fast Order</h1>
        <nav className="flex gap-5">
            <a href="/profile" className="mr-4 hover:underline"><CircleUserRound /></a>
            <a href="/about" className="hover:underline">About</a>
        </nav>
    </header>
)
}

export default Header