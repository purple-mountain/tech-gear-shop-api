import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const categoryReqBodySchema = z.object({
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
});

const categoryResBodySchema = z.object({
    id: z.number().int(),
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
});

const categoryWithProductsResBodySchema = z.object({
    id: z.number().int(),
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
    products: z
        .object({
            id: z.number().int(),
            name: z
                .string()
                .max(255, { message: "Name cannot be more than 255 characters long" }),
            price: z.number(),
            categoryId: z.number().int(),
            imageId: z.string().nullable(),
            createdAt: z.date(),
            updatedAt: z.date(),
        })
        .array(),
});

export class CategoryWithProductsResBodyDto extends createZodDto(
    categoryWithProductsResBodySchema,
) {}

export class CategoryResBodyDto extends createZodDto(categoryResBodySchema) {}

export class CategoryReqBodyDto extends createZodDto(categoryReqBodySchema) {}
