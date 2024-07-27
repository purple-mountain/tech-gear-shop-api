import { Injectable } from "@nestjs/common";
import { RedisCacheService } from "src/providers/cache/redis/redis-cache.service";
import { PrismaService } from "src/providers/prisma/prisma.service";
import { CategoryReqBodyDto } from "../dto/category.dto";

@Injectable()
export class CategoryService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheManager: RedisCacheService,
    ) {}
    async getAll() {
        return this.prismaService.category.findMany();
    }
    async getOne(id: number) {
        const cachedData = await this.cacheManager.getData("category", id.toString());
        if (cachedData) {
            this.cacheManager.setExpiryTime("category", 60 * 60 * 24 * 14, "GT");
            console.log("Cache hit: ", cachedData);
            return cachedData;
        }
        const category = await this.prismaService.category.findUnique({
            where: { id: id },
            include: {
                products: true,
            },
        });
        this.cacheManager.setData("category", id.toString(), category);
        this.cacheManager.setExpiryTime("category", 60 * 60 * 24 * 14);
        return category;
    }
    async deleteOne(id: number) {
        await this.cacheManager.deleteData("category", id.toString());
        return this.prismaService.category.delete({ where: { id: id } });
    }
    async deleteMany(ids: number[]) {
        await this.cacheManager.deleteData("category", ...ids.toString().split(","));
        return this.prismaService.category.deleteMany({
            where: { id: { in: ids } },
        });
    }
    async createOne(category: CategoryReqBodyDto) {
        return this.prismaService.category.create({
            data: category,
        });
    }
    async editOne(id: number, category: CategoryReqBodyDto) {
        const cacheExists = await this.cacheManager.dataExists("category", id.toString());
        if (cacheExists) {
            this.cacheManager.setData("category", id.toString(), category);
        }

        return this.prismaService.category.update({
            where: { id: id },
            data: category,
        });
    }
}
