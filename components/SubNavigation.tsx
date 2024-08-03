import { usePathname } from "next/navigation"
import Link from "next/link";

function SubNavigation({ navigations }: { navigations: string[] }) {
    const pathname = usePathname();
    const activeLink = 'bg-white dark:bg-slate-950 text-slate-800 dark:text-white shadow-sm'
    const inActiveLink = 'text-gray-400 dark:text-slate-500'

    const checkPath = (path: string) => {
        let check = new RegExp(path, 'gi');
        return check.test(pathname);
    }

    return (
        <div className="w-full flex-start gap-2 p-1 rounded-md bg-gray-100 dark:bg-slate-900 text-xs font-semibold">
            {
                navigations.map((navigation, i) => (
                    <Link
                        key={i}
                        href={`/data/${navigation}`}
                        className={`w-full h-8 flex-center capitalize rounded-sm ${checkPath(navigation) ? activeLink : inActiveLink}`}
                    >
                        <span>{navigation}</span>
                    </Link>
                ))
            }
        </div>
    )
}

export default SubNavigation