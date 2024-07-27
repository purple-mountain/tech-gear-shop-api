import { Test, TestingModule } from "@nestjs/testing";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";
import {
    CategoryReqBodyDto,
    CategoryResBodyDto,
    CategoryWithProductsResBodyDto,
} from "../dto/category.dto";

type BatchPayload = {
    count: number;
};

const categoryId = 1;
const categoryName = "Laptops";
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

describe("CategoryController", () => {
    let controller: CategoryController;
    // eslint-disable-next-line
    let service: CategoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                {
                    provide: CategoryService,
                    useValue: {
                        getAll: jest
                            .fn<Promise<CategoryResBodyDto[]>, []>()
                            .mockImplementation(() =>
                                Promise.resolve([
                                    { name: categoryName, id: categoryId },
                                    { name: "Headphones", id: 2 },
                                ]),
                            ),
                        getOne: jest
                            .fn<Promise<CategoryWithProductsResBodyDto>, [number]>()
                            .mockImplementation((id: number) =>
                                Promise.resolve({
                                    name: categoryName,
                                    id: id,
                                    products: products,
                                }),
                            ),
                        deleteOne: jest
                            .fn<Promise<CategoryResBodyDto>, [number]>()
                            .mockImplementation((id: number) =>
                                Promise.resolve({
                                    name: categoryName,
                                    id: id,
                                }),
                            ),
                        deleteMany: jest
                            .fn<Promise<BatchPayload>, [number[]]>()
                            .mockImplementation((id: number[]) =>
                                Promise.resolve({
                                    count: id.length,
                                }),
                            ),
                        createOne: jest
                            .fn<Promise<CategoryResBodyDto>, [CategoryReqBodyDto]>()
                            .mockImplementation((body: CategoryReqBodyDto) =>
                                Promise.resolve({
                                    id: categoryId,
                                    ...body,
                                }),
                            ),
                        editOne: jest
                            .fn<
                                Promise<CategoryResBodyDto>,
                                [number, CategoryReqBodyDto]
                            >()
                            .mockImplementation((id: number, body: CategoryReqBodyDto) =>
                                Promise.resolve({
                                    ...body,
                                    id: id,
                                }),
                            ),
                    },
                },
            ],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
        service = module.get<CategoryService>(CategoryService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getAll", () => {
        it("should get all categories", async () => {
            await expect(controller.getAll()).resolves.toEqual([
                { name: categoryName, id: categoryId },
                { name: "Headphones", id: 2 },
            ]);
        });
    });

    describe("getOne", () => {
        it("should get one category", async () => {
            await expect(controller.getOne(1)).resolves.toEqual({
                name: categoryName,
                id: 1,
                products: products,
            });

            await expect(controller.getOne(2)).resolves.toEqual({
                name: categoryName,
                id: 2,
                products: products,
            });
        });
    });

    describe("createOne", () => {
        it("should create a new category", async () => {
            const newCategory = {
                name: "Phones",
            };

            await expect(controller.createOne(newCategory)).resolves.toEqual({
                ...newCategory,
                id: categoryId,
            });
        });
    });

    describe("updateOne", () => {
        it("should update an existing category", async () => {
            const newCategory = {
                name: "Updated Phones",
            };

            await expect(controller.editOne(categoryId, newCategory)).resolves.toEqual({
                ...newCategory,
                id: categoryId,
            });
        });
    });

    describe("deleteOne", () => {
        it("should delete a category", async () => {
            await expect(controller.deleteOne(categoryId)).resolves.toEqual({
                name: categoryName,
                id: categoryId,
            });
        });
    });

    describe("deleteMany", () => {
        it("should delete many categories", async () => {
            await expect(controller.deleteMany([categoryId, 2, 3])).resolves.toEqual({
                count: 3,
            });
        });
    });
});
