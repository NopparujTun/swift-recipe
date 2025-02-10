import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Initialize Supabase client
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Load recipes from JSON
const data = JSON.parse(fs.readFileSync('./src/data/recipes.json', 'utf-8')).recipes;

async function migrateData() {
  for (const recipe of data) {
    // Insert into recipes table
    const { data: insertedRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert([
        {
          name: recipe.name,
          description: recipe.description,
          image: recipe.image,
          category: recipe.category,
        }
      ])
      .select();

    if (recipeError) {
      console.error(`Error inserting recipe: ${recipe.name}`, recipeError);
      continue;
    }

    const recipeId = insertedRecipe[0].id;

    // Insert ingredients
    for (const ingredient of recipe.ingredients) {
      await supabase
        .from('ingredients')
        .insert([{ recipe_id: recipeId, ingredient }]);
    }

    // Insert instructions
    recipe.instructions.forEach(async (instruction, index) => {
      await supabase
        .from('instructions')
        .insert([
          {
            recipe_id: recipeId,
            step_number: index + 1,
            instruction,
          }
        ]);
    });
  }

  console.log('Data migration completed successfully.');
}

migrateData();
