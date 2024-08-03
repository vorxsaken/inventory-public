/* eslint-disable */
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as Di from '../ui/dialog'
import { BsPlus, BsPerson, BsBox, BsPersonGear, } from 'react-icons/bs'
import { LuFileInput } from 'react-icons/lu'
import { BiCategory, BiCart } from 'react-icons/bi'
import { HiOutlineArchiveBoxArrowDown } from 'react-icons/hi2'
import Product from './Product'
import Category from './Category'
import Role from './Role'
import Supplier from './Supplier'
import User from './User'
import Order from './Order';
import StockIn from './StockIn'
import { getPermissions } from '@/store/reducers/authReducer'
import { IconType } from 'react-icons/lib'

type menusType = {
    name: string;
    component: JSX.Element;
    icon: IconType;
}[]

function AddMenu() {
    const { permissions, isAdmin } = getPermissions();
    const ref = useRef();

    const menus = [
        permissions?.createProduct && {
            name: 'Product',
            component: <Product ref={ref} />,
            icon: BsBox
        },
        permissions?.createCategory && {
            name: 'Category',
            component: <Category ref={ref} />,
            icon: BiCategory
        },
        permissions?.createSupplier && {
            name: 'Supplier',
            component: <Supplier ref={ref} />,
            icon: BiCart
        },
        isAdmin && {
            name: 'Role',
            component: <Role ref={ref} />,
            icon: BsPersonGear
        },
        permissions?.createUser && {
            name: 'User',
            component: <User ref={ref} />,
            icon: BsPerson
        },
        permissions?.createOrder && {
            name: 'Order',
            component: <Order ref={ref} />,
            icon: LuFileInput
        },
        permissions?.createStock && {
            name: 'Stock',
            component: <StockIn ref={ref} />,
            icon: HiOutlineArchiveBoxArrowDown
        }
    ].filter(menu => menu !== false) as menusType

    const [component, setComponent] = useState<JSX.Element>(menus[0]?.component);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (!open && ref) {
            (ref?.current as any)?.resetForm()
        }
    }, [open])

    return (
        <Di.Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size={'sm'} className="font-bold mt-4 lg:mt-0">
                        <BsPlus className="text-2xl mr-3 text-white dark:text-slate-900" />
                        Add
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='lg:w-48 w-56'>
                    {
                        menus?.map((menu, i) => {
                            const MenuIcon = menu?.icon
                            return (
                                <Di.DialogTrigger key={i} className='w-full text-xl lg:text-base' onClick={() => setComponent(menu?.component)}>
                                    <DropdownMenuItem className='h-12 lg:h-auto'>
                                        {menu?.name}
                                        <DropdownMenuShortcut>
                                            <MenuIcon className="lg:text-base text-xl text-slate-900 dark:text-white" />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Di.DialogTrigger>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            {component}
        </Di.Dialog>
    )
}

export default AddMenu