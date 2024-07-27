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
import { CategoryService } from "../services/category.service";
import {
    CategoryReqBodyDto,
    CategoryResBodyDto,
    CategoryWithProductsResBodyDto,
    categoryReqBodySchema,
} from "../dto/category.dto";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@ApiTags("Categories")
@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({
        summary: "Get All Categories",
    })
    @ApiResponse({
        status: 200,
        description: "Get All Categories",
        type: [CategoryResBodyDto],
    })
    @Get()
    getAll() {
        return this.categoryService.getAll();
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get One Category",
    })
    @ApiResponse({
        status: 200,
        description: "Get One Category",
        type: [CategoryWithProductsResBodyDto],
    })
    getOne(@Param("id", ParseIntPipe) id: number) {
        return this.categoryService.getOne(id);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Delete One Category",
    })
    @ApiResponse({
        status: 200,
        description: "Delete One Category",
        type: [CategoryResBodyDto],
    })
    @Delete(":id")
    deleteOne(@Param("id", ParseIntPipe) id: number) {
        return this.categoryService.deleteOne(id);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Delete Many Categories",
    })
    @ApiResponse({
        status: 200,
        description: "Delete Many Categories",
    })
    @Delete()
    deleteMany(@Body(new ParseArrayPipe({ items: Number })) ids: number[]) {
        return this.categoryService.deleteMany(ids);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Create One Category",
    })
    @ApiResponse({
        status: 200,
        description: "Create One Category",
        type: [CategoryResBodyDto],
    })
    @Post()
    createOne(
        @Body(new ZodValidationPipe(categoryReqBodySchema))
        createCategory: CategoryReqBodyDto,
    ) {
        return this.categoryService.createOne(createCategory);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Edit One Category Name",
    })
    @ApiResponse({
        status: 200,
        description: "Edit One Category Name",
        type: [CategoryResBodyDto],
    })
    @Patch(":id")
    editOne(
        @Param("id", ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(categoryReqBodySchema))
        editCategory: CategoryReqBodyDto,
    ) {
        return this.categoryService.editOne(id, editCategory);
    }
}
