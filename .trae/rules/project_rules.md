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

### Global Code Guideline

- Write concise, type-safe TypeScript code.
- Use meaningful names for variables, functions, and components.
- Use functional components and hooks over class components. Use arrow functions to create the components and add proper typings wherever needed
- Ensure components are reusable and maintainable.
- Destructure objects as much as possible
- Avoid using `any`; strive for precise types.
- When you styling something, think about the dual modes (light and dark) always to ensure the best user experience.

Best Practices:

- Follow React Native's threading model to ensure smooth UI performance.
- Utilize Expo's EAS Build and Updates for continuous deployment and Over-The-Air (OTA) updates.
- Use Expo Router for handling navigation and deep linking with best practices

### Naming Conventions:

- Use camelCase for variable and function names (e.g., `onClick`, `handleSubmit`).
- Use PascalCase for component names in react and react native (e.g., `UserProfile`, `ChatScreen`).
- Directory names should be lowercase and hyphenated (e.g., `user-profile`, `chat-screen`).
- Avoid using ambiguous names for variables or components
