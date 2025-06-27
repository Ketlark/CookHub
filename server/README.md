# CookHub Backend

A NestJS-based backend API for a comprehensive recipe management application with AI-powered features.

## Project Overview

This backend serves a modern recipe application that combines traditional recipe management with AI-powered features for enhanced user experience. The application focuses on providing intelligent recipe discovery, management, and creation tools.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose ODM
- **Package Manager**: pnpm
- **Runtime**: Node.js

Libraries:

- **Validation**: Class-validator and class-transformer for DTO validation
- **Type Safety**: @nestjs/mapped-types for DTO inheritance
- **AI Integration**: Gemini for recipe analysis and generation
- **Error Handling**: Neverthrow for functional error handling
- **Rate Limiting**: @nestjs/throttler for API protection

## Core Features

### 📋 Recipe Management

- **Recipe CRUD Operations**: Create, read, update, delete recipes
- **Advanced Recipe Listing**: Paginated recipe lists with sorting options
- **Complex Filtering & Search**: Multi-criteria filtering (ingredients, cuisine, difficulty, cooking time, dietary restrictions)
- **Recipe Collections**: User-created collections for organizing recipes (favorites, meal plans, etc.)

### 🥘 Ingredient Management

- **Ingredient Database**: Comprehensive ingredient catalog with nutritional information
- **Ingredient Relationships**: Substitutions, allergen information, seasonal availability
- **Smart Ingredient Matching**: Fuzzy search and auto-complete for recipe creation

### 👤 User Management

- **User Accounts**: Basic authentication and profile management
- **User Preferences**: Dietary restrictions, cuisine preferences, skill level, equipment availability
- **Application Settings**: Personalized app configuration (units, language, notifications)

### 🎯 Recipe Creation Workflows

#### 1. Manual Recipe Creation (3-Step Wizard)

- **Step 1**: Basic information (title, description, cuisine, difficulty)
- **Step 2**: Ingredients and quantities with smart suggestions
- **Step 3**: Instructions, timing, and media upload

#### 2. URL Import

- **Media URL Processing**: Extract recipe data from popular recipe websites
- **Content Parsing**: AI-powered extraction of ingredients, instructions, and metadata
- **Data Validation**: Automatic validation and user confirmation of imported data

#### 3. Photo-Based Recipe Creation

- **Image Analysis**: AI-powered dish recognition and ingredient identification
- **Recipe Generation**: Generate recipe suggestions based on visual analysis
- **User Refinement**: Interactive editing of AI-generated recipes

### 🤖 AI Assistant

- **Conversational Interface**: Natural language interaction for recipe assistance
- **Data-Driven Recommendations**: Personalized recipe suggestions based on user preferences and history
- **Smart Query Processing**: Handle complex requests like "healthy dinner recipes under 30 minutes with chicken"
- **Context-Aware Responses**: Maintain conversation context for follow-up questions
- **Recipe Adaptation**: Suggest modifications based on dietary restrictions or available ingredients

## Current Implementation Status

### ✅ Completed

- **Core Infrastructure**: Complete NestJS project structure with TypeScript
- **Database Layer**: MongoDB integration with Mongoose ODM and optimized schemas
- **Recipe Management**: Full CRUD operations with advanced filtering and search
  - Multi-criteria filtering (difficulty, diet, cooking time, author, draft status)
  - Text search across title, description, and instructions
  - Pagination and sorting capabilities
  - Draft/publish workflow with validation
- **Ingredient Management**: Comprehensive ingredient system
  - CRUD operations with duplicate prevention
  - Multi-language support (i18n) with name_key system
  - Category-based organization and alias search
  - Advanced filtering by category and search terms
- **Data Transfer Objects**: Complete DTO layer with validation
  - Create, Update, and Patch DTOs for all entities
  - Robust input validation using class-validator
  - Type-safe data transfer with proper inheritance
- **Error Handling**: Custom exception system with neverthrow integration
  - Domain-specific exceptions (RecipeNotFound, IngredientNotFound, etc.)
  - Functional error handling patterns
  - Consistent error responses across all endpoints
  - Using the result.error or result.value pattern
- **API Controllers**: RESTful endpoints for all operations
  - Recipe endpoints: CRUD, filtering, search, draft management
  - Ingredient endpoints: CRUD, category filtering, alias search
  - Proper HTTP status codes and response formatting
- **Service Layer**: Business logic implementation
  - Complex filtering and aggregation logic
  - Data validation and transformation
  - Repository pattern with Mongoose integration

### 🚧 In Development

- Recipe collections management
- User authentication and preferences
- AI workflow integrations

### 📋 Planned

- URL import service
- Photo analysis integration
- AI assistant conversational engine
- Performance optimization and caching
- API documentation and testing

## Architecture Considerations

### Domain Models

- **Recipe**: Core recipe entity with ingredients, instructions, metadata
- **Ingredient**: Ingredient catalog with nutritional and allergen data
- **User**: User profiles with preferences and settings
- **Collection**: User-created recipe collections
- **AIWorkflow**: AI processing pipelines for import and analysis

