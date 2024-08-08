import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import {
    ProductReqBodyDto,
    ProductResBodyDto,
    ProductWithoutReviewsResBodyDto,
} from "../dto/product.dto";

type BatchPayload = {
    count: number;
};

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

describe("ProductController", () => {
    let controller: ProductController;
    // eslint-disable-next-line
    let service: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        getAll: jest
                            .fn<Promise<ProductWithoutReviewsResBodyDto[]>, []>()
                            .mockImplementation(() => Promise.resolve([...products])),
                        getOne: jest
                            .fn<Promise<ProductResBodyDto>, [number]>()
                            .mockImplementation((id: number) =>
                                Promise.resolve({
                                    ...products[0],
                                    id: id,
                                    review: [],
                                }),
                            ),
                        deleteOne: jest
                            .fn<Promise<ProductWithoutReviewsResBodyDto>, [number]>()
                            .mockImplementation((id: number) =>
                                Promise.resolve({
                                    ...products[0],
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
                            .fn<
                                Promise<ProductWithoutReviewsResBodyDto>,
                                [ProductReqBodyDto]
                            >()
                            .mockImplementation((body: ProductReqBodyDto) =>
                                Promise.resolve({
                                    id: products.length + 1,
                                    ...body,
                                }),
                            ),
                        editOne: jest
                            .fn<
                                Promise<ProductWithoutReviewsResBodyDto>,
                                [number, ProductReqBodyDto]
                            >()
                            .mockImplementation((id: number, body: ProductReqBodyDto) =>
                                Promise.resolve({
                                    ...body,
                                    id: id,
                                }),
                            ),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        service = module.get<ProductService>(ProductService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getAll", () => {
        it("should get all products", async () => {
            await expect(controller.getAll()).resolves.toEqual([...products]);
        });
    });

    describe("getOne", () => {
        it("should get one product", async () => {
            await expect(controller.getOne(1)).resolves.toEqual({
                ...products[0],
                id: 1,
                review: [],
            });

            await expect(controller.getOne(2)).resolves.toEqual({
                ...products[0],
                id: 2,
                review: [],
            });
        });
    });

    describe("createOne", () => {
        it("should create a new product", async () => {
            const newProduct = {
                name: "UltraBook Air",
                price: 1000,
                categoryId: categoryId,
                imageId: null,
            };

            await expect(controller.createOne(newProduct)).resolves.toEqual({
                ...newProduct,
                id: 3,
            });
        });
    });

    describe("updateOne", () => {
        it("should update an existing product", async () => {
            const editedProduct = {
                name: "UltraBook Air",
                price: 1000,
                categoryId: categoryId,
                imageId: null,
            };

            await expect(controller.editOne(1, editedProduct)).resolves.toEqual({
                ...editedProduct,
                id: 1,
            });
        });
    });

    describe("deleteOne", () => {
        it("should delete a product", async () => {
            await expect(controller.deleteOne(1)).resolves.toEqual({
                ...products[0],
                id: 1,
            });
        });
    });

    describe("deleteMany", () => {
        it("should delete many products", async () => {
            await expect(controller.deleteMany([1, 2, 3])).resolves.toEqual({
                count: 3,
            });
        });
    });
});
