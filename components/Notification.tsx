import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { BsBell } from "react-icons/bs"
import { Button } from "./ui/button"
import type { DivType } from "@/lib/types"

function Notification({ className, ...props }: DivType) {
    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <BsBell className="text-xl text-slate-900 dark:text-white" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[20vw] h-[60vh] mr-10">
                    <DropdownMenuLabel>
                        Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="h-[40vh] flex-center flex-col ">
                        <BsBell className="text-5xl text-slate-500 dark:text-white" />
                        <span className="w-[70%] text-center text-xs text-slate-700 dark:text-white">
                            Notification will Appear when theres low quantity stock
                        </span>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Notification