export interface Recipe {
  id: string;
  recipe: {
    description: string;
    ingredients: string[];
    instructions: string[];
    title: string;
    url: string;
  };
}