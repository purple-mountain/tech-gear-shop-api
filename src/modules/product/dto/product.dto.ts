import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const productReqBodySchema = z.object({
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
    price: z.number().int(),
    categoryId: z.number().int(),
    imageId: z.string().nullable(),
});

const productResBodySchema = z.object({
    id: z.number().int(),
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
    price: z.number().int(),
    categoryId: z.number().int(),
    imageId: z.string().nullable(),
    review: z
        .object({
            id: z.number().int(),
            productId: z.number().int(),
            userId: z.number().int(),
            rating: z.number().int(),
            text: z.string(),
        })
        .array(),
});

const productWithoutReviewsResBodySchema = z.object({
    id: z.number().int(),
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
    price: z.number().int(),
    categoryId: z.number().int(),
    imageId: z.string().nullable(),
});

export class ProductResBodyDto extends createZodDto(productResBodySchema) {}

export class ProductWithoutReviewsResBodyDto extends createZodDto(
    productWithoutReviewsResBodySchema,
) {}

export class ProductReqBodyDto extends createZodDto(productReqBodySchema) {}
