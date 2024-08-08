import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/providers/prisma/prisma.service";
import { RedisCacheService } from "src/providers/cache/redis/redis-cache.service";
import { ProductReqBodyDto } from "../dto/product.dto";

@Injectable()
export class ProductService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheManager: RedisCacheService,
    ) {}

    async getAll() {
        return this.prismaService.product.findMany();
    }

    async getOne(id: number) {
        const cachedData = await this.cacheManager.getData("product", id.toString());

        if (cachedData) {
            this.cacheManager.setExpiryTime("product", 60 * 60 * 24 * 14, "GT");
            return cachedData;
        }

        const product = await this.prismaService.product.findUnique({
            where: { id: id },
            include: {
                review: true,
            },
        });

        this.cacheManager.setData("product", id.toString(), product);
        this.cacheManager.setExpiryTime("product", 60 * 60 * 24 * 14);
        return product;
    }

    async deleteOne(id: number) {
        await this.cacheManager.deleteData("product", id.toString());
        return this.prismaService.product.delete({ where: { id: id } });
    }

    async deleteMany(ids: number[]) {
        await this.cacheManager.deleteData("product", ...ids.toString().split(","));
        return this.prismaService.product.deleteMany({
            where: { id: { in: ids } },
        });
    }

    async createOne(product: ProductReqBodyDto) {
        return this.prismaService.product.create({
            data: product,
        });
    }

    async editOne(id: number, product: ProductReqBodyDto) {
        const cacheExists = await this.cacheManager.dataExists("product", id.toString());

        if (cacheExists) {
            await this.cacheManager.deleteData("product", id.toString());
        }

        return this.prismaService.product.update({
            where: { id: id },
            data: product,
        });
    }
}
