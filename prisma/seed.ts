import { randBetweenDate, randNumber } from '@ngneat/falso';
import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cleanCollections = async () => {
    await prisma.orderDetail.deleteMany({});
    await prisma.stockIn.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.supplier.deleteMany({});
    await prisma.category.deleteMany({});
}

const populateProduct = async () => {
    const readCategory = await prisma.category.findMany({});
    const readSupplier = await prisma.supplier.findMany({});

    for(let i = 0; i <= 100; i++) {
        const randomCategoryId = faker.helpers.arrayElement(readCategory.map(category => category.id));
        const randomSupplierId = faker.helpers.arrayElement(readSupplier.map(supplier => supplier.id));

        await prisma.product.create({
            data: {
                productName: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                categoryId: randomCategoryId,
                unitPrice: randNumber({min: 10000, max: 300000}),
                productImage: faker.internet.avatar(),
                reorderLevel: randNumber({min: 1, max: 5}),
                quantityInStock: randNumber({min: 10, max: 20}),
                supplierId: randomSupplierId,
                createdBy: 'user',
                updatedBy: 'user'
            }
        })
    }
}

const populateOrder = async () => {
    const readProducts = await prisma.product.findMany({});

    try {
        for (let i = 0; i < 100; i++) {
            const orderDetails = []
            let totalAmount = 0;
            const randomArrayLength = randNumber({ min: 2, max: 4 });
            const orderDate = randBetweenDate({
                from: new Date("2023-01-01"),
                to: new Date("2023-12-20")
            })

            for (let i = 0; i < randomArrayLength; i++) {
                const randomQuantity = randNumber({ min: 2, max: 4 });
                const randomProductId = faker.helpers.arrayElement(
                    readProducts.map(product => product.id)
                );
                const productBasedOnRandomProductId = readProducts.find(product => product.id === randomProductId);
                const subTotal = randomQuantity * (productBasedOnRandomProductId?.unitPrice || 1);
                totalAmount += subTotal;
                const orderDetailProductFaker = {
                    productId: randomProductId,
                    quantity: randomQuantity,
                    unitPrice: productBasedOnRandomProductId?.unitPrice as number,
                    subTotal: subTotal
                };
                orderDetails.push(orderDetailProductFaker);
            }

            await prisma.order.create({
                data: {
                    customerName: faker.person.fullName(),
                    customerAddress: faker.location.streetAddress({ useFullAddress: true }),
                    orderDate,
                    totalAmount: totalAmount,
                    createdBy: 'user',
                    updatedBy: 'user',
                    orderDetails: {
                        create: orderDetails
                    },
                }
            })
        }

    } catch (error) {
        throw error
    }
}

const populateSupplier = async () => {

    for(let i = 0; i < 100; i++){
        await prisma.supplier.create({
            data: {
                supplierName: faker.company.name(),
                contactName: faker.person.firstName(),
                address: faker.location.streetAddress({useFullAddress: true}),
                contactEmail: faker.internet.email({provider: 'gmail.com'}),
                contactPhone: faker.phone.number(),
                createdBy: 'user',
                updatedBy: 'user'

            }
        })
    }
}

const populateCategory = async () => {

    for(let i = 0; i < 10; i++){
        await prisma.category.create({
            data: {
                categoryName: faker.lorem.word(),
                createdBy: 'user',
                updatedBy: 'user'

            }
        })
    }
}

const populateStocks = async () => {
    const readProducts = await prisma.product.findMany({});

    for(let i = 0; i < 100; i++) {
        const productId = faker.helpers.arrayElement(
            readProducts.map(product => product.id)
        );
        const quantity = randNumber({ min: 2, max: 5 });
        const productBasedOnRandomProductId = readProducts.find(product => product.id === productId);
        const totalPrice = quantity * (productBasedOnRandomProductId?.unitPrice || 1);
        const createdAt = randBetweenDate({
            from: new Date("2023-01-01"),
            to: new Date("2023-12-20")
        })

        await prisma.stockIn.create({
            data: {
                productId,
                quantity,
                createdAt,
                totalPrice,
                createdBy: 'user',
                updatedBy: 'user'
            }
        })
    }
}

async function initiate() {
    await cleanCollections()
    await populateCategory()
    await populateSupplier()
    await populateProduct()
    await populateOrder()
    await populateStocks()
}

initiate();