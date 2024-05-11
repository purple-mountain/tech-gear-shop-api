import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const categorySchema = z.object({
    name: z
        .string()
        .max(255, { message: "Name cannot be more than 255 characters long" }),
});

export class CategoryDto extends createZodDto(categorySchema) {}
