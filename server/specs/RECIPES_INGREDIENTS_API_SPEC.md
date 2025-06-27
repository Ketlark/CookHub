# CookHub API Specification: Recipes & Ingredients Modules

## Overview

Complete API specification for implementing CRUD operations on recipes and ingredients modules, aligning with the provided JSON specifications while maintaining clean architecture principles.

## Target JSON Specifications

### Recipe Structure
```json
{
  "_id": "uuid4",
  "translation_ref": "uuid4",
  "language": "fr",
  "title": "Crêpes bretonnes",
  "description": "Une recette traditionnelle...",
  "preview_image": "/uploads/crepes.jpg",
  "difficulty": "easy",
  "preparation_time": 40,
  "cooking_time": 20,
  "total_time": 60,
  "ingredients": [
    {
      "id": "farine_id",
      "quantity": 250,
      "unit": "g"
    },
    {
      "name": "Chocolat saveur noisette",
      "quantity": 100,
      "unit": "g"
    }
  ],
  "steps": [
    {
      "order": 1,
      "instructions": "Mélanger la farine et les œufs...",
      "media": [
        {
          "type": "image",
          "url": "/steps/step1.jpg"
        }
      ]
    }
  ],
  "diets": ["vegetarian"],
  "allergens": ["gluten"],
  "nutrition": {
    "calories": 230,
    "proteins": 8.5,
    "carbs": 30
  },
  "yield": 4,
  "author": "user-id",
  "created_at": "ISO 8601"
}
```

### Ingredient Structure
```json
{
  "_id": "ObjectId(...)",
  "name_key": "shiitake",
  "i18n": {
    "fr": "Champignon Shiitake",
    "en": "Shiitake Mushroom"
  },
  "aliases": ["shiitake", "champignon japonais"],
  "category": "vegetables",
  "created_by": "system|user_id",
  "nutrition": {}
}
```

## Implementation Requirements

### 1. Entity Updates

#### Recipe Entity (`src/modules/recipes/entities/recipe.entity.ts`)

**Add missing fields:**
- `translation_ref: string` - UUID for translation reference
- `language: string` - Language code (e.g., 'fr', 'en')
- `preview_image: string` - Main recipe image URL
- `preparation_time: number` - Prep time in minutes
- `cooking_time: number` - Cooking time in minutes
- `total_time: number` - Total time in minutes
- `diets: string[]` - Diet categories
- `allergens: string[]` - Allergen information
- `nutrition: RecipeNutrition` - Nutrition object
- `yield: number` - Number of servings
- `author: string` - Author ID (mocked for now)

**Update existing structures:**
- `RecipeIngredient` - Support both `id` (reference) and `name` (custom)
- `RecipeStep` - Add `media` array support
- `RecipeMetadata` - Remove or integrate into main entity

#### Ingredient Entity (`src/modules/ingredients/entity/ingredient.entity.ts`)

**Add missing fields:**
- `created_by: string` - 'system' or user ID
- `nutrition: IngredientNutrition` - Nutrition object (basic structure)

### 2. New Type Definitions

```typescript
// Recipe-related types
interface RecipeNutrition {
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}

interface RecipeStepMedia {
  type: 'image' | 'video';
  url: string;
}

interface RecipeIngredient {
  id?: string; // Reference to ingredient
  name?: string; // Custom ingredient name
  quantity: number;
  unit: string;
}

interface RecipeStep {
  order: number;
  instructions: string;
  media?: RecipeStepMedia[];
  duration?: number;
  temperature?: number;
}

// Ingredient-related types
interface IngredientNutrition {
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  // Add more as needed
}
```

### 3. Complete API Endpoints

#### Recipe Endpoints

