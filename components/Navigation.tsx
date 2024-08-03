import Link from "next/link"
import Image from "next/image"
import LightLogo from '../public/images/favicon.ico';
import DarkLogo from '../public/images/replacement.png'
import { usePathname } from 'next/navigation'
import DarkModeToggle from "./DarkModeToggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import { useDispatch } from "react-redux"
import { fetchAuth } from "../store/reducers/authReducer"
import { fetchCategory } from "@/store/reducers/categoryReducer";
import { fetchSupplier } from "@/store/reducers/supplierReducer";
import { fetchRoles } from "@/store/reducers/roleReducer";
import { fetchProduct } from "@/store/reducers/productReducer";
import { useSelector } from "react-redux"
import { selectAuth } from '../store/reducers/authReducer'
import type { AppDispatch } from "@/store"
import { UserMenu } from "./userMenu";
import { fetchUsers } from "@/store/reducers/userReducer";
import { fetchOrder } from "@/store/reducers/orderReducer";
import {BiMenu} from 'react-icons/bi'
import SideMenu from "./SideMenu";

export default function Navigation({ paths }: { paths: { name: string, href: string }[] }) {
    const { theme, systemTheme } = useTheme()
    const pathname = usePathname();
    const inActiveClass = 'hover:text-gray-800 dark:hover:text-white transition-all duration-300 ease-in-out'
    const activeClass = 'text-gray-800 dark:text-white'
    const [Logo, setLogo] = useState<typeof LightLogo>(LightLogo);
    const { data: session } = useSession();
    const auth = useSelector(state => selectAuth(state));
    const dispatch = useDispatch<AppDispatch>();
    
    const checkPath = (path: string) => {
        const splitPath = path.split('/')[1];
        const regex = splitPath ? RegExp(splitPath, 'gi').test(pathname) : /\/(?!\w)/i.test(pathname);
        return regex;
    }

    const links = paths.map(path => (
        <Link
            key={path.name}
            href={path.href}
            className={checkPath(path.href) ? activeClass : inActiveClass}
        >
            {path.name}
        </Link>
    ))

    useEffect(() => {
        if (session && !auth.length) {
            dispatch(fetchRoles());
            dispatch(fetchAuth((session.user as any).id as string));
            dispatch(fetchUsers((session.user as any).id as string));
            dispatch(fetchSupplier());
            dispatch(fetchCategory());
            dispatch(fetchProduct());
            dispatch(fetchOrder());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    useEffect(() => {
        const logo = theme == 'light' ? LightLogo : DarkLogo;
        const themeSystem = systemTheme == 'light' ? LightLogo : DarkLogo
        setLogo(theme === 'system' ? themeSystem : logo)

    }, [theme, systemTheme])

    return (
        <div>
            <div className="w-full flex-between fixed top-0 lg:hidden px-4 py-2 select-none border-b border-slate-200 dark:border-slate-900 bg-white 
            dark:bg-slate-950 z-20">
                <SideMenu logo={Logo} user={(auth[0] as any)}/>
                <div className="flex justify-start items-center gap-8 text-sm font-semibold text-gray-400 dark:text-gray-500">
                    <div id="logo" className="flex justify-center items-center gap-2">
                        <div className="w-7 h-7 relative overflow-hidden">
                            <Image src={Logo} alt="" fill className="object-cover pointer-events-none" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500 
                      dark:from-blue-500 dark:to-purple-500 font-extrabold font-pacifico text-xs leading-6">
                            INVENTORY
                        </span>
                    </div>
                </div>
                <DarkModeToggle />
            </div>
            <div className="hidden lg:flex-between px-8 py-2 select-none border-b border-slate-200 dark:border-slate-900">
                <div className="flex justify-start items-center gap-8 text-sm font-semibold text-gray-400 dark:text-gray-500">
                    <div id="logo" className="flex justify-center items-center gap-2">
                        <div className="w-7 h-7 relative overflow-hidden">
                            <Image src={Logo} alt="" fill className="object-cover pointer-events-none" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500 
                      dark:from-blue-500 dark:to-purple-500 font-extrabold font-pacifico text-xs leading-6">
                            INVENTORY
                        </span>
                    </div>
                    {links}
                </div>
                <div className="flex justify-center items-center gap-6 text-xl">
                    <DarkModeToggle />
                    {/* implemented in future version */}

                    {/* <Notification className="mr-2"/> */}
                    <UserMenu user={auth[0] as any} />
                </div>
            </div>
        </div>
    )
}
