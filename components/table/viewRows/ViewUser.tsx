import { userType, roleType } from "@/lib/types"
import Image from "next/image"
import * as Di from "../../ui/dialog"
import { Label } from "../../ui/label"
import CryptoJS from "crypto-js"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import User from '../../menu/User'

function ViewUser(props: userType<roleType>) {
    const { data } = useSession();
    const decrypt = props?.password && CryptoJS.AES.decrypt(props?.password, (data?.user as any)._XYS);
    const originaltext = decrypt?.toString(CryptoJS.enc.Utf8);
    const formattedUser = { ...props, password: '' };

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle className="capitalize">
                    {props?.username}
                </Di.DialogTitle>
            </Di.DialogHeader>
            <div className="h-[45vh] overflow-auto custom-scrollbar py-4">
                <div className="flex-start flex-col gap-6">
                    <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 relative overflow-hidden rounded-lg">
                        <Image src={props?.image as any} fill className="object-cover" alt="" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Username</Label>
                        <span className="text-start text-sm">
                            {`${props?.username?.charAt(0).toUpperCase()}${props?.username?.substring(1,)}`}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Password</Label>
                        <div className="max-w-sm text-start text-sm break-all">
                            {originaltext}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Email</Label>
                        <span className="text-start text-sm">
                            {`${props?.email?.charAt(0).toUpperCase()}${props?.email?.substring(1,)}`}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Role</Label>
                        <span className="text-start text-sm">
                            {`${props?.role?.roleName?.charAt(0).toUpperCase()}${props?.role?.roleName?.substring(1,)}`}
                        </span>
                    </div>
                </div>
            </div>
            <Di.Dialog>
                <Di.DialogTrigger>
                    <Button className="w-full" variant={"outline"}>Edit</Button>
                </Di.DialogTrigger>
                <User defaultValue={formattedUser as any} edit />
            </Di.Dialog>
        </Di.DialogContent >
    )
}

export default ViewUser