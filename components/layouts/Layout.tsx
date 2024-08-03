import Head from "next/head"
import { ReactNode } from "react"
import Navigation from "@/components/Navigation"
import { usePathname } from "next/navigation"
import { Toaster } from "../ui/toaster"

export default function Layout({ children, title }: { children: ReactNode, title: string }) {
    const path = usePathname();


    const paths = [
        {
            name: 'Dashboard',
            href: '/'
        },
        {
            name: 'Data',
            href: '/data/products'
        },
        {
            name: 'Report',
            href: '/report'
        }
    ]

    return (
        <>
            <Head>
                <title>{`${title} | Inventory System`}</title>
            </Head>
            <header>
                {
                    !(/login/gi.test(path)) && (
                        <Navigation paths={paths} />
                    )
                }
            </header>
            <main>
                {children}
            </main>
            <Toaster />
        </>
    )
}