```typescript
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
)

// GET /recipes/:id - Get recipe by ID
@Get(':id')
async findOne(@Param('id') id: string)

// POST /recipes - Create new recipe
@Post()
async create(@Body() createRecipeDto: CreateRecipeDto)

// PUT /recipes/:id - Update entire recipe
@Put(':id')
async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto)

// PATCH /recipes/:id - Partial update
@Patch(':id')
async partialUpdate(@Param('id') id: string, @Body() patchRecipeDto: PatchRecipeDto)

// DELETE /recipes/:id - Delete recipe
@Delete(':id')
async remove(@Param('id') id: string)

// POST /recipes/:id/publish - Publish draft
@Post(':id/publish')
async publish(@Param('id') id: string)

// POST /recipes/:id/unpublish - Unpublish recipe
@Post(':id/unpublish')
async unpublish(@Param('id') id: string)

// GET /recipes/drafts - List user's drafts
@Get('drafts')
async findDrafts(@Query('author') author: string)
```

#### Ingredient Endpoints

```typescript
// GET /ingredients - List ingredients with search
@Get()
async findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('search') search?: string,
  @Query('category') category?: IngredientCategory,
  @Query('created_by') createdBy?: string
)

// GET /ingredients/:id - Get ingredient by ID
@Get(':id')
async findOne(@Param('id') id: string)

// POST /ingredients - Create new ingredient
@Post()
async create(@Body() createIngredientDto: CreateIngredientDto)

// PUT /ingredients/:id - Update entire ingredient
@Put(':id')
async update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto)

// PATCH /ingredients/:id - Partial update
@Patch(':id')
async partialUpdate(@Param('id') id: string, @Body() patchIngredientDto: PatchIngredientDto)

// DELETE /ingredients/:id - Delete ingredient
@Delete(':id')
async remove(@Param('id') id: string)

// GET /ingredients/search - Advanced search with aliases
@Get('search')
async search(@Query('q') query: string, @Query('lang') language?: string)
```

### 4. DTO Specifications

#### Recipe DTOs

```typescript
// CreateRecipeDto
export class CreateRecipeDto {
  @IsNotEmpty() @IsString() title: string;
  @IsNotEmpty() @IsString() description: string;
  @IsOptional() @IsString() translation_ref?: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsString() preview_image?: string;
  @IsEnum(RecipeDifficulty) difficulty: RecipeDifficulty;
  @IsOptional() @IsNumber() preparation_time?: number;
  @IsOptional() @IsNumber() cooking_time?: number;
  @IsOptional() @IsNumber() total_time?: number;
  @IsOptional() @IsArray() ingredients?: RecipeIngredient[];
  @IsOptional() @IsArray() steps?: RecipeStep[];
  @IsOptional() @IsArray() diets?: string[];
  @IsOptional() @IsArray() allergens?: string[];
  @IsOptional() nutrition?: RecipeNutrition;
  @IsOptional() @IsNumber() yield?: number;
  @IsOptional() @IsString() author?: string; // Mock for now
  @IsOptional() @IsBoolean() is_draft?: boolean;
}

// UpdateRecipeDto - All fields optional
export class UpdateRecipeDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  // ... all other fields as optional
}

// PatchRecipeDto - Extends PartialType(CreateRecipeDto)
export class PatchRecipeDto extends PartialType(CreateRecipeDto) {}
```

#### Ingredient DTOs

```typescript
// CreateIngredientDto
export class CreateIngredientDto {
  @IsNotEmpty() @IsString() name_key: string;
  @IsNotEmpty() @IsObject() i18n: Record<string, string>;
  @IsOptional() @IsArray() aliases?: string[];
  @IsOptional() @IsEnum(IngredientCategory) category?: IngredientCategory;
  @IsOptional() @IsString() created_by?: string; // Mock for now
  @IsOptional() nutrition?: IngredientNutrition;
}

// UpdateIngredientDto
export class UpdateIngredientDto {
  @IsOptional() @IsString() name_key?: string;
  @IsOptional() @IsObject() i18n?: Record<string, string>;
  @IsOptional() @IsArray() aliases?: string[];
  @IsOptional() @IsEnum(IngredientCategory) category?: IngredientCategory;
  @IsOptional() nutrition?: IngredientNutrition;
}

// PatchIngredientDto
export class PatchIngredientDto extends PartialType(CreateIngredientDto) {}
```

### 5. Service Layer Enhancements

#### Recipe Service Methods

