const BASE_URL = "http://172.20.10.4:3000";

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  metadata: {
    image_url: string;
    author: string;
  };
}

export async function getRecipesQuery(): Promise<Recipe[]> {
  const response = await fetch(`${BASE_URL}/recipes`, { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }
  const result = await response.json();

  console.log(result);
  return result;
}
