import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Settings, User, Waves, Bell, FileText, Lightbulb } from 'lucide-react'
import fishtaLogo from '../assets/fishtaLogo.webp'

const navLinks = [
    {
        to: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
    },
    {
        to: '/ponds',
        icon: Waves,
        label: 'Ponds',
    },
    {
        to: '/alerts',
        icon: Bell,
        label: 'Alerts',
    },
    {
        to: '/tips',
        icon: Lightbulb,
        label: 'Tips',
    },
    {
        to: '/rapports',
        icon: FileText,
        label: 'Rapports',
    },

]

const NavBar = () => {
    const location = useLocation()
    return (
        <aside className="h-screen w-48 bg-white border-r border-gray-100 flex flex-col items-center py-6 px-2 shadow-sm fixed z-20">
            <div className="mb-8 flex flex-col items-center">
                <div className="rounded-full p-2 transition-transform hover:scale-105 hover:bg-[#FC2F26]/10 cursor-pointer">
                    <img src={fishtaLogo} alt="Fishta Logo" className="h-10 w-auto" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-[#FC2F26] mt-2">Fishta</span>
            </div>
            <nav className="flex flex-col gap-1 flex-1 w-full">
                {navLinks.map(link => {
                    const Icon = link.icon
                    const active = location.pathname === link.to
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 hover:bg-[#FC2F26]/10 hover:text-[#FC2F26] ${active ? 'bg-[#FC2F26] text-white shadow' : ''}`}
                            title={link.label}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#FC2F26]'}`} />
                            <span className="truncate text-xs">{link.label}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="mt-auto mb-2 w-full">
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#FC2F26]/10 hover:text-[#FC2F26] transition-colors cursor-pointer">
                    <User className="w-5 h-5 text-[#FC2F26]" />
                    <span className="text-gray-700 font-medium text-xs">Profile</span>
                </div>
            </div>
        </aside>
    )
}

export default NavBar
