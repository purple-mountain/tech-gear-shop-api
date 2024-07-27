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
import { AuthGuard } from "@nestjs/passport";
import { CategoryDto, categorySchema } from "../dto/category.dto";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({
        summary: "Get Categories",
    })
    @ApiResponse({
        status: 200,
        description: "Get Categories",
        type: [CategoryDto],
    })
    @Get()
    getAll() {
        return this.categoryService.getAll();
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get Category",
    })
    @ApiResponse({
        status: 200,
        description: "Get Category",
        type: [CategoryDto],
    })
    getOne(@Param("id", ParseIntPipe) id: number) {
        return this.categoryService.getOne(id);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({
        summary: "Delete Category",
    })
    @ApiResponse({
        status: 200,
        description: "Delete Category",
        type: [CategoryDto],
    })
    @Delete(":id")
    deleteOne(@Param("id", ParseIntPipe) id: number) {
        return this.categoryService.deleteOne(id);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({
        summary: "Delete Categories",
    })
    @ApiResponse({
        status: 200,
        description: "Delete Categories",
        type: [CategoryDto],
    })
    @Delete()
    deleteMany(@Body(new ParseArrayPipe({ items: Number })) ids: number[]) {
        return this.categoryService.deleteMany(ids);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({
        summary: "Create a Category",
    })
    @ApiResponse({
        status: 200,
        description: "Create a Category",
        type: [CategoryDto],
    })
    @Post()
    createOne(
        @Body(new ZodValidationPipe(categorySchema))
        createCategory: CategoryDto,
    ) {
        return this.categoryService.createOne(createCategory);
    }

    @ApiBearerAuth("Auth0")
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({
        summary: "Edit Category Name",
    })
    @ApiResponse({
        status: 200,
        description: "Edit Category Name",
        type: [CategoryDto],
    })
    @Patch(":id")
    editOne(
        @Param("id", ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(categorySchema))
        editCategory: CategoryDto,
    ) {
        return this.categoryService.editOne(id, editCategory);
    }
}