### Key Technical Challenges

1. **Complex Recipe Querying**: Efficient MongoDB aggregation pipelines for multi-criteria search
2. **AI Integration**: Seamless integration of AI services for content processing
3. **Data Consistency**: Ensuring data integrity across recipe imports and AI-generated content
4. **Performance**: Optimizing for large recipe databases and real-time AI processing
5. **Scalability**: Designing for future growth in users and recipe volume

### Integration Points

- **AI Services**: External AI APIs for image analysis and content generation
- **Web Scraping**: Recipe extraction from external websites
- **Media Storage**: Image and video storage for recipes
- **Search Engine**: Advanced search capabilities for recipe discovery

## Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run start:dev

# Run tests
pnpm run test
```

## API Structure and Modules

```
/server/src/
├── modules/                    # NestJS modules
│   ├── recipes/               # Recipe management (✅ Implemented)
│   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── create-recipe.dto.ts
│   │   │   ├── update-recipe.dto.ts
│   │   │   ├── patch-recipe.dto.ts
│   │   │   └── recipe-filter.dto.ts
│   │   ├── entity/           # Mongoose models
│   │   │   └── recipe.entity.ts
│   │   ├── exceptions/       # Custom exceptions
│   │   │   └── recipe-not-found.exception.ts
│   │   ├── recipes.controller.ts
│   │   ├── recipes.service.ts
│   │   └── recipes.module.ts
│   │
│   ├── ingredients/           # Ingredient management (✅ Implemented)
│   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── create-ingredient.dto.ts
│   │   │   ├── update-ingredient.dto.ts
│   │   │   ├── patch-ingredient.dto.ts
│   │   │   └── ingredient-filter.dto.ts
|   │   ├── enums/           # Enums
│   │   │   └── ingredient-category.enum.ts
│   │   ├── entity/           # Mongoose models
│   │   │   └── ingredient.entity.ts
│   │   ├── exceptions/       # Custom exceptions
│   │   │   └── ingredient-not-found.exception.ts
│   │   ├── ingredients.controller.ts
│   │   ├── ingredients.service.ts
│   │   └── ingredients.module.ts
│   │
│   ├── users/                # User management (📋 Planned)
│   ├── collections/          # Recipe collections (🚧 In Development)
│   ├── ai/                  # AI-powered features (📋 Planned)
│   └── auth/                # Authentication (🚧 In Development)
│
├── app.module.ts             # Main application module
├── app.controller.ts         # Health check endpoints
├── app.service.ts           # Application services
└── main.ts                  # Application bootstrap
```

## Developer Guide

### Error Handling with Neverthrow

This project uses the `neverthrow` library for functional error handling. This approach provides type-safe error handling without throwing exceptions, making code more predictable and easier to test.

#### Core Principles

1. **No try/catch blocks** - Use `Result<T, E>` pattern instead
2. **Early returns on errors** - Handle errors immediately when they occur
3. **Type-safe error handling** - Errors are part of the type system
4. **Composable error handling** - Chain operations safely
5. **Transform external Promises** - Use `fromPromise` too handle Promises from external functions to neverthrow

#### Basic Pattern

```typescript
import { Result, ok, err } from 'neverthrow';

// Define your error types
type UserError = UserNotFoundException | ValidationException;

// Service method returning Result
async findUser(id: string): Promise<Result<User, UserNotFoundException>> {
  const user = await fromPromise(this.userModel.findById(id));

  if (user.isErr()) {
    return err(new UserNotFoundException(`User with ID ${id} not found`));
  }

  return user;
}
```

#### Controller Implementation

```typescript
@Get(':id')
async findOne(@Param('id') id: string): Promise<User> {
  const result = await this.userService.findUser(id);

  // Early return pattern - handle error immediately
  if (result.isErr()) {
    throw result.error; // NestJS will handle the exception
  }

  return result.value; // Type-safe access to the value
}
```

#### Advanced Error Handling

```typescript
// Chaining operations with andThen
async updateUserProfile(
  userId: string,
  updateData: UpdateUserDto
): Promise<Result<User, UserError>> {
  const userResult = await this.findUser(userId);

  return userResult.andThen(async (user) => {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );

      return ok(updatedUser);
    } catch (error) {
      return err(new ValidationException('Failed to update user'));
    }
  });
}

// Using map for transformations
async getUserSummary(id: string): Promise<Result<UserSummary, UserNotFoundException>> {
  const userResult = await this.findUser(id);

  return userResult.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }));
}
```

#### Error Union Types

```typescript
// Define comprehensive error unions for each service
type IngredientError =
  | IngredientNotFoundException
  | DuplicateIngredientException
  | IngredientValidationException;

type RecipeError =
  | RecipeNotFoundException
  | RecipeValidationException
  | InsufficientPermissionsException;

