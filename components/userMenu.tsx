import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import type { userType } from "@/lib/types"
import { BsPerson, BsGear } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
import { signOut } from "next-auth/react"
import { Skeleton } from "./ui/skeleton"
import * as Di from '../components/ui/dialog';
import ViewUser from "./table/viewRows/ViewUser"

export function UserMenu({ user }: { user: userType }) {
    
    return (
        <>
            {
                !user ? (
                    <Skeleton className="w-9 h-9 rounded-full" />
                ) : (
                    <Di.Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.image} alt="@shadcn" className="object-cover" />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-60 lg:w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Di.DialogTrigger className="w-full">
                                        <DropdownMenuItem className="h-8 font-semibold">
                                            Profile
                                            <DropdownMenuShortcut>
                                                <BsPerson className="lg:text-lg text-xl text-black lg:text-slate-900 dark:text-white" />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Di.DialogTrigger>
                                    {/* implemented in next version */}

                                    {/* <DropdownMenuItem>
                                        Settings
                                        <DropdownMenuShortcut>
                                            <BsGear className="text-sm text-slate-900 dark:text-white" />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem> */}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer h-8">
                                    Log out
                                    <DropdownMenuShortcut>
                                        <BiLogOut className="lg:text-lg text-xl dark:text-white" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* this is the dialog */}
                        <ViewUser {...user as any} />
                    </Di.Dialog>

                )
            }
        </>
    )
}