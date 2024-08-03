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
import { categoryFormSchema as formSchema } from "@/lib/formSchemaValidation";
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from "../ui/use-toast"
import { fetcher } from "@/lib/utils"
import { addCategory, updateCategory } from "@/store/reducers/categoryReducer"
import { categoryType, messageType } from "@/lib/types"
import { resetProduct } from "@/store/reducers/productReducer"
import { fetchDashboards } from "@/store/reducers/dashboardReducer"
import { dispatch } from "@/store"
import { getPermissions } from "@/store/reducers/authReducer"

const Category = forwardRef(({ defaultValue, edit }: { defaultValue?: categoryType, edit?: boolean }, ref) => {
    const { form } = useCommonForm(formSchema, ref as any, defaultValue && defaultValue);
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const workString = edit ? 'update' : 'add';
    const { permissions } = getPermissions();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setloading(true);
        let category;

        try {
            if (!edit) {
                category = await fetcher('/api/category/create', { ...values }) as categoryType<messageType>
                dispatch(addCategory(category));
            } else {
                if (!permissions.editCategory) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }
                category = await fetcher('/api/category/update', { id: defaultValue?.id, ...values }) as categoryType<messageType>
                dispatch(updateCategory({ id: defaultValue?.id as string, changes: category }))
                dispatch(resetProduct())
            }

            toast({
                description: `Successfully ${workString} category`
            })

        } catch (error) {
            toast({
                description: `Failed to ${workString} category`
            })
        }

        dispatch(fetchDashboards())
        setloading(false);

    }

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle>
                    Category
                </Di.DialogTitle>
                <Di.DialogDescription >
                    All field need to be filled, otherwise nothing work
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="w-full flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Category Name" {...field} {...form.register("categoryName")} />
                                    </FormControl>
                                    <FormDescription>
                                        Example : Smartphone
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Di.DialogFooter>
                        <Button type='submit' loading={loading} className="capitalize">
                            {workString} Category
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent>
    )
})

Category.displayName = 'Category';
export default Category