// Use in service methods
async createRecipe(
  createDto: CreateRecipeDto
): Promise<Result<Recipe, RecipeError>> {
  // Implementation with proper error handling
}
```

### Common Development Tasks

#### Adding a New Module

1. **Generate the module structure**:

```bash
nest g module modules/feature-name
nest g service modules/feature-name
nest g controller modules/feature-name
```

2. **Create the entity**:

```typescript
// modules/feature-name/entity/feature.entity.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Feature {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export type FeatureDocument = Feature & Document;
export const FeatureSchema = SchemaFactory.createForClass(Feature);
```

3. **Create DTOs with validation**:

```typescript
// modules/feature-name/dto/create-feature.dto.ts
import { IsString, IsOptional, MinLength } from "class-validator";

export class CreateFeatureDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

4. **Create custom exceptions**:

```typescript
// modules/feature-name/exceptions/feature-not-found.exception.ts
import { NotFoundException } from "@nestjs/common";

export class FeatureNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
```

5. **Implement service with neverthrow**:

```typescript
// modules/feature-name/feature.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Result, ok, err } from "neverthrow";

type FeatureError = FeatureNotFoundException | ValidationException;

@Injectable()
export class FeatureService {
  constructor(@InjectModel(Feature.name) private featureModel: Model<FeatureDocument>) {}

  async findOne(id: string): Promise<Result<Feature, FeatureNotFoundException>> {
    const feature = await this.featureModel.findById(id);

    if (!feature) {
      return err(new FeatureNotFoundException(`Feature with ID ${id} not found`));
    }

    return ok(feature);
  }
}
```

#### Database Queries and Aggregations

```typescript
// Complex filtering with MongoDB aggregation
async findWithFilters(
  filters: FeatureFilterDto
): Promise<Result<Feature[], never>> {
  const pipeline = [];

  // Add match stage for filters
  if (filters.category) {
    pipeline.push({ $match: { category: filters.category } });
  }

  // Add text search
  if (filters.search) {
    pipeline.push({
      $match: {
        $text: { $search: filters.search }
      }
    });
  }

  // Add pagination
  if (filters.skip) {
    pipeline.push({ $skip: filters.skip });
  }

  if (filters.limit) {
    pipeline.push({ $limit: filters.limit });
  }

  const features = await this.featureModel.aggregate(pipeline);
  return ok(features);
}
```

#### Testing with Neverthrow

```typescript
// Unit test example
describe("FeatureService", () => {
  it("should return error when feature not found", async () => {
    const result = await service.findOne("nonexistent-id");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(FeatureNotFoundException);
    }
  });

  it("should return feature when found", async () => {
    const mockFeature = { id: "1", name: "Test Feature" };
    jest.spyOn(model, "findById").mockResolvedValue(mockFeature);

    const result = await service.findOne("1");

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(mockFeature);
    }
  });
});
```

### Best Practices

1. **Always use Result types** for operations that can fail
2. **Define comprehensive error unions** for each domain
3. **Handle errors at the controller level** by throwing exceptions
4. **Use early returns** to avoid nested error handling
5. **Leverage type safety** - let TypeScript guide your error handling
6. **Test both success and error paths** in your unit tests
7. **Keep error messages descriptive** and user-friendly
8. **Use proper HTTP status codes** in your custom exceptions

## Recent Implementation Highlights

### Recipe API Endpoints

- `GET /recipes` - List recipes with advanced filtering
- `GET /recipes/:id` - Get single recipe
- `POST /recipes` - Create new recipe
- `PUT /recipes/:id` - Update entire recipe
- `PATCH /recipes/:id` - Partial recipe update
- `DELETE /recipes/:id` - Delete recipe
- `GET /recipes/drafts/:authorId` - Get user's draft recipes
- `PATCH /recipes/:id/publish` - Publish draft recipe
- `PATCH /recipes/:id/unpublish` - Unpublish recipe

### Ingredient API Endpoints

- `GET /ingredients` - List ingredients with filtering
- `GET /ingredients/:id` - Get single ingredient
- `POST /ingredients` - Create new ingredient
- `PUT /ingredients/:id` - Update entire ingredient
- `PATCH /ingredients/:id` - Partial ingredient update
- `DELETE /ingredients/:id` - Delete ingredient
- `GET /ingredients/category/:category` - Get ingredients by category
- `GET /ingredients/search/:query` - Search ingredients by aliases

## Business Logic Highlights

- **Smart Recipe Matching**: Algorithm for suggesting recipes based on available ingredients
- **Nutritional Calculation**: Automatic nutritional information calculation from ingredients
- **Difficulty Assessment**: AI-powered recipe difficulty scoring
- **Seasonal Recommendations**: Time-aware recipe suggestions
- **Dietary Compliance**: Automatic recipe categorization based on dietary restrictions

This backend is designed to be the foundation for a comprehensive recipe management ecosystem that leverages AI to enhance user experience while maintaining robust data management and search capabilities.
