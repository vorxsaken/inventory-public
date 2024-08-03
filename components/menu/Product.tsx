import * as Di from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { forwardRef, useState } from 'react';
import { productFormSchema as formSchema } from "@/lib/formSchemaValidation"
import useCommonForm from "@/lib/useCommonForm"
import { z } from 'zod'
import { useSelector } from "react-redux"
import { selectAllSupplier } from "@/store/reducers/supplierReducer"
import { selectAllCategories } from "@/store/reducers/categoryReducer"
import { compressImage, fetcher, uploadImage, uploadImagesToFirebase } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { addProduct, updateProduct } from "@/store/reducers/productReducer"
import { categoryType, productType, supplierType } from "@/lib/types"
import { fetchDashboards } from "@/store/reducers/dashboardReducer"
import { dispatch } from "@/store"
import { getPermissions } from "@/store/reducers/authReducer"

interface ProductFormType {
    edit?: boolean,
    defaultValue?: productType<categoryType, supplierType>
}

const Product = forwardRef(({ defaultValue, edit }: ProductFormType, ref) => {
    const { form } = useCommonForm(formSchema, ref as any, defaultValue && defaultValue)
    const [loading, setloading] = useState(false)
    const categories = useSelector(state => selectAllCategories(state));
    const suppliers = useSelector(state => selectAllSupplier(state));
    const { toast } = useToast();
    const workString = edit ? 'update' : 'add'
    const { permissions } = getPermissions();

    const textfields = [
        {
            name: 'productName',
            label: 'Product Name',
            placeholder: 'Enter your product name',
            description: 'Example: iphone 14',
            type: 'text',
            isCurrency: false
        }, {
            name: 'description',
            label: 'Description',
            placeholder: 'Enter product description',
            description: 'Example: best smartphone with the fastest processor',
            type: 'text',
            isCurrency: false
        },
        {
            name: 'unitPrice',
            label: 'Per Unit Price',
            placeholder: 'Enter product price',
            description: 'Example: 10.000',
            type: 'number',
            isCurrency: true
        },
        {
            name: 'reorderLevel',
            label: 'Reorder Level',
            placeholder: 'Enter product reorder level',
            description: 'Example: 5',
            type: 'number',
            isCurrency: false
        }
    ]

    const selectFields = [
        {
            name: 'categoryId',
            label: 'Category',
            description: 'Set product category',
            selectValue: 'Select a category',
            selectLabel: 'Categories',
            selectItem: categories.map(category => {
                if (category.message) {
                    return {
                        value: '',
                        itemText: (category as any).message
                    }
                }
                return {
                    value: category.id,
                    itemText: category.categoryName
                }
            })
        },
        {
            name: 'supplierId',
            label: 'Supplier',
            description: 'Set supplier of this product',
            selectValue: 'Select a supplier',
            selectLabel: 'Suppliers',
            selectItem: suppliers.map(supplier => {
                if ((supplier as any).message) {
                    return {
                        value: '',
                        itemText: (supplier as any).message
                    }
                }
                return {
                    value: supplier.id,
                    itemText: supplier.supplierName
                }
            })
        }
    ]

    const submitCallback = async (value: z.infer<typeof formSchema>) => {
        try {
            setloading(true);
            const { productImage } = value;
            const newUnitPrice = value.unitPrice.replace(/\D/g, '');
            let filename;

            if (!edit) {
                const { bigImage } = await compressImage(productImage);
                filename = await uploadImagesToFirebase(bigImage);
                const product = await fetcher('/api/product/create', { ...value, productImage: filename, unitPrice: newUnitPrice })

                dispatch(addProduct(product as any));
            } else {
                if (!permissions.editProduct) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }

                if (typeof productImage === 'string') {
                    filename = productImage;
                } else {
                    const { bigImage } = await compressImage(productImage);
                    filename = await uploadImagesToFirebase(bigImage);
                }

                const update = await fetcher('/api/product/update', {
                    id: defaultValue?.id,
                    ...value,
                    productImage: filename,
                    unitPrice: newUnitPrice,
                })

                dispatch(updateProduct({ id: defaultValue?.id as string, changes: update as productType }))
            }

            toast({
                description: `successfully ${workString} product`
            })

            dispatch(fetchDashboards())
            setloading(false);

        } catch (error) {
            toast({
                variant: 'destructive',
                description: `Failed to ${workString} product`
            })
        }

        setloading(false);
    }

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle>
                    Product
                </Di.DialogTitle>
                <Di.DialogDescription>
                    All field need to be filled, otherwise nothing work
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitCallback)} className="space-y-4">
                    <div className="h-[60vh] flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        <FormField
                            control={form.control}
                            name="productImage"
                            render={({ field }) => (
                                <FormItem className="w-full flex-center flex-col">
                                    <FormLabel>Product Image</FormLabel>
                                    <FormControl>
                                        <SelectImage value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        image of your product, please keep the image file size small ..
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        {
                            textfields.map(textField => (
                                <FormField
                                    key={textField.name}
                                    control={form.control}
                                    name={textField.name as any}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>{textField.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    number={textField.type === 'number'}
                                                    currency={textField.isCurrency}
                                                    placeholder={textField.placeholder}
                                                    {...field}
                                                    {...form.register(textField.name as any)}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                {textField.description}
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                            ))
                        }
                        {
                            selectFields.map(selectField => (
                                <FormField
                                    key={selectField.name}
                                    control={form.control}
                                    name={selectField.name as any}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>{selectField.label}</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        {field.value ? <SelectValue placeholder={selectField.selectValue} /> : selectField.selectValue}
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-72">
                                                        <SelectGroup>
                                                            <SelectLabel>{selectField.selectLabel}</SelectLabel>
                                                            {
                                                                selectField.selectItem.map(item => (
                                                                    <SelectItem
                                                                        key={item.value}
                                                                        value={item.value}
                                                                        disabled={item.value == ''}
                                                                    >
                                                                        {item.itemText}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                {selectField.description}
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                            ))
                        }
                    </div>
                    <Di.DialogFooter>
                        <Button type='submit' loading={loading} className="capitalize">
                            {workString} Product
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent >
    )
})

Product.displayName = 'Product';

export default Product;