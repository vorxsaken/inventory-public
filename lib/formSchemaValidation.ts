import { z } from "zod"

const MAX_FILE_SIZE = 500000;
const ACC_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


const productFormSchema = z.object({
    productImage: z
        .any()
        .refine((file) => file != null, "Product image required")
        .refine((file) => {
            if (typeof file === 'string') return true;
            if (file?.size <= MAX_FILE_SIZE) return true;
        }, 'Max image file size is 5mb')
        .refine((file) => {
            if (typeof file === 'string') return true;
            if (ACC_IMAGE_TYPES.includes(file?.type)) return true;
        }, 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
    productName: z.string()
        .refine((string) => string !== '', 'Product name required')
        .refine((string) => string.length >= 2, 'Product name must be atleast 2 characters'),
    description: z.string()
        .refine((string) => string !== '', 'Product Description required')
        .refine((string) => string.length >= 10, "Product description must be atleast 10 characters"),
    unitPrice: z.string()
        .refine((string) => string !== '', 'Product Price Required')
        .refine((string) => parseInt(string) > 0, 'Product price need to be more than 0'),
    reorderLevel: z.string()
        .refine((string) => string !== '', 'Product reorder level Required')
        .refine((string) => parseInt(string) > 0, 'Product reorder level need to be more than 0'),
    categoryId: z.string({
        required_error: "category required",
    }),
    supplierId: z.string({
        required_error: "supplier required"
    })

})

const categoryFormSchema = z.object({
    categoryName: z.string()
        .refine((string) => string !== '', 'Category name required')
        .refine((string) => string.length >= 3, 'Category name must be atleast 3 characters')
})

const supplierFormSchema = z.object({
    supplierName: z.string()
        .refine((string) => string !== '', 'Supplier name required')
        .refine((string) => string.length >= 5, 'Supplier name must be atleast 5 characters'),
    contactName: z.string()
        .refine((string) => string !== '', 'Contact name required')
        .refine((string) => string.length >= 5, 'Contact name must be atleast 5 characters'),
    contactEmail: z.string()
        .refine((string) => string !== '', 'Contact email required')
        .refine((string) => EMAIL_PATTERN.test(string), 'Field need to be an valid email'),
    contactPhone: z.string()
        .refine((string) => string !== '', 'Contact phone required')
        .refine((string) => string.length >= 10, 'Contact phone must be atleast 10 characters'),
    address: z.string()
        .refine((string) => string !== '', 'Address required')
        .refine((string) => string.length >= 12, 'Address must be atleast 12 characters'),
})

const roleFormSchema = z.object({
    roleName: z.string()
        .refine((string) => string !== '', 'Supplier name required')
        .refine((string) => string.length >= 5, 'Supplier name must be atleast 5 characters')
})

const userFormSchema = z.object({
    image: z
        .any()
        .refine((file) => file != null, "User photo required")
        .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max image file size is 5mb')
        .refine((file) => ACC_IMAGE_TYPES.includes(file?.type)
            , 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
    username: z.string()
        .refine((string) => string !== '', 'User name required')
        .refine((string) => string.length >= 3, 'User name must be atleast 3 characters'),
    password: z.string()
        .refine((string) => string !== '', 'Password required')
        .refine((string) => PASSWORD_PATTERN.test(string),
            "Password need to have at least 1 uppercase lowercase, numeric, and non alpha numeric character"),
    email: z.string()
        .refine((string) => string !== '', 'Email Required')
        .refine((string) => EMAIL_PATTERN.test(string), 'Field need to be an valid email'),
    roleId: z.string({
        required_error: "Role required"
    })
}
)

const userEditFormSchema = z.object({
    image: z
        .any()
        .refine((file) => file != null, "user image required")
        .refine((file) => {
            if (typeof file === 'string') return true;
            if (file?.size <= MAX_FILE_SIZE) return true;
        }, 'Max image file size is 5mb')
        .refine((file) => {
            if (typeof file === 'string') return true;
            if (ACC_IMAGE_TYPES.includes(file?.type)) return true;
        }, 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
    username: z.string()
        .refine((string) => string !== '', 'User name required')
        .refine((string) => string.length >= 3, 'User name must be atleast 3 characters'),
    password: z.string().optional(),
    email: z.string()
        .refine((string) => string !== '', 'Email Required')
        .refine((string) => EMAIL_PATTERN.test(string), 'Field need to be an valid email'),
    roleId: z.string({
        required_error: "Role required"
    })
})

const orderFormSchema = z.object({
    customerName: z.string().optional(),
    customerAddress: z.string().optional(),
    orderDate: z.date(),
    totalAmount: z.string(),
    orderDetails: z.array(z.object({
        productId: z.string(),
        quantity: z.union([z.string(), z.number()]),
        unitPrice: z.string(),
        subTotal: z.string()
    })).nonempty('')
})

const editOrderFormSchema = z.object({
    customerName: z.string().optional(),
    customerAddress: z.string().optional(),
    orderDate: z.date(),
    totalAmount: z.string()
})

const stockInSchema = z.object({
    productId: z.string(),
    quantity: z.string()
        .refine((string) => string !== '', 'Quantity Required')
        .refine((string) => parseInt(string) > 0, 'Quantity need to be more than 0'),
    totalPrice: z.string()
        .refine((string) => string !== '', 'Total Price Required')
        .refine((string) => parseInt(string) > 0, 'Total price need to be more than 0'),
    createdAt: z.date()
})

const pickDateForm = z.object({
    start: z.date(),
    end: z.date()
})

export {
    productFormSchema,
    categoryFormSchema,
    supplierFormSchema,
    roleFormSchema,
    userFormSchema,
    userEditFormSchema,
    orderFormSchema,
    editOrderFormSchema,
    stockInSchema,
    pickDateForm
}