```typescript
// Enhanced RecipesService
export class RecipesService {
  // Existing methods to update
  async findAll(filters: RecipeFilters): Promise<Recipe[]>
  async findOne(id: string): Promise<Recipe>
  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe>
  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe>
  async partialUpdate(id: string, patchRecipeDto: PatchRecipeDto): Promise<Recipe>
  async remove(id: string): Promise<void>
  
  // New methods to implement
  async findDraftsByAuthor(author: string): Promise<Recipe[]>
  async publish(id: string): Promise<Recipe>
  async unpublish(id: string): Promise<Recipe>
  async findByFilters(filters: RecipeFilters): Promise<Recipe[]>
  async searchByText(query: string): Promise<Recipe[]>
}
```

#### Ingredient Service Methods

```typescript
// Enhanced IngredientsService
export class IngredientsService {
  // Existing methods to update
  async findAll(filters: IngredientFilters): Promise<Ingredient[]>
  async findOne(id: string): Promise<Ingredient>
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient>
  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient>
  async partialUpdate(id: string, patchIngredientDto: PatchIngredientDto): Promise<Ingredient>
  async remove(id: string): Promise<void>
  
  // New methods to implement
  async searchByAliases(query: string, language?: string): Promise<Ingredient[]>
  async findByCategory(category: IngredientCategory): Promise<Ingredient[]>
  async findByNameKey(nameKey: string): Promise<Ingredient>
}
```

### 6. Validation Rules

#### Recipe Validation
- Draft recipes can have incomplete data
- Published recipes must have: title, description, at least one ingredient, at least one step
- `total_time` should equal `preparation_time + cooking_time` when both are provided
- `yield` must be positive number
- `difficulty` must be valid enum value

#### Ingredient Validation
- `name_key` must be unique
- `i18n` object must contain at least one language
- `category` must be valid enum value
- `aliases` array should not contain duplicates

### 7. Error Handling

```typescript
// Custom exceptions
export class RecipeNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Recipe with ID ${id} not found`);
  }
}

export class IngredientNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Ingredient with ID ${id} not found`);
  }
}

export class DuplicateIngredientException extends ConflictException {
  constructor(nameKey: string) {
    super(`Ingredient with name_key '${nameKey}' already exists`);
  }
}
```

### 8. Implementation Notes

#### Draft System
- Use existing `is_draft` boolean field in recipe metadata
- No separate endpoints needed - filter by draft status
- Draft recipes bypass some validation rules

#### Media Storage
- Store URLs pointing to Cloudflare R2
- Implement file upload endpoints separately
- Validate media URLs format

#### Authentication
- Mock `author` field with hardcoded values for now
- Prepare structure for future auth integration
- Use `created_by` field for ingredients

#### Nutrition
- Create basic structure but don't implement calculations
- Allow manual entry for now
- Prepare for future automatic calculation

### 9. Database Considerations

#### Indexes
```typescript
// Recipe indexes
@Index({ title: 'text', description: 'text' }) // Text search
@Index({ difficulty: 1, cooking_time: 1 }) // Filtering
@Index({ author: 1, is_draft: 1 }) // User drafts
@Index({ diets: 1 }) // Diet filtering
@Index({ allergens: 1 }) // Allergen filtering

// Ingredient indexes
@Index({ name_key: 1 }, { unique: true }) // Unique constraint
@Index({ aliases: 1 }) // Alias search
@Index({ category: 1 }) // Category filtering
@Index({ 'i18n.fr': 'text', 'i18n.en': 'text' }) // Multilingual search
```

### 10. Testing Requirements

#### Unit Tests
- Service methods with mocked repositories
- DTO validation
- Custom exceptions

#### Integration Tests
- Complete CRUD operations
- Filtering and search functionality
- Draft system workflows
- Error scenarios

#### E2E Tests
- Full API endpoint testing
- Recipe creation to publication flow
- Ingredient management workflows

## Implementation Priority

1. **Phase 1**: Update entities and basic CRUD
2. **Phase 2**: Implement DTOs and validation
3. **Phase 3**: Add filtering and search
4. **Phase 4**: Draft system and publish/unpublish
5. **Phase 5**: Error handling and testing

This specification provides a complete roadmap for implementing the recipes and ingredients API modules according to your JSON specifications while maintaining clean architecture principles.