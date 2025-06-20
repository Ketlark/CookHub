## 🏗️ Architecture / Structure

### Tools used

- React Native
- Expo
- Expo Router
- TypeScript
- Tailwind CSS
- PNPM

### Pattern

- **Clean Architecture** + **Feature-Sliced Design**
- Strict separation : UI - Business Logic - Data Layer

### Project Structure

```bash
app/
├── components/          # Components folder
├── layout/              # Contains arborescence of the project
│    └── (tabs)/
│        ├── _layout/
│        ├── index/
│        └── profile/
├── lib/
│    └── api/
```

---

## 📐 Architecture Principles

### Feature-Based Architecture

- Organize code by business feature
- Place all feature code in its own folder
- Co-locate components, hooks, and state per feature
- Use shared folders for common code
- Store features in `features/` directory
- Use global state only for app-wide concerns

### Clean Architecture Layers

**Domain Layer:**

- Define business entities and rules
- Keep domain logic pure and testable
- Use repository interfaces only

**Application Layer:**

- Implement use cases as orchestrators
- Keep services single-responsibility
- Use DTOs for all data transfer
- Validate input at boundaries

**Infrastructure Layer:**

- Implement domain repository interfaces
- Isolate external systems (DB, APIs, files)
- Keep infrastructure out of business logic

**Presentation Layer:**

- Handle API requests and responses
- Use controllers for HTTP logic
- Centralize error handling and validation
- Format all responses consistently

---

## 🧹 Code Quality Standards

### Clean Code Principles

**General Guidelines:**

- Use explicit constants, never magic numbers
- Avoid double negatives
- Use long, readable variable names
- Write the simplest code possible
- Eliminate duplication (DRY)

**Length Limits:**

- Max 30 lines per function
- Max 5 params per function
- Max 300 lines per file
- Max 10 sub-files per folder

**Responsibilities:**

- One responsibility per file

**Functions:**

- No flag parameters

**Errors:**

- Fail fast
- Throw errors early
- Use custom domain errors
- Translate errors to user language
- Log errors in EN with error codes

### Frontend-Specific Clean Code

- Use smart/dumb component pattern
- Smart components handle data and logic
- Dumb components display only, use interfaces

---

## 🏷️ Naming Conventions

### General Principles

- Use descriptive names
- Reveal intent in all names
- No single-letter names (except loops)
- No abbreviations except common ones
- Use consistent terminology

### Functions and Methods

- Use verbs for actions
- Use nouns for value-returning
- Prefix booleans with is, has, should
- No anemic models

### Variables and Properties

- Use plural for arrays/collections

### Constants

- Use UPPER_SNAKE_CASE
- Scope constants appropriately
- Group related constants in enum or object

### React Native Specific

- Use camelCase for variable and function names (e.g., `onClick`, `handleSubmit`)
- Use PascalCase for component names in react and react native (e.g., `UserProfile`, `ChatScreen`)
- Directory names should be lowercase and hyphenated (e.g., `user-profile`, `chat-screen`)
- Avoid using ambiguous names for variables or components

---

## 📝 TypeScript Guidelines

### Type Safety

- Never use `any` or `unknown`
- Avoid `as` for type conversion
- Use type guards for assertions
- Use generics for reusable functions

### Interfaces and Types

- Use `interface` for extensible objects
- Use `type` for unions and primitives

### Nullability

- Avoid `null` and `undefined` in returns

### Enumerations

- Prefer string literal unions to enums
- Use const enums if needed
- Define enum values explicitly

### Lint & Error

- Catch errors as `unknown | Error`

### Generics

- Use descriptive type parameter names

### TypeScript Naming Conventions

**Classes and Interfaces:**

- Use PascalCase for names
- Use nouns or noun phrases

**Functions and Methods:**

- Use camelCase for names
- Use verbs for actions
- Use nouns for value-returning
- Prefix booleans with is, has, should
- No anemic models

---

## 🎯 Global Code Guidelines

- Write concise, type-safe TypeScript code
- Use meaningful names for variables, functions, and components
- Use functional components and hooks over class components. Use arrow functions to create the components and add proper typings wherever needed
- Ensure components are reusable and maintainable
- Destructure objects as much as possible
- Avoid using `any`; strive for precise types
- When you styling something, think about the dual modes (light and dark) always to ensure the best user experience

---

## ⚡ Best Practices

- Follow React Native's threading model to ensure smooth UI performance
- Utilize Expo's EAS Build and Updates for continuous deployment and Over-The-Air (OTA) updates
- Use Expo Router for handling navigation and deep linking with best practices
