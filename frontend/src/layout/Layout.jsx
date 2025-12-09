import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router'

const Layout = ({ profile }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header profile={profile}/> 
            <main className="flex-grow p-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout