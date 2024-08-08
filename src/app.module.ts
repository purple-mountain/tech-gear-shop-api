import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./providers/prisma/prisma.module";
import { CategoryModule } from "./modules/category/category.module";
import { RedisCacheModule } from "./providers/cache/redis/redis-cache.module";
import { ProductModule } from "./modules/product/product.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        RedisCacheModule,
        PrismaModule,
        AuthModule,
        CategoryModule,
        ProductModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
