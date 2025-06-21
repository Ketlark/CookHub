# AI Cooking Agent Feature Specification

## Overview
Add an AI-powered cooking assistant to the CookHub wizard page that can help users with recipe discovery, cooking tips, ingredient substitutions, and recipe creation guidance.

## Architecture

### File Structure
```
app/
├── layout/
│   └── wizard/
│       └── chat.tsx                    # Main AI chat interface
├── components/
│   └── chat/
│       ├── ChatBubble.tsx             # Message bubble component
│       ├── ChatInput.tsx              # Input field with send button
│       ├── TypingIndicator.tsx        # AI typing animation
│       ├── QuickActions.tsx           # Predefined query buttons
│       └── RecipeSuggestion.tsx       # Recipe cards in chat
├── lib/
│   └── api/
│       └── ai-agent.ts                # AI service API calls
└── types/
    └── chat.ts                        # TypeScript interfaces
```

## TypeScript Interfaces

### Chat Types (`types/chat.ts`)
```typescript
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'recipe' | 'tip' | 'error';
  metadata?: {
    recipes?: Recipe[];
    suggestions?: string[];
    followUpQuestions?: string[];
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: 'general' | 'recipe_creation' | 'cooking_tips' | 'ingredient_help';
  createdAt: Date;
}

export interface AIAgentRequest {
  message: string;
  context: string;
  sessionId: string;
  userId?: string;
}

export interface AIAgentResponse {
  message: string;
  type: 'text' | 'recipe_suggestions' | 'cooking_tips' | 'error';
  recipes?: Recipe[];
  followUpQuestions?: string[];
  confidence?: number;
}
```

## Component Specifications

### 1. Modified Wizard Page (`layout/(tabs)/wizard.tsx`)
**Changes Required:**
- Add fourth TouchableOpacity card for "Chat with AI Chef"
- Use `chat-outline` icon from Ionicons
- Navigate to `/wizard/chat` on press
- Maintain existing styling consistency

### 2. Chat Interface (`layout/wizard/chat.tsx`)
**Features:**
- Full-screen chat interface
- Header with back button and "AI Chef" title
- ScrollView for messages with inverted scroll
- Fixed bottom input area
- Welcome message on first load
- Quick action buttons for common queries

**State Management:**
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isTyping, setIsTyping] = useState(false);
const [inputText, setInputText] = useState('');
const [sessionId] = useState(() => generateUUID());
```

### 3. ChatBubble Component (`components/chat/ChatBubble.tsx`)
**Props:**
```typescript
interface ChatBubbleProps {
  message: ChatMessage;
  onRecipePress?: (recipeId: string) => void;
}
```
**Features:**
- Different styling for user vs AI messages
- Support for text, recipe cards, and tips
- Timestamp display
- Animation on message appear

### 4. ChatInput Component (`components/chat/ChatInput.tsx`)
**Props:**
```typescript
interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}
```
**Features:**
- Text input with send button
- Send button disabled when empty
- Haptic feedback on send
- Auto-focus and keyboard handling

### 5. QuickActions Component (`components/chat/QuickActions.tsx`)
**Features:**
- Horizontal scrollable buttons
- Predefined queries: "Find recipes", "Cooking tips", "Substitutes", "Help cooking"
- Only show when no messages or after AI response
- Haptic feedback on press

### 6. TypingIndicator Component (`components/chat/TypingIndicator.tsx`)
**Features:**
- Animated dots indicating AI is typing
- Consistent with chat bubble styling
- Auto-hide after timeout

## API Integration

### AI Agent Service (`lib/api/ai-agent.ts`)
```typescript
const AI_AGENT_BASE_URL = process.env.EXPO_PUBLIC_AI_AGENT_URL || 'http://localhost:3001';

