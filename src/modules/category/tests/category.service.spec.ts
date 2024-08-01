import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "../services/category.service";
import { PrismaService } from "src/providers/prisma/prisma.service";
import { RedisCacheService } from "src/providers/cache/redis/redis-cache.service";

const categories = [
    { name: "laptops", id: 1 },
    { name: "headphones", id: 2 },
    { name: "TV", id: 7 },
];

const category = categories[0];
const categoryWithProducts = {
    ...categories[0],
    products: [
        {
            id: 1,
            name: "UltraBook Pro",
            price: 1500,
            categoryId: categories[0].id,
            createdAt: new Date("2024-07-26T16:41:25.256Z"),
            updatedAt: new Date("2024-07-26T16:41:25.256Z"),
        },
        {
            id: 2,
            name: "GamerX Turbo",
            price: 1200,
            categoryId: categories[0].id,
            createdAt: new Date("2024-07-26T16:41:25.256Z"),
            updatedAt: new Date("2024-07-26T16:41:25.256Z"),
        },
    ],
};

const prismaService = {
    category: {
        findMany: jest.fn().mockResolvedValue(categories),
        findUnique: jest.fn().mockResolvedValue(categoryWithProducts),
        create: jest.fn().mockReturnValue(category),
        update: jest.fn().mockResolvedValue(category),
        delete: jest.fn().mockResolvedValue(category),
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

describe("CategoryService", () => {
    let service: CategoryService;
    // eslint-disable-next-line
    let prisma: PrismaService;
    // eslint-disable-next-line
    let cache: RedisCacheService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                { provide: PrismaService, useValue: prismaService },
                { provide: RedisCacheService, useValue: cacheManager },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        prisma = module.get<PrismaService>(PrismaService);
        cache = module.get<RedisCacheService>(RedisCacheService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getAll", () => {
        it("should return an array of categories", async () => {
            expect(service.getAll()).resolves.toEqual(categories);
        });
    });

    describe("getOne", () => {
        it("should get a single category", () => {
            expect(service.getOne(1)).resolves.toEqual(categoryWithProducts);
        });
    });

    describe("createOne", () => {
        it("should successfully create a category", () => {
            expect(
                service.createOne({
                    name: "laptops",
                }),
            ).resolves.toEqual(category);
        });
    });

    describe("updateOne", () => {
        it("should update existing category", async () => {
            const updCategory = await service.editOne(1, {
                name: "laptops",
            });
            expect(updCategory).toEqual(category);
        });
    });

    describe("deleteOne", () => {
        it("should return deleted category", () => {
            expect(service.deleteOne(1)).resolves.toEqual(category);
        });
    });
});