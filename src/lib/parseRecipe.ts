export interface ParsedRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  prepTime: string;
  notes: string;
}

export function parseRecipeText(text: string): ParsedRecipe {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const recipe: ParsedRecipe = {
    name: '', ingredients: [], instructions: [],
    calories: '', protein: '', carbs: '', fat: '', fiber: '',
    prepTime: '', notes: '',
  };

  let section = '';
  let foundName = false;

  const bulletPattern = /^[\*\-\u2022\u2023\u25E6\u25CF\u25CB\u2043\u2219]\s*/;
  const numberedStepPattern = /^\d+[\.\)]\s+/;
  const ingPattern = /^[\d\u00bc\u00bd\u00be\u2153\u2154]|^\d+\/\d+|^a\s+(pinch|handful|bunch|dash)|^(one|two|three|four|five|six|half)\s/i;
  const unitPattern = /\b(tsp|tbsp|tablespoon|teaspoon|cup|cups|ml|g|kg|oz|lb|lbs|litre|liter|pint|clove|cloves|bunch|tin|can|packet|pack|bag|handful|pinch|dash|splash|slice|slices|piece|pieces|fillet|fillets|breast|breasts|thigh|thighs|medium|large|small)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Extract recipe name
    if (!foundName && line.length < 100 &&
      !lineLower.match(/^(ingredients?|instructions?|method|directions?|steps?|prep|cook|calor|protein|serves?|yield|for the|notes?|nutrition|macros?)\s*[:]/i) &&
      !lineLower.match(/^(ingredients?|instructions?|method|directions?|nutrition(al)?\s*(info|information|facts?)?|macros?)$/i)) {
      recipe.name = line.replace(bulletPattern, '').trim();
      foundName = true;
      continue;
    }

    // Section headers
    if (lineLower.match(/^ingredients?\s*[:.]?\s*$/i) || lineLower.match(/^ingredients?\s*:/i) || lineLower.match(/^you.ll need/i) || lineLower.match(/^what you.ll need/i)) {
      section = 'ingredients';
      continue;
    }
    if (lineLower.match(/^(instructions?|method|directions?|steps?|preparation|how to make|to make)\s*[:.]?\s*$/i) || lineLower.match(/^(instructions?|method|directions?|steps?)\s*:/i)) {
      section = 'instructions';
      continue;
    }
    if (lineLower.match(/^notes?\s*[:.]?\s*$/i) || lineLower.match(/^notes?\s*:/i) || lineLower.match(/^tips?\s*:/i)) {
      section = 'notes';
      continue;
    }
    if (lineLower.match(/^nutrition(al)?\s*(info|information|facts?)?\s*[:.]?\s*$/i) || lineLower.match(/^macros?\s*[:.]?\s*$/i)) {
      section = 'nutrition';
      continue;
    }

    // Extract nutritional data from ANY line (not just nutrition section)
    const calMatch = line.match(/(\d+)\s*(?:kcal|cal(?:orie)?s?)/i);
    if (calMatch && !recipe.calories) { recipe.calories = calMatch[1]; if (section === 'nutrition') continue; else continue; }

    const protMatch = line.match(/(?:protein)\s*[:.]?\s*(\d+)\s*g/i) || line.match(/(\d+)\s*g\s*(?:of\s*)?protein/i);
    if (protMatch && !recipe.protein) { recipe.protein = protMatch[1]; continue; }

    const carbMatch = line.match(/(?:carbs?|carbohydrates?)\s*[:.]?\s*(\d+)\s*g/i) || line.match(/(\d+)\s*g\s*(?:of\s*)?(?:carbs?|carbohydrates?)/i);
    if (carbMatch && !recipe.carbs) { recipe.carbs = carbMatch[1]; continue; }

    const fatMatch = line.match(/(?:fat|fats)\s*[:.]?\s*(\d+)\s*g/i) || line.match(/(\d+)\s*g\s*(?:of\s*)?(?:fat|fats)/i);
    if (fatMatch && !recipe.fat) { recipe.fat = fatMatch[1]; continue; }

    const fiberMatch = line.match(/(?:fib(?:er|re))\s*[:.]?\s*(\d+)\s*g/i) || line.match(/(\d+)\s*g\s*(?:of\s*)?fib(?:er|re)/i);
    if (fiberMatch && !recipe.fiber) { recipe.fiber = fiberMatch[1]; continue; }

    // Inline nutritional data (e.g., "Calories: 450 | Protein: 38g | Carbs: 45g | Fat: 12g")
    if (lineLower.includes('calorie') || lineLower.includes('kcal') || lineLower.includes('protein') || lineLower.includes('carb') || lineLower.includes('fat')) {
      const inlineCal = line.match(/(?:calories?|kcal)\s*[:.]?\s*(\d+)/i);
      const inlineProt = line.match(/protein\s*[:.]?\s*(\d+)/i);
      const inlineCarb = line.match(/carbs?\s*[:.]?\s*(\d+)/i);
      const inlineFat = line.match(/(?:^|[^a-z])fat\s*[:.]?\s*(\d+)/i);
      const inlineFiber = line.match(/fib(?:er|re)\s*[:.]?\s*(\d+)/i);
      if (inlineCal && !recipe.calories) recipe.calories = inlineCal[1];
      if (inlineProt && !recipe.protein) recipe.protein = inlineProt[1];
      if (inlineCarb && !recipe.carbs) recipe.carbs = inlineCarb[1];
      if (inlineFat && !recipe.fat) recipe.fat = inlineFat[1];
      if (inlineFiber && !recipe.fiber) recipe.fiber = inlineFiber[1];
      if (inlineCal || inlineProt || inlineCarb || inlineFat) continue;
    }

    const prepMatch = line.match(/(?:prep|cook|total)?\s*(?:time)?\s*[:.]?\s*(\d+)\s*(?:min|minute)/i);
    if (prepMatch && !recipe.prepTime) { recipe.prepTime = prepMatch[1]; continue; }

    if (lineLower.match(/^serves?\s*[:.]?\s*\d/i) || lineLower.match(/^yield/i)) continue;

    // Section content
    if (section === 'nutrition') continue;

    if (section === 'notes') {
      const noteText = line.replace(bulletPattern, '').replace(numberedStepPattern, '').trim();
      if (noteText.length > 2) recipe.notes = recipe.notes ? recipe.notes + '. ' + noteText : noteText;
      continue;
    }

    if (section === 'ingredients') {
      if (numberedStepPattern.test(line) && line.length > 40) {
        section = 'instructions';
      } else {
        const cleaned = line.replace(bulletPattern, '').trim();
        if (cleaned.length > 2) recipe.ingredients.push(cleaned);
        continue;
      }
    }

    if (section === 'instructions') {
      const cleaned = line.replace(bulletPattern, '').replace(numberedStepPattern, '').trim();
      if (cleaned.length > 3) recipe.instructions.push(cleaned);
      continue;
    }

    // Auto-detect
    if (section === '') {
      const looksLikeIngredient = ingPattern.test(line) || unitPattern.test(line) || (bulletPattern.test(line) && line.length < 60);
      const looksLikeStep = numberedStepPattern.test(line) && line.length > 20;

      if (looksLikeStep) {
        section = 'instructions';
        const cleaned = line.replace(numberedStepPattern, '').trim();
        if (cleaned.length > 3) recipe.instructions.push(cleaned);
      } else if (looksLikeIngredient) {
        section = 'ingredients';
        const cleaned = line.replace(bulletPattern, '').trim();
        if (cleaned.length > 2) recipe.ingredients.push(cleaned);
      }
    }
  }

  // Fallback split
  if (recipe.ingredients.length === 0 && recipe.instructions.length === 0 && lines.length > 2) {
    const contentLines = foundName ? lines.slice(1) : lines;
    let switchedToInstructions = false;
    contentLines.forEach(line => {
      if (switchedToInstructions) {
        const c = line.replace(bulletPattern, '').replace(numberedStepPattern, '').trim();
        if (c.length > 3) recipe.instructions.push(c);
      } else if (line.length > 60 || numberedStepPattern.test(line)) {
        switchedToInstructions = true;
        const c = line.replace(bulletPattern, '').replace(numberedStepPattern, '').trim();
        if (c.length > 3) recipe.instructions.push(c);
      } else {
        const c = line.replace(bulletPattern, '').trim();
        if (c.length > 2) recipe.ingredients.push(c);
      }
    });
  }

  if (!recipe.name) recipe.name = 'New Recipe';
  return recipe;
}
