import { ReactNode } from 'react'
import { Loader as Loader } from 'lucide-react'

function DataLoader({ children, loader }: { children: ReactNode, loader: boolean }) {
    return (
        <div>
            {
                loader ? (
                    <div className="h-[55vh] flex flex-col justify-center items-center gap-4 border border-slate-800 rounded-lg border-dashed text-xs">
                        <Loader size={45} className="animate-spin" />
                    </div>
                ) : (
                    <>
                        {children}
                    </>
                )
            }
        </div>
    )
}

export default DataLoader