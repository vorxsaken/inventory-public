import { ReactNode } from 'react'
import SubNavigation from '../SubNavigation'

function ChildLayout({ children, title, description, sideButton, secondSideButton, subNav }: {
    children: ReactNode,
    title: string,
    description: string,
    sideButton: JSX.Element,
    secondSideButton?: JSX.Element,
    subNav?: string[]
}) {

    return (
        <div className="w-full lg:px-16 px-6 py-8 flex-start flex-col gap-8 mt-[16%] lg:mt-0">
            <div className="w-full flex-start lg:flex-between flex-wrap lg:flex-nowrap gap-2 lg:gap-0">
                <div className="flex-start flex-col gap-2">
                    <span className="lg:text-5xl text-3xl font-bold">
                        {title}
                    </span>
                    <span className="lg:w-auto w-3/4 text-xs lg:text-sm text-gray-500 dark:text-white">
                        {description}
                    </span>
                </div>
                {sideButton}
            </div>
            <div className='w-full flex-start flex-col gap-4 pb-10'>
                {
                    subNav && (
                        <div className='w-full hidden lg:flex-between'>
                            <SubNavigation navigations={subNav} />
                            {secondSideButton && secondSideButton}
                        </div>
                    )
                }
                {children}
            </div>
        </div>
    )
}

export default ChildLayout