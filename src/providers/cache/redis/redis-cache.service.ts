import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { RedisCache } from "cache-manager-redis-yet";

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

    get redis() {
        return this.cacheManager.store.client;
    }

    async setExpiryTime(key: string, time: number, mode?: "NX" | "XX" | "GT" | "LT") {
        return this.redis.expire(key, time, mode);
    }

    async getData(key: string, field: string) {
        return this.redis.hGet(key, field);
    }

    async getAllData(key: string) {
        return this.redis.hGetAll(key);
    }

    async setData<T>(key: string, field: string, value: T) {
        return this.redis.hSet(key, field, JSON.stringify(value));
    }

    async deleteData(key: string, ...field: string[]) {
        return this.redis.hDel(key, field);
    }

    async dataExists(key: string, field: string) {
        return this.redis.hExists(key, field);
    }
}
