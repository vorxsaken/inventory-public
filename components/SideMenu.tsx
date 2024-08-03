import { BiSolidDashboard, BiSolidLogOut, BiSolidReport } from 'react-icons/bi'
import { Sidebar } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image, { StaticImageData } from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { userType } from '@/lib/types'
import { Separator } from './ui/separator'
import { BsDatabaseFill, BsFilePersonFill, BsPerson } from 'react-icons/bs'
import Link from 'next/link'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Dialog, DialogTrigger } from './ui/dialog'
import ViewUser from './table/viewRows/ViewUser'
import { usePathname } from 'next/navigation'

function SideMenu({ logo, user }: { logo: StaticImageData, user: userType }) {
    const [open, setopen] = useState(false);
    const pathname = usePathname();
    const activeLink = 'text-orange-500 dark:text-blue-500 font-bold';
    const inActiveLink = 'text-slate-900 dark:text-white';
    const checkPath = (path: string, pathname: string) => path === pathname;

    return (
        <Sheet open={open} onOpenChange={() => setopen(!open)}>
            <SheetTrigger>
                <Sidebar size={20} />
            </SheetTrigger>
            <SheetContent side={'left'} className='h-screen overflow-y-auto custom-scrollbar'>
                <SheetHeader>
                    <SheetTitle>
                        <div className="flex justify-start items-center gap-8 text-sm font-semibold text-gray-400 dark:text-gray-500">
                            <div id="logo" className="flex justify-center items-center gap-2">
                                <div className="w-7 h-7 relative overflow-hidden">
                                    <Image src={logo} alt="" fill className="object-cover pointer-events-none" />
                                </div>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500 
                              dark:from-blue-500 dark:to-purple-500 font-extrabold font-pacifico text-xs leading-6">
                                    INVENTORY
                                </span>
                            </div>
                        </div>
                    </SheetTitle>
                    <SheetDescription>
                        <div className='flex-start flex-col gap-6 mt-8 '>
                            <div className='w-full flex-start gap-4'>
                                <Avatar className="h-[50px] w-[50px]">
                                    <AvatarImage src={user?.image} alt="@shadcn" className="object-cover" />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                <div className='flex-start flex-col gap-0'>
                                    <span className='text-xl font-semibold text-black dark:text-white'>
                                        {user?.username}
                                    </span>
                                    <span className='text-sm'>{user?.email}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className='w-full flex-start flex-col gap-3 font-medium text-lg text-slate-800 dark:text-white'>
                                <Dialog>
                                    <DialogTrigger className='w-full'>
                                        <div className='flex-between'>
                                            <span>Profile</span>
                                            <BsFilePersonFill className='text-xl' />
                                        </div>
                                    </DialogTrigger>
                                    <ViewUser {...user as any} />
                                </Dialog>
                                <Link
                                    className={`w-full flex-between ${checkPath('/', pathname) ? activeLink : inActiveLink}`}
                                    href={'/'}
                                    onClick={() => setopen(false)}
                                >
                                    <div>
                                        Dashboard
                                    </div>
                                    <BiSolidDashboard className='text-xl' />
                                </Link>
                                <div className='w-full flex-start flex-col gap-2'>
                                    <div className='w-full flex-between'>
                                        <span>Data</span>
                                        <BsDatabaseFill className='text-xl' />
                                    </div>
                                    <div className='flex-start flex-col gap-4 font-light pl-3'>
                                        <Link
                                            className={checkPath('/data/products', pathname) ? activeLink : inActiveLink}
                                            href={'/data/products'}
                                            onClick={() => setopen(false)}
                                        >
                                            Products
                                        </Link>
                                        <Link
                                            className={checkPath('/data/categories', pathname) ? activeLink : inActiveLink}
                                            href={'/data/categories'}
                                            onClick={() => setopen(false)}
                                        >
                                            Categories
                                        </Link>
                                        <Link
                                            className={checkPath('/data/suppliers', pathname) ? activeLink : inActiveLink}
                                            href={'/data/suppliers'}
                                            onClick={() => setopen(false)}
                                        >
                                            Suppliers
                                        </Link>
                                        <Link
                                            className={checkPath('/data/roles', pathname) ? activeLink : inActiveLink}
                                            href={'/data/roles'}
                                            onClick={() => setopen(false)}
                                        >
                                            Roles
                                        </Link>
                                        <Link
                                            className={checkPath('/data/users', pathname) ? activeLink : inActiveLink}
                                            href={'/data/users'}
                                            onClick={() => setopen(false)}
                                        >
                                            Users
                                        </Link>
                                        <Link
                                            className={checkPath('/data/orders', pathname) ? activeLink : inActiveLink}
                                            href={'/data/orders'}
                                            onClick={() => setopen(false)}
                                        >
                                            Orders
                                        </Link>
                                        <Link
                                            className={checkPath('/data/stockIn', pathname) ? activeLink : inActiveLink}
                                            href={'/data/stockIn'}
                                            onClick={() => setopen(false)}
                                        >
                                            Stocks In
                                        </Link>
                                    </div>
                                </div>
                                <Link
                                    className={`w-full flex-between ${checkPath('/report', pathname) ? activeLink : inActiveLink}`}
                                    href={'/report'}
                                    onClick={() => setopen(false)}
                                >
                                    <div>
                                        Report
                                    </div>
                                    <BiSolidReport className='text-xl' />
                                </Link>
                                <div className='w-full flex-between' onClick={() => signOut({ callbackUrl: '/' })}>
                                    <div>
                                        Log Out
                                    </div>
                                    <BiSolidLogOut className='text-xl' />
                                </div>
                            </div>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}

export default SideMenu