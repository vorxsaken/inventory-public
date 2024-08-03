import * as Di from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import useCommonForm from "@/lib/useCommonForm"
import { forwardRef } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { supplierFormSchema as formSchema } from "@/lib/formSchemaValidation";
import { z } from 'zod';
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { fetcher } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { useDispatch } from "react-redux"
import { addSupplier, updateSupplier } from "@/store/reducers/supplierReducer"
import { supplierType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"

const Supplier = forwardRef(({ defaultValue, edit }: { defaultValue?: supplierType, edit?: boolean }, ref) => {
    const { form } = useCommonForm(formSchema, ref as any, defaultValue && defaultValue);
    const [loading, setloading] = useState(false);
    const { toast } = useToast()
    const dispatch = useDispatch();
    const workString = edit ? 'update' : 'add'
    const { permissions } = getPermissions();

    const textfields = [
        {
            name: 'supplierName',
            label: 'Supplier Name',
            placeholder: 'Enter the supplier name',
            description: 'Example: Apple Inc',
            type: 'text',
        }, {
            name: 'contactName',
            label: 'Contact Name',
            placeholder: 'Enter supplier contact name',
            description: 'Example: John Doe',
            type: 'text',
        },
        {
            name: 'contactEmail',
            label: 'Contact Email',
            placeholder: 'Enter supplier contact email',
            description: 'Example: johndoe@mail.com',
            type: 'text',
        },
        {
            name: 'contactPhone',
            label: 'Contact Phone',
            placeholder: 'Enter supplier contact phone',
            description: 'Example: 08123456789',
            type: 'number',
        }
    ]

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        let supplier;
        setloading(true)

        try {
            if (!edit) {
                supplier = await fetcher('/api/supplier/create', { ...values })
                dispatch(addSupplier(supplier as any));
            } else {
                if (!permissions.editSupplier) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }

                supplier = await fetcher('/api/supplier/update', { id: defaultValue?.id as string, ...values })
                dispatch(updateSupplier({ id: defaultValue?.id as string, changes: supplier as supplierType }))
            }

            toast({
                description: `Successfully ${workString}`
            })

        } catch (error) {
            toast({
                variant: "destructive",
                description: `Failed to ${workString} supplier`
            })
        }

        setloading(false)
    }

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle>
                    Supplier
                </Di.DialogTitle>
                <Di.DialogDescription>
                    All field need to be filled, otherwise nothing work
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <div className="w-full h-[60vh] flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        {textfields.map((textField, i) => (
                            <FormField
                                key={i}
                                control={form.control}
                                name={textField.name}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{textField.label}</FormLabel>
                                        <FormControl>
                                            <Input
                                                number={textField.type === 'number'}
                                                placeholder={textField.placeholder}
                                                {...field}
                                                {...form.register(textField.name)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {textField.description}
                                        </FormDescription>
                                        <FormMessage className="text-[0.65rem]" />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Supplier Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter supplier address"
                                            className="resize-none"
                                            {...field}
                                            {...form.register("address")}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Example: John doe street no.4
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Di.DialogFooter>
                        <Button type='submit' loading={loading}>
                            Save Supplier
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent>
    )
})

Supplier.displayName = 'Supplier'
export default Supplier