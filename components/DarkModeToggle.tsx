"use client"

import * as React from "react"
import { Moon, Sun, Computer } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DivType } from "@/lib/types"
import { useState, useEffect } from 'react'

const DarkModeToggle = ({ className, ...props }: DivType) => {
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Sun className="w-[1.4rem] h-[1.4rem] lg:h-[1.2rem] lg:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute w-[1.4rem] h-[1.4rem] lg:h-[1.2rem] lg:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 lg:w-auto">
                    <DropdownMenuItem onClick={() => setTheme("light")} className="h-12 lg:h-auto">
                        Light
                        <DropdownMenuShortcut>
                            <Sun className="w-[1.2rem] h-[1.2rem] lg:h-[1rem] lg:w-[1rem]" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")} className="h-12 lg:h-auto">
                        Dark
                        <DropdownMenuShortcut>
                            <Moon className="w-[1.2rem] h-[1.2rem] lg:h-[1rem] lg:w-[1rem]" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")} className="h-12 lg:h-auto">
                        System
                        <DropdownMenuShortcut>
                            <Computer className="h-[1rem] w-[1rem]" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default DarkModeToggle
