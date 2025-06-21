// Import existing Recipe interface from API
import { Recipe } from '../lib/api';

// Extended Recipe interface for chat context
export interface ChatRecipe extends Recipe {
  cookTime?: number;
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'recipe' | 'tip' | 'error';
  metadata?: {
    recipes?: ChatRecipe[];
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
  recipes?: ChatRecipe[];
  followUpQuestions?: string[];
  confidence?: number;
}

// Utility function to generate UUID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};