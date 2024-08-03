import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import * as Di from '../ui/dialog'
import { useState } from 'react'

function RowActions<T extends JSX.Element>({ view, edit, remove }: { view?: T, edit?: T, remove?: T }) {
    const [component, setComponent] = useState<JSX.Element>();

    return (
        <Di.Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {
                        view && (
                            <Di.DialogTrigger onClick={() => setComponent(view)} className="w-full">
                                <DropdownMenuItem>
                                    View
                                </DropdownMenuItem>
                            </Di.DialogTrigger>
                        )
                    }
                    {
                        edit && (
                            <Di.DialogTrigger onClick={() => setComponent(edit)} className="w-full">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Di.DialogTrigger>
                        )
                    }
                    {
                        remove && (
                            <Di.DialogTrigger onClick={() => setComponent(remove)} className="w-full">
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </Di.DialogTrigger>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            {component}
        </Di.Dialog>
    )
}

export default RowActions