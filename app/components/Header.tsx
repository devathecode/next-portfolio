"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { TiDocumentText } from "react-icons/ti";
import { MdOutlineWork } from "react-icons/md";
import { MdOutlineContactSupport } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { CiLight } from "react-icons/ci";
import { useTheme } from 'next-themes';
import { MdOutlineDarkMode } from "react-icons/md";

const Header = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    console.log('theme', theme);
    const pathname = usePathname();
    const commonSpanClass = 'block absolute h-0.5 w-full bg-white transition-all duration-700 ease-in-out';
    const [open, setOpen] = useState(false);
    const menuOptions = [
        {
            id: 1,
            title: `Home`,
            icon: <IoHomeOutline className='text-xl' />,
            url: '/'
        },
        {
            id: 2,
            title: `About`,
            icon: <IoPersonOutline className='text-[1.10rem]' />,
            url: '/about'
        },
        // {
        //     id: 3,
        //     title: `Resume`,
        //     icon: <TiDocumentText className='text-xl' />,
        //     url: '/resume'
        // },
        {
            id: 4,
            title: `Work`,
            icon: <MdOutlineWork className='text-xl' />,
            url: '/work'
        },
        {
            id: 5,
            title: `Contact`,
            icon: <MdOutlineContactSupport className='text-xl' />,
            url: '/contact'
        }
    ];
    const handleHamburgerClick = () => {
        setOpen(!open);
    }
    return (
        <header className={`px-2 sm:px-16 2xl:px-40 z-50 py-2 sm:py-3 bg-gray-100 dark:bg-stone-900 w-full fixed lg:block top-0 lg:top-none ${open ? ' left-0 right-0 bottom-auto ' : ''}`}>
            <nav className="flex justify-between">
                <Link href="/"
                    className="flex flex-row cursor-pointer justify-center text-black/70 dark:text-white items-center font-mono text-2xl font-bold">
                    <div className="ml-3 font-mono tracking-widest">
                        <span className="text-base sm:text-lg md:text-2xl font-semibold">De</span>
                        <span
                            className="italic text-4xl text-yellow-600">V</span>
                        <span className="text-base sm:text-lg md:text-2xl font-semibold">anshu</span>
                    </div>
                </Link>
                <div className="flex items-center">
                    <div className={`${open ? 'left-[0%] bg-gray-100 border-t border-yellow-700  dark:bg-stone-900 ps-1' : 'left-[-100%]'} navLinks duration-500 absolute lg:static lg:w-auto
                            w-full lg:h-auto h-[92vh] flex lg:items-center gap-[1.5vw] top-[90%]`}>
                        <ul className="flex lg:flex-row flex-col lg:items-center gap-0 lg:gap-[3vw]">
                            {menuOptions.map((data) => {
                                return (
                                    <li key={data.id} onClick={() => setOpen(false)} className={`${open ? 'ps-2 sm:ps-6' : ''} ${pathname === `${data.url}` ? 'bg-gradient-to-l' : 'hover:bg-gradient-to-l'}
                                        font-semibold first-letter:uppercase my-4 md:my-5 w-[98vw] lg:w-auto bg-black/70 from-yellow-600 via-yellow-700 to-yellow-800 text-white/80 text-sm px-4
                                         py-2 rounded-md cursor-pointer`}>
                                        <Link href={data.url} className='flex items-center'>
                                            {data.icon}
                                            <span className="ms-2">{data.title}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className={`w-10 h-10 bg-black/70 dark:bg-white hover:bg-gradient-to-r from-yellow-700 to-yellow-800 rounded-full 
                    cursor-pointer p-2 flex items-center justify-center ms-[3vw] text-4xl`} onClick={() => theme == "dark" ? setTheme('light') : setTheme("dark")}>
                        {theme == "dark" ? <CiLight className='text-white dark:text-black/70 dark:hover:text-white' /> :
                            <MdOutlineDarkMode className='text-white ' />}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-700 to-yellow-800 rounded-full cursor-pointer lg:hidden p-2 ms-[3vw]" onClick={handleHamburgerClick}>
                        <div className="relative transition-all duration-700 ease-in-out">
                            <div
                                className={`${commonSpanClass} ${open ? 'rotate-[135deg] top-[10px]' : 'rotate-0 top-1'}`}></div>
                            <div className={`${commonSpanClass} ${open ? 'hidden' : 'rotate-0 top-3'}`}></div>
                            <div

                                className={`${commonSpanClass} ${open ? '-rotate-[135deg] top-[10px]' : 'rotate-0 top-5'}`}></div>
                        </div>
                    </div>
                </div>
            </nav>
        </header >


    );
};

export default Header;