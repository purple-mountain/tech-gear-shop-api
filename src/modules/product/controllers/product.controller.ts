import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import {
    ProductReqBodyDto,
    ProductResBodyDto,
    ProductWithoutReviewsResBodyDto,
    productReqBodySchema,
} from "../dto/product.dto";

@ApiTags("Products")
@Controller("product")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({
        summary: "Get All Products",
    })
    @ApiResponse({
        status: 200,
        description: "Get All Products",
        type: [ProductWithoutReviewsResBodyDto],
    })
    @Get()
    getAll() {
        return this.productService.getAll();
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get One Product",
    })
    @ApiResponse({
        status: 200,
        description: "Get One Product",
        type: [ProductResBodyDto],
    })
    getOne(@Param("id", ParseIntPipe) id: number) {
        return this.productService.getOne(id);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Delete One Product",
    })
    @ApiResponse({
        status: 200,
        description: "Delete One Product",
        type: [ProductWithoutReviewsResBodyDto],
    })
    @Delete(":id")
    deleteOne(@Param("id", ParseIntPipe) id: number) {
        return this.productService.deleteOne(id);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Delete Many Products",
    })
    @ApiResponse({
        status: 200,
        description: "Delete Many Products",
    })
    @Delete()
    deleteMany(@Body(new ParseArrayPipe({ items: Number })) ids: number[]) {
        return this.productService.deleteMany(ids);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Create One Product",
    })
    @ApiResponse({
        status: 200,
        description: "Create One Product",
        type: [ProductWithoutReviewsResBodyDto],
    })
    @Post()
    createOne(
        @Body(new ZodValidationPipe(productReqBodySchema))
        createProduct: ProductReqBodyDto,
    ) {
        return this.productService.createOne(createProduct);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Edit One Product",
    })
    @ApiResponse({
        status: 200,
        description: "Edit One Product",
        type: [ProductWithoutReviewsResBodyDto],
    })
    @Patch(":id")
    editOne(
        @Param("id", ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(productReqBodySchema))
        editProduct: ProductReqBodyDto,
    ) {
        return this.productService.editOne(id, editProduct);
    }
}
