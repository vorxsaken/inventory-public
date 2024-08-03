import * as Di from "../ui/dialog"
import { Button } from "../ui/button"
import { Input, InputWithActionSuffix } from "../ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import SelectImage from "../ui/selectImage"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { forwardRef } from 'react';
import { userFormSchema as formSchema } from "@/lib/formSchemaValidation"
import { userEditFormSchema } from "@/lib/formSchemaValidation"
import useCommonForm from "@/lib/useCommonForm"
import { z } from 'zod'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useDispatch, useSelector } from "react-redux"
import { selectAllRole } from "@/store/reducers/roleReducer"
import { compressImage, fetcher, uploadImage, uploadImagesToFirebase } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { addUser, updateUser } from "@/store/reducers/userReducer"
import { userType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"

const User = forwardRef(({ defaultValue, edit }: { defaultValue?: userType, edit?: boolean }, ref) => {
    const [hidden, setHidden] = useState(true);
    const { form } = useCommonForm(edit ? userEditFormSchema : formSchema, ref as any, defaultValue && defaultValue);
    const roles = useSelector(state => selectAllRole(state));
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const workString = edit ? 'edit' : 'add'
    const { permissions } = getPermissions();

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            setloading(true);
            const { image } = value;
            let filename;

            if (!edit) {
                const { bigImage } = await compressImage(image);
                filename = await uploadImagesToFirebase(bigImage);
                const user = await fetcher('/api/user/create', { ...value, image: filename })
                dispatch(addUser(user as any))
            } else {
                if (!permissions.editUser) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }

                let userPassword = value.password ? value.password : null;

                if (typeof image === 'string') {
                    filename = image;
                } else {
                    const { bigImage } = await compressImage(image);
                    filename = await uploadImagesToFirebase(bigImage);
                }

                const update = await fetcher('/api/user/update', {
                    id: defaultValue?.id,
                    ...value,
                    image: filename,
                    password: userPassword
                })

                dispatch(updateUser({ id: defaultValue?.id as string, changes: update as userType }))
            }

            toast({
                description: `Successfully ${workString} user`
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: `Failed to ${workString} user`
            })
        }

        setloading(false);
    }

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle>
                    User
                </Di.DialogTitle>
                <Di.DialogDescription>
                    All field need to be filled, otherwise nothing work
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="w-full h-[60vh] flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="w-full flex-center flex-col">
                                    <FormLabel>User Photo</FormLabel>
                                    <FormControl>
                                        <SelectImage value={field.value} onChange={field.onChange} className='w-[240px] h-[240px]' />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Photo for the user, please keep the image file size small ..
                                    </FormDescription>
                                    <FormMessage className="uppercase text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter  username for the user" {...field} {...form.register("username")} />
                                    </FormControl>
                                    <FormDescription>
                                        Example : John Doe
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <InputWithActionSuffix
                                            placeholder="Enter Your Password"
                                            type={hidden ? 'password' : 'text'}
                                            icon={hidden ? BsEyeSlash : BsEye}
                                            action={() => setHidden(!hidden)}
                                            {...field}
                                            {...form.register("password")}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Example : J0hnDoe*
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter user email" {...field} {...form.register("email")} />
                                    </FormControl>
                                    <FormDescription>
                                        Email: johndoe@mail.com
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                {field.value ? <SelectValue placeholder="Select a role" /> : "Select a role"}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>roles</SelectLabel>
                                                    {
                                                        roles.map(role => (
                                                            <SelectItem key={role.id} value={role.id}>{role.roleName}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Pick the user role
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Di.DialogFooter>
                        <Button type='submit' loading={loading} className="capitalize">
                            {workString} User
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent>
    )
})

User.displayName = "User"
export default User