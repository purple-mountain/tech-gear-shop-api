import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const laptops = await prisma.category.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "laptops",
            products: {
                createMany: {
                    data: [
                        {
                            name: "UltraBook Pro",
                            price: 1500,
                        },
                        {
                            name: "GamerX Turbo",
                            price: 1200,
                        },
                        {
                            name: "PortaLight",
                            price: 800,
                        },
                    ],
                },
            },
        },
    });
    const headphones = await prisma.category.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: "headphones",
            products: {
                createMany: {
                    data: [
                        {
                            name: "BassBooster X",
                            price: 250,
                        },
                        {
                            name: "ClearSound Y",
                            price: 150,
                        },
                        {
                            name: "NoiseCanceller Z",
                            price: 300,
                        },
                    ],
                },
            },
        },
    });
    console.log({ laptops, headphones });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
