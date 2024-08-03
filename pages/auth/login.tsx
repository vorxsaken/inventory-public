import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input, InputWithActionSuffix } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactElement, useState } from "react"
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { NextPageWithLayout, InputEventValueType } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import Layout from "@/components/layouts/Layout"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import DarkModeToggle from "@/components/DarkModeToggle"
import { useSession } from "next-auth/react"
import Router from "next/router";

const Login: NextPageWithLayout = () => {
    const [hidden, setHidden] = useState(true);
    const [user, setUser] = useState({
        username: '',
        password: ''
    })
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const { data } = useSession();
    if(data) Router.replace('/');

    const inputUsername = (e: InputEventValueType) => setUser({ ...user, username: e.currentTarget.value });
    const inputPassword = (e: InputEventValueType) => setUser({ ...user, password: e.currentTarget.value });
    const enterSystem = () => {
        if (!user.username || !user.password) return;
        setloading(true);

        signIn("credentials", {
            username: user.username,
            password: user.password,
            redirect: false,
        }).then((res) => {
            setloading(false);
            if (!res?.ok) {
                setloading(false);
                seterror(true);
                setTimeout(() => { seterror(false) }, 4000);
                return;
            }
            
        })
    }

    return (
        <div className='h-screen flex-center gap-0'>
            <div className='w-full h-full hidden lg:flex justify-end items-start flex-col gap-8 relative'>
                <div className='absolute w-full h-full overflow-hidden'>
                    <Image src={'/images/kanban method-pana.svg'} fill className="object-cover pointer-events-none" alt="" />
                </div>
                <div className="w-[450px] flex-start flex-col z-20 p-7 bg-white text-slate-900 rounded-lg mb-12 ml-8 border border-slate-300
                dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                    <span className='text-4xl font-extrabold'>
                        Inventory System
                    </span>
                    <span className='font-light text-sm'>
                        {`power your inventory management with this web app, manage stock in or out, your product, your staff access and more.`}
                    </span>
                </div>
            </div>
            <div className='w-full lg:w-[600px] h-full flex-center flex-col gap-6'>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Set Foot In</CardTitle>
                        <CardDescription>Enter with account that admin give you</CardDescription>
                        {
                            error && (
                                <CardDescription className="text-red-400">
                                    {'wrong username or password'}
                                </CardDescription>
                            )
                        }
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5 gap-2">
                                    <Label className={error ? "text-red-400" : ''} htmlFor="name">Username</Label>
                                    <Input
                                        className={error ? "placeholder:text-red-400 border-red-400 text-red-400" : ''}
                                        id="name"
                                        placeholder="Enter Your username"
                                        value={user.username}
                                        onInput={e => inputUsername(e)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5 gap-2">
                                    <Label className={error ? "text-red-400" : ''} htmlFor="framework">Password</Label>
                                    <InputWithActionSuffix
                                        className={error ? "placeholder:text-red-400 border-red-400 text-red-400" : ''}
                                        id="password"
                                        placeholder="Enter Your Password"
                                        type={hidden ? 'password' : 'text'}
                                        icon={hidden ? BsEyeSlash : BsEye}
                                        action={() => setHidden(!hidden)}
                                        value={user.password}
                                        onInput={e => inputPassword(e)}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button loading={loading} className="w-32 font-bold" onClick={enterSystem}>
                            Enter
                        </Button>
                    </CardFooter>
                </Card>
                <Separator orientation="horizontal" className="w-[250px] md:w-[250px] lg:w-2/3" />
                <span className="w-[250px] md:w-[250px] lg:w-3/5 text-xs text-gray-400 text-center">
                    {`You can ask admin to create you an account or if cant login with it.`}
                </span>
            </div>
            <DarkModeToggle className="absolute right-4 bottom-4" />
        </div>
    )
}

Login.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout title="Login">
            {page}
        </Layout>
    )
}
export default Login