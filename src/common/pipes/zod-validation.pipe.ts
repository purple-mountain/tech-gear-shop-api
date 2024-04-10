import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: any) {}

    // eslint-disable-next-line
    transform(value: any, metadata: ArgumentMetadata) {
        this.schema.parse(value);
        return value;
    }
}
