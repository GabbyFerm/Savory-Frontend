// User types
export interface User {
  id: string;
  userName: string;
  email: string;
  avatarColor: string;
}

export interface AuthResponse {
  accessToken: string;  
  refreshToken: string; 
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  avatarColor?: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

// Recipe types
export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  imagePath: string | null;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string | null;
  ingredients: RecipeIngredient[];
}

export interface CreateRecipeRequest {
  title: string;
  description: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  categoryId: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
  }[];
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Category types
export interface Category {
  id: string;
  name: string;
  recipeCount?: number;
}

// Ingredient types
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  createdAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalRecipes: number;
  recipesByCategory: Record<string, number>;
  averageCookTime: number;
  averageTotalTime: number;
  recentRecipes: Recipe[];
}