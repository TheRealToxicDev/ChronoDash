"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiServer, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import ThemeSwitcher from "../other/ThemeSwitcher";
import { isAuthenticated, logout } from "@/utils/auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme } = useTheme();
    const [authenticated, setAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setAuthenticated(isAuthenticated());
    }, [pathname]);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        router.push("/login");
    };

    useEffect(() => {
        if (!authenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [authenticated, pathname, router]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

    if (pathname === "/login") return null;

    return (
        <>
            {/* Fixed height spacer to prevent content from being hidden under the navbar */}
            <div className="h-16"></div>
            
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border"
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src={theme === "dark" ? "/logo_black.webp" : "/logo_white.webp"}
                            alt="Sysmanix logo"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                        />
                        <span className="font-bold text-xl">Sysmanix</span>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <FiMenu className="w-6 h-6" />
                        )}
                    </button>

                    <div className="hidden md:flex items-center space-x-6">
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

            {/* Mobile Menu - Completely separated with higher z-index */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                            style={{ pointerEvents: "auto" }}
                        />
                        
                        {/* Menu drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-background shadow-xl md:hidden"
                            style={{ pointerEvents: "auto" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col h-full max-h-screen overflow-y-auto">
                                <div className="sticky top-0 z-10 px-4 py-4 flex justify-between items-center border-b border-border bg-background/90 backdrop-blur-sm">
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src={theme === "dark" ? "/logo_black.webp" : "/logo_white.webp"}
                                            alt="Sysmanix logo"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5"
                                        />
                                        <span className="font-bold text-lg">Sysmanix</span>
                                    </div>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <div className="flex-1 p-4">
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Navigation</h3>
                                        <nav className="space-y-1">
                                            <NavLink
                                                href="/"
                                                icon={<FiHome className="w-5 h-5" />}
                                                label="Dashboard"
                                                onClick={() => setIsMenuOpen(false)}
                                                mobile
                                            />
                                            <NavLink
                                                href="/services"
                                                icon={<FiServer className="w-5 h-5" />}
                                                label="Services"
                                                onClick={() => setIsMenuOpen(false)}
                                                mobile
                                            />
                                        </nav>
                                    </div>
                                </div>
                                
                                <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background/90 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">Theme</span>
                                        <ThemeSwitcher />
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        className="flex items-center justify-center w-full p-3 space-x-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                                    >
                                        <FiLogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({
    href,
    icon,
    label,
    onClick,
    mobile,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    mobile?: boolean;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    if (mobile) {
        return (
            <Link 
                href={href} 
                onClick={onClick}
                className={`flex items-center space-x-3 py-3 px-4 rounded-lg relative overflow-hidden transition-colors ${
                    isActive 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
            >
                {isActive && (
                    <motion.div
                        layoutId="mobile-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                    />
                )}
                <span>{icon}</span>
                <span className={isActive ? "font-medium" : ""}>{label}</span>
            </Link>
        );
    }

    return (
        <Link href={href} className="relative" onClick={onClick}>
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