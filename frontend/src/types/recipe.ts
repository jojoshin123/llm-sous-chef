export interface Recipe {
  id: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  title: string;
  url: string;
  cook_time: string;
  servings: number;
}