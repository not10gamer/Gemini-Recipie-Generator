export interface SourceLink {
  uri: string;
  title: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  calories: string;
  timeTaken: string;
  sourceLinks?: SourceLink[];
  imageBase64?: string;
}