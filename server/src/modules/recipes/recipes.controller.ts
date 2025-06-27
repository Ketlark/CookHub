import { Body, Controller, Get, Param, Patch, Post, Put, Delete, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PatchRecipeDto } from './dto/patch-recipe.dto';
import { RecipeDifficulty } from './entities/recipe.entity';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // GET /recipes - List recipes with filtering
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('difficulty') difficulty?: RecipeDifficulty,
    @Query('diet') diet?: string,
    @Query('maxCookingTime') maxCookingTime?: number,
    @Query('search') search?: string,
    @Query('draft') draft?: boolean,
    @Query('author') author?: string
  ) {
    const filters = {
      page,
      limit,
      difficulty,
      diet,
      maxCookingTime,
      search,
      draft,
      author
    };
    return await this.recipesService.findAll(filters);
  }

  // GET /recipes/drafts - List user's drafts
  @Get('drafts')
  async findDrafts(@Query('author') author: string) {
    return await this.recipesService.findDraftsByAuthor(author);
  }

  // GET /recipes/:id - Get recipe by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.recipesService.findOne(id);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // POST /recipes - Create new recipe
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const result = await this.recipesService.create(createRecipeDto);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // PUT /recipes/:id - Update entire recipe
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    const result = await this.recipesService.update(id, updateRecipeDto);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // PATCH /recipes/:id - Partial update
  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() patchRecipeDto: PatchRecipeDto) {
    const result = await this.recipesService.partialUpdate(id, patchRecipeDto);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // DELETE /recipes/:id - Delete recipe
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.recipesService.remove(id);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // POST /recipes/:id/publish - Publish draft
  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    const result = await this.recipesService.publish(id);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }

  // POST /recipes/:id/unpublish - Unpublish recipe
  @Post(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    const result = await this.recipesService.unpublish(id);
    
    if (result.isErr()) {
      throw result.error;
    }
    
    return result.value;
  }
}
