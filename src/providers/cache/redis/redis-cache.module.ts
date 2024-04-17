import { Global, Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";
import { RedisClientOptions } from "redis";
import { RedisCacheService } from "./redis-cache.service";

@Global()
@Module({
    imports: [
        CacheModule.register<RedisClientOptions>({
            isGlobal: true,
            store: redisStore,
            socket: {
                host: process.env.REDIS_HOST ?? "localhost",
                port: parseInt(process.env.REDIS_PORT ?? "6379"),
            },
            password: process.env.REDIS_PASSWORD ?? "root",
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}
