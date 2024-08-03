import { BsShieldSlash } from 'react-icons/bs'

function NoAuthority() {
    return (
        <div className="w-full h-52 flex-center flex-col gap-4 mt-20">
            <BsShieldSlash className='text-8xl text-gray-400' />
            <span className='text-muted-foreground'>You have no authorithy to access this page</span>
        </div>
    )
}

export default NoAuthority