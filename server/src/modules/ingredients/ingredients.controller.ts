import { Body, Controller, Get, Param, Post, Put, Patch, Delete, Query } from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { PatchIngredientDto } from "./dto/patch-ingredient.dto";
import { IngredientCategory } from "./enums/ingredient.enum";

@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  // GET /ingredients - List ingredients with search
  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string,
    @Query("category") category?: IngredientCategory,
    @Query("created_by") createdBy?: string,
  ) {
    const filters = {
      page,
      limit,
      search,
      category,
      createdBy,
    };
    return await this.ingredientsService.findAll(filters);
  }

  // GET /ingredients/search - Advanced search with aliases
  @Get("search")
  async search(@Query("q") query: string, @Query("lang") language?: string) {
    return await this.ingredientsService.searchByAliases(query, language);
  }

  // GET /ingredients/:id - Get ingredient by ID
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const result = await this.ingredientsService.findOne(id);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // POST /ingredients - Create new ingredient
  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    const result = await this.ingredientsService.create(createIngredientDto);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // PUT /ingredients/:id - Update entire ingredient
  @Put(":id")
  async update(@Param("id") id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    const result = await this.ingredientsService.update(id, updateIngredientDto);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // PATCH /ingredients/:id - Partial update
  @Patch(":id")
  async partialUpdate(@Param("id") id: string, @Body() patchIngredientDto: PatchIngredientDto) {
    const result = await this.ingredientsService.partialUpdate(id, patchIngredientDto);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // DELETE /ingredients/:id - Delete ingredient
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const result = await this.ingredientsService.remove(id);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }
}
