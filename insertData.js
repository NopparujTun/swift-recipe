import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Initialize Supabase client
const supabaseUrl = 'https://fglcxbufinkvaovbbdwj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbGN4YnVmaW5rdmFvdmJiZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTc2OTAsImV4cCI6MjA1NDc3MzY5MH0.Y4tlm76Zt8cXzZOZ_vR4GJtftnpD8EjnzQORdRiGphs';
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
