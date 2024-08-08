import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/providers/prisma/prisma.service";
import { RedisCacheService } from "src/providers/cache/redis/redis-cache.service";
import { ProductService } from "../services/product.service";

const categoryId = 1;

const products = [
    {
        id: 1,
        name: "UltraBook Pro",
        price: 1500,
        categoryId: categoryId,
        imageId: null,
        createdAt: new Date("2024-07-26T16:41:25.256Z"),
        updatedAt: new Date("2024-07-26T16:41:25.256Z"),
    },
    {
        id: 2,
        name: "GamerX Turbo",
        price: 1200,
        categoryId: categoryId,
        imageId: null,
        createdAt: new Date("2024-07-26T16:41:25.256Z"),
        updatedAt: new Date("2024-07-26T16:41:25.256Z"),
    },
];

const product = products[0];
const productWithReviews = {
    product,
    review: [],
};

const prismaService = {
    product: {
        findMany: jest.fn().mockResolvedValue(products),
        findUnique: jest.fn().mockResolvedValue(productWithReviews),
        create: jest.fn().mockReturnValue(product),
        update: jest.fn().mockResolvedValue(product),
        delete: jest.fn().mockResolvedValue(product),
    },
};

const cacheManager = {
    setExpiryTime: jest.fn(),
    getData: jest.fn().mockResolvedValue(undefined),
    getAllData: jest.fn(),
    setData: jest.fn().mockResolvedValue(1),
    deleteData: jest.fn().mockResolvedValue(1),
    dataExists: jest.fn().mockResolvedValue(false),
};

describe("ProductService", () => {
    let service: ProductService;
    // eslint-disable-next-line
    let prisma: PrismaService;
    // eslint-disable-next-line
    let cache: RedisCacheService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: PrismaService, useValue: prismaService },
                { provide: RedisCacheService, useValue: cacheManager },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        prisma = module.get<PrismaService>(PrismaService);
        cache = module.get<RedisCacheService>(RedisCacheService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getAll", () => {
        it("should return an array of products", async () => {
            expect(service.getAll()).resolves.toEqual(products);
        });
    });

    describe("getOne", () => {
        it("should get a single product", () => {
            expect(service.getOne(1)).resolves.toEqual(productWithReviews);
        });
    });

    describe("createOne", () => {
        it("should successfully create a product", () => {
            expect(
                service.createOne({
                    name: "UltraBook Pro",
                    price: 1500,
                    categoryId: categoryId,
                    imageId: null,
                }),
            ).resolves.toEqual(product);
        });
    });

    describe("updateOne", () => {
        it("should update an existing product", async () => {
            const updProduct = await service.editOne(1, {
                name: "UltraBook Pro",
                price: 1500,
                categoryId: categoryId,
                imageId: null,
            });
            expect(updProduct).toEqual(product);
        });
    });

    describe("deleteOne", () => {
        it("should return deleted products", () => {
            expect(service.deleteOne(1)).resolves.toEqual(product);
        });
    });
});