export async function sendMessageToAI(request: AIAgentRequest): Promise<AIAgentResponse> {
  const response = await fetch(`${AI_AGENT_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }
  
  return response.json();
}

export async function getRecipesByQuery(query: string): Promise<Recipe[]> {
  // Integration with existing recipe API
  const recipes = await getRecipesQuery();
  // Filter based on query (temporary implementation)
  return recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase()) ||
    recipe.description.toLowerCase().includes(query.toLowerCase())
  );
}
```

## UI/UX Specifications

### Design System
- **Colors:** Use existing orange theme (`#f97316`, `#ea580c`)
- **Typography:** Follow existing text classes
- **Spacing:** Consistent with app padding/margins
- **Animations:** Use `react-native-reanimated` for smooth transitions

### Chat Bubble Styling
- **User messages:** Right-aligned, orange background, white text
- **AI messages:** Left-aligned, white background, gray text
- **Border radius:** 16px for consistency
- **Padding:** 12px horizontal, 8px vertical
- **Margin:** 8px between messages

### Input Area
- **Background:** White with shadow
- **Border radius:** 24px
- **Padding:** 12px
- **Send button:** Orange circle with arrow icon

## Navigation

### Route Setup
- Add `/wizard/chat` route in Expo Router
- Ensure proper back navigation to wizard main page
- Support deep linking for shared conversations (future)

### Navigation Flow
1. Wizard page → Tap "Chat with AI Chef" → Chat interface
2. Chat interface → Back button → Wizard page
3. Chat interface → Recipe suggestion → Recipe detail page

## AI Capabilities

### Core Features
1. **Recipe Discovery**
   - "Find me vegetarian pasta recipes"
   - "What can I make with chicken and rice?"
   - "Show me quick dinner ideas"

2. **Cooking Tips**
   - "How do I properly season a steak?"
   - "What temperature should I cook salmon?"
   - "How to know when pasta is al dente?"

3. **Ingredient Substitutions**
   - "What can I use instead of eggs in baking?"
   - "Substitute for heavy cream"
   - "Dairy-free alternatives"

4. **Recipe Creation Help**
   - "Help me create a chocolate cake recipe"
   - "Guide me through making homemade pasta"
   - "What ingredients do I need for risotto?"

5. **Troubleshooting**
   - "My sauce is too salty"
   - "Cake didn't rise properly"
   - "Meat is overcooked, what can I do?"

### Response Types
- **Text responses:** Cooking advice, tips, explanations
- **Recipe suggestions:** Embedded recipe cards with navigation
- **Step-by-step instructions:** Numbered cooking steps
- **Ingredient lists:** Formatted ingredient suggestions
- **Follow-up questions:** Contextual next questions

## Error Handling

### Network Errors
- Show retry button in chat
- Offline message queuing
- Graceful degradation

### AI Service Errors
- Fallback to generic cooking tips
- Error message in chat bubble
- Retry mechanism

### Input Validation
- Trim whitespace
- Minimum message length
- Maximum message length (500 chars)

## Performance Considerations

### Message Management
- Limit message history (last 50 messages)
- Lazy loading for older messages
- Memory cleanup on unmount

### API Optimization
- Request debouncing
- Response caching
- Timeout handling (30 seconds)

## Accessibility

### Screen Reader Support
- Proper accessibility labels
- Message announcement
- Navigation hints

### Keyboard Navigation
- Tab order for input elements
- Enter key to send message
- Escape to close

## Testing Requirements

### Unit Tests
- Chat message state management
- API service functions
- Component rendering

### Integration Tests
- Message flow end-to-end
- Navigation between screens
- Recipe integration

### Manual Testing
- Various AI query types
- Error scenarios
- Performance with many messages

## Implementation Priority

### Phase 1: Core Chat (Week 1)
- Basic chat interface
- Message state management
- Simple text responses

### Phase 2: AI Integration (Week 2)
- AI service integration
- Response processing
- Error handling

### Phase 3: Recipe Integration (Week 3)
- Recipe suggestions in chat
- Navigation to recipe details
- Quick actions

### Phase 4: Polish (Week 4)
- Animations and transitions
- Performance optimization
- Accessibility improvements

## Environment Variables

```env
EXPO_PUBLIC_AI_AGENT_URL=http://localhost:3001
EXPO_PUBLIC_AI_AGENT_API_KEY=your_api_key_here
```

## Dependencies

No new dependencies required - use existing:
- `react-native-reanimated` (animations)
- `expo-haptics` (feedback)
- `expo-router` (navigation)
- `@tanstack/react-query` (API state)

---

**Note:** This specification follows CookHub's clean architecture principles, TypeScript standards, and existing design system. All components should be reusable and maintainable following the established patterns in the codebase.