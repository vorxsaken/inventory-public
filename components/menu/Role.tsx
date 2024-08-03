import * as Di from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { roleFormSchema as formSchema } from "@/lib/formSchemaValidation";
import { z } from 'zod';
import useCommonForm from "@/lib/useCommonForm"
import { fetcher, extractWord } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { useDispatch } from "react-redux"
import { addRole, updateRole } from "@/store/reducers/roleReducer"
import { rolePermissions, roleType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"

const Role = forwardRef(({ defaultValue, edit }: { defaultValue?: roleType<rolePermissions>, edit?: boolean }, ref) => {
    const { form, resetForm: reset } = useCommonForm(formSchema, ref as any, defaultValue && defaultValue, { useImperative: false });
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const workString = edit ? 'Edit' : 'String';
    const { isAdmin } = getPermissions()

    const initialPermissions = defaultValue?.rolePermissions ? defaultValue.rolePermissions : {
        // user permissions
        createUser: false,
        readUser: false,
        editUser: false,
        deleteUser: false,
        // product permissions
        createProduct: false,
        readProduct: false,
        editProduct: false,
        deleteProduct: false,
        // category permissions
        createCategory: false,
        readCategory: false,
        editCategory: false,
        deleteCategory: false,
        // stock in permissions
        createStock: false,
        readStock: false,
        editStock: false,
        deleteStock: false,
        // supplier permissions
        createSupplier: false,
        readSupplier: false,
        editSupplier: false,
        deleteSupplier: false,
        // order permissions
        createOrder: false,
        readOrder: false,
        editOrder: false,
        deleteOrder: false,
        // order detail permissions
        createOrderDetail: false,
        readOrderDetail: false,
        editOrderDetail: false,
        deleteOrderDetail: false,
    }

    const [permissions, setPermissions] = useState({ ...initialPermissions });

    const restructurePermissions = () => {
        const permissionArrays = Object.entries(permissions);
        const newPermissionArrays: any[] = [];
        const categories = ['product', 'category', 'user', 'stock', 'supplier', 'order', 'orderDetail'];
        categories.forEach(category => {
            const roleArray: any[] = [];
            permissionArrays.forEach(permissionArray => {
                let forOrder = category === 'order' ? 'order(?!Detail)' : `${category}`;
                let pattern = new RegExp(forOrder, 'i');
                if (pattern.test(permissionArray[0])) {
                    roleArray.push(permissionArray)
                }
            })

            newPermissionArrays.push(roleArray);
        })

        return newPermissionArrays;
    }

    const changePermission = (permission: string, e: boolean) => {
        setPermissions({
            ...permissions,
            [permission]: e
        })
    }

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            let role;
            setloading(true)
            if (!edit) {
                role = await fetcher('/api/role/create', { ...value, rolePermission: { ...permissions } })
                dispatch(addRole(role as any))
            } else {
                if (!isAdmin) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }

                role = await fetcher('/api/role/update', {
                    id: defaultValue?.id,
                    roleName: value.roleName,
                    rolePermission: { ...permissions }
                })

                dispatch(updateRole({ id: defaultValue?.id as string, changes: role as roleType<rolePermissions> }))
            }

            toast({
                description: `Successfully ${workString} role`
            })

        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                description: `Failed to ${workString} role`
            })
        }

        setloading(false);
        resetForm();
    }

    function resetForm() {
        reset();
        setPermissions({ ...initialPermissions })
        setPermissions({ ...initialPermissions })
    }

    useImperativeHandle(ref, () => ({ resetForm }))

    return (
        <Di.DialogContent>
            <Di.DialogHeader className="flex gap-2">
                <Di.DialogTitle>
                    Role
                </Di.DialogTitle>
                <Di.DialogDescription className="text-xs">
                    {`All field need to be filled, otherwise nothing work, except for role permissions.`}
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="w-full h-[50vh] flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        <FormField
                            control={form.control}
                            name="roleName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Role Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter role name" {...field} {...form.register("roleName")} />
                                    </FormControl>
                                    <FormDescription>
                                        Example: Employee
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex-start flex-col gap-2">
                            <Label>Role Permissions</Label>
                            <div className="w-full flex-start gap-12 p-6 border dark:border-slate-800 border-slate-200 rounded-xl flex-wrap">
                                {
                                    restructurePermissions().map(permission => (
                                        <div key={permission[0]} className="flex-start flex-col gap-4">
                                            <Label>{extractWord(permission[0][0], true).match(/[A-Z][a-z]+/g)?.join(' ')}</Label>
                                            <div className="flex-start flex-col gap-2">
                                                {
                                                    permission.map((crud: [string, boolean]) => (
                                                        <div key={crud[0]} className="flex-start h-4">
                                                            <Checkbox
                                                                checked={crud[1]}
                                                                onCheckedChange={(e: boolean) => changePermission(crud[0], e)}
                                                            />
                                                            <div className="leading-3">{extractWord(crud[0], false)}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <Di.DialogFooter>
                        <Button type="submit" loading={loading}>
                            {workString} Role
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent>
    )
})

Role.displayName = "Role"
export default Role