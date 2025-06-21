import { AIAgentRequest, AIAgentResponse, ChatRecipe } from '../../types/chat';
import { getRecipesQuery } from './index';

const AI_AGENT_BASE_URL = process.env.EXPO_PUBLIC_AI_AGENT_URL || 'http://localhost:3001';

/**
 * Send a message to the AI agent and get a response
 * @param request - The AI agent request containing message and context
 * @returns Promise<AIAgentResponse> - The AI agent response
 */
export async function sendMessageToAI(request: AIAgentRequest): Promise<AIAgentResponse> {
  try {
    const response = await fetch(`${AI_AGENT_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get AI response:', error);
    throw new Error('Failed to get AI response');
  }
}

/**
 * Get recipes based on a search query
 * @param query - The search query string
 * @returns Promise<ChatRecipe[]> - Array of matching recipes
 */
export async function getRecipesByQuery(query: string): Promise<ChatRecipe[]> {
  try {
    // Try to get recipes from the actual API first
    const recipes = await getRecipesQuery();
    
    // Convert Recipe[] to ChatRecipe[] and filter based on query
    const chatRecipes: ChatRecipe[] = recipes
      .filter(recipe => 
        !recipe.is_draft && (
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase())
        )
      )
      .map(recipe => ({
        ...recipe,
        cookTime: Math.floor(Math.random() * 60) + 15, // Mock cook time
        servings: Math.floor(Math.random() * 6) + 2, // Mock servings
        ingredients: [
          // Mock ingredients based on recipe title
          ...(recipe.title.toLowerCase().includes('pasta') ? ['pasta', 'olive oil', 'garlic'] : []),
          ...(recipe.title.toLowerCase().includes('chicken') ? ['chicken', 'salt', 'pepper'] : []),
          ...(recipe.title.toLowerCase().includes('salad') ? ['lettuce', 'tomatoes', 'dressing'] : []),
          'salt', 'pepper' // Default ingredients
        ],
        instructions: [
          'Prepare all ingredients',
          'Follow the cooking steps',
          'Season to taste',
          'Serve and enjoy'
        ]
      }));
    
    return chatRecipes.slice(0, 5); // Limit to 5 recipes
  } catch (error) {
    console.error('Failed to get recipes from API, using mock data:', error);
    
    // Fallback to mock data
    const mockRecipes: ChatRecipe[] = [
      {
        _id: '1',
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
        difficulty: 'medium',
        metadata: {
          image_url: 'https://example.com/carbonara.jpg',
          author: 'Chef Mario'
        },
        is_draft: false,
        cookTime: 20,
        servings: 4,
        ingredients: ['spaghetti', 'eggs', 'parmesan cheese', 'pancetta', 'black pepper'],
        instructions: ['Boil pasta', 'Cook pancetta', 'Mix eggs and cheese', 'Combine all ingredients']
      },
      {
        _id: '2',
        title: 'Chicken Stir Fry',
        description: 'Quick and healthy chicken stir fry with vegetables',
        difficulty: 'easy',
        metadata: {
          image_url: 'https://example.com/stirfry.jpg',
          author: 'Chef Lin'
        },
        is_draft: false,
        cookTime: 15,
        servings: 2,
        ingredients: ['chicken breast', 'mixed vegetables', 'soy sauce', 'garlic', 'ginger'],
        instructions: ['Cut chicken', 'Heat oil', 'Stir fry chicken', 'Add vegetables', 'Season and serve']
      }
    ];
    
    // Filter based on query
    return mockRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}

/**
 * Mock AI response for development/testing
 * @param request - The AI agent request
 * @returns Promise<AIAgentResponse> - Mock AI response
 */
export async function getMockAIResponse(request: AIAgentRequest): Promise<AIAgentResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const message = request.message.toLowerCase();
  
  if (message.includes('recipe') || message.includes('cook') || message.includes('make')) {
    const recipes = await getRecipesByQuery(message);
    return {
      message: `I found ${recipes.length} recipes that might interest you! Here are some suggestions:`,
      type: 'recipe_suggestions',
      recipes: recipes.slice(0, 3), // Limit to 3 recipes
      followUpQuestions: [
        'Would you like more recipe suggestions?',
        'Do you need help with cooking techniques?',
        'Any dietary restrictions I should know about?'
      ],
      confidence: 0.85
    };
  }
  
  if (message.includes('tip') || message.includes('help') || message.includes('how')) {
    return {
      message: 'Here are some helpful cooking tips:\n\n• Always taste as you cook and adjust seasoning\n• Let meat rest after cooking for better texture\n• Mise en place - prepare all ingredients before cooking\n• Use a meat thermometer for perfect doneness',
      type: 'cooking_tips',
      followUpQuestions: [
        'Would you like tips for a specific cooking technique?',
        'Any particular ingredient you need help with?',
        'Looking for substitution suggestions?'
      ],
      confidence: 0.9
    };
  }
  
  if (message.includes('substitute') || message.includes('replace') || message.includes('instead')) {
    return {
      message: 'I can help with ingredient substitutions! Here are some common ones:\n\n• Butter → Olive oil or coconut oil\n• Eggs → Flax eggs or applesauce (for baking)\n• Heavy cream → Coconut cream or cashew cream\n• Sugar → Honey, maple syrup, or stevia',
      type: 'cooking_tips',
      followUpQuestions: [
        'What specific ingredient do you need to substitute?',
        'Are you looking for healthier alternatives?',
        'Any dietary restrictions I should consider?'
      ],
      confidence: 0.8
    };
  }
  
  // Default response
  return {
    message: 'Hello! I\'m your AI cooking assistant. I can help you with:\n\n• Finding recipes based on ingredients\n• Cooking tips and techniques\n• Ingredient substitutions\n• Recipe creation guidance\n\nWhat would you like to cook today?',
    type: 'text',
    followUpQuestions: [
      'Find me some recipes',
      'I need cooking tips',
      'Help with substitutes',
      'Guide me through cooking'
    ],
    confidence: 1.0
  };
}