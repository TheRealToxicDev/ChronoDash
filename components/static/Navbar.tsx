"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiHome, FiServer, FiLogOut, FiActivity } from "react-icons/fi";
import ThemeSwitcher from "../other/ThemeSwitcher";
import { isAuthenticated, logout } from "@/utils/auth";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(isAuthenticated());
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    useEffect(() => {
        if (!authenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [authenticated, pathname, router]);

    if (pathname === "/login") return null;

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo.png"
                        alt="Sysmanix logo"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                    />
                    <span className="font-bold text-xl">Sysmanix</span>
                </Link>

                <div className="flex items-center space-x-6">
                    <NavLink href="/" icon={<FiHome />} label="Dashboard" />
                    <NavLink
                        href="/services"
                        icon={<FiServer />}
                        label="Services"
                    />

                    <div className="flex items-center space-x-4 pl-6 border-l border-border">
                        <ThemeSwitcher />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({
    href,
    icon,
    label,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className="relative">
            <div className="flex items-center space-x-1 py-1 px-2">
                <span
                    className={`${
                        isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                    {icon}
                </span>
                <span
                    className={`${
                        isActive
                            ? "font-medium text-primary"
                            : "text-muted-foreground"
                    }`}
                >
                    {label}
                </span>
            </div>
            {isActive && (
                <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                />
            )}
        </Link>
    );
}
