/**
 * The menu. GIFcommit is a fictional taqueria for a layout study of a
 * quick-service chain's interactive food menu: the categories, the item
 * cards with price and calories, the customiser (remove, extra, add, swap
 * the protein, pick a size), the combos and the value menu, and an order
 * that totals but is never sent. Every item, name, price, calorie count
 * and ingredient here is invented; none is a chain's product.
 */
export type Tag = "vegetarian" | "spicy" | "new" | "value";
export interface Ingredient { id: string; name: string; removable?: boolean; extra?: number; cal?: number }
export interface Option { id: string; name: string; choices: { id: string; name: string; price?: number; cal?: number }[]; default: string }
export interface Item {
  id: string; name: string; category: string; desc: string; long?: string; price: number; cal: number; tags?: Tag[];
  photo?: string; ingredients: Ingredient[]; options?: Option[]; addons?: Ingredient[];
}
export interface Category { id: string; name: string; blurb: string }

export const CATEGORIES: Category[] = [
  { id: "tacos", name: "Tacos", blurb: "Crunchy or soft, one hand, two bites. Every taco comes with lettuce and cheese; the rest is yours to change." },
  { id: "burritos", name: "Burritos", blurb: "A warm flour tortilla around rice, beans and a protein, rolled tight enough to eat in the car." },
  { id: "bowls", name: "Bowls & salads", blurb: "The burrito without the tortilla, or the salad with the shell. Build it from the same bins." },
  { id: "sides", name: "Nachos & sides", blurb: "Chips, cheese, beans and the small things that round out a meal." },
  { id: "breakfast", name: "Breakfast", blurb: "Eggs, potatoes and cheese in a tortilla, until 11." },
  { id: "drinks", name: "Drinks & sweets", blurb: "Fountain drinks in three sizes, horchata, and two kinds of cinnamon." },
  { id: "value", name: "Value menu", blurb: "Seven things under three dollars." },
  { id: "combos", name: "Combos", blurb: "An entrée, a side and a medium drink, priced a dollar or two under the three apart." },
];

const base = (...names: string[]): Ingredient[] => names.map((n) => ({ id: n.toLowerCase().replace(/\W+/g, "-"), name: n, removable: true }));
const extras: Ingredient[] = [{ id: "sour-cream", name: "Sour cream", extra: 0.6, cal: 30 }, { id: "guac", name: "Guacamole", extra: 1.2, cal: 45 }, { id: "jalapenos", name: "Jalapeños", extra: 0.3, cal: 5 }, { id: "extra-cheese", name: "Extra cheese", extra: 0.7, cal: 50 }, { id: "pico", name: "Pico de gallo", extra: 0.5, cal: 10 }];
const protein: Option = { id: "protein", name: "Protein", default: "beef", choices: [{ id: "beef", name: "Seasoned beef" }, { id: "chicken", name: "Grilled chicken", price: 0.6, cal: -20 }, { id: "steak", name: "Steak", price: 1.4, cal: 10 }, { id: "beans", name: "Black beans", price: -0.3, cal: -40 }] };
const shell: Option = { id: "shell", name: "Shell", default: "crunchy", choices: [{ id: "crunchy", name: "Crunchy corn" }, { id: "soft", name: "Soft flour", cal: 20 }, { id: "doritos", name: "Spiced corn", price: 0.4, cal: 10 }] };
const size: Option = { id: "size", name: "Size", default: "medium", choices: [{ id: "small", name: "Small (16 oz)", price: -0.4, cal: -60 }, { id: "medium", name: "Medium (24 oz)" }, { id: "large", name: "Large (32 oz)", price: 0.5, cal: 90 }] };

export const ITEMS: Item[] = [
  // Tacos
  { id: "crunchy-taco", name: "Crunchy taco", category: "tacos", desc: "Seasoned beef, lettuce and cheddar in a corn shell.", long: "The taco the menu is built on: a fried corn tortilla, a scoop of seasoned beef, shredded lettuce and cheddar. Swap the shell or the protein, add what you like.", price: 1.99, cal: 170, tags: ["value"], photo: "crunchy", ingredients: base("Seasoned beef", "Lettuce", "Cheddar"), options: [shell, protein], addons: extras },
  { id: "soft-taco", name: "Soft taco", category: "tacos", desc: "The same filling in a warm flour tortilla.", price: 1.99, cal: 190, tags: ["value"], photo: "soft", ingredients: base("Seasoned beef", "Lettuce", "Cheddar"), options: [protein], addons: extras },
  { id: "supreme-taco", name: "Supreme taco", category: "tacos", desc: "Crunchy taco with tomatoes and sour cream.", price: 2.79, cal: 210, photo: "crunchy", ingredients: base("Seasoned beef", "Lettuce", "Cheddar", "Tomatoes", "Sour cream"), options: [shell, protein], addons: extras },
  { id: "grilled-chicken-taco", name: "Grilled chicken taco", category: "tacos", desc: "Grilled chicken, lettuce, cheddar and avocado ranch in a soft tortilla.", price: 2.99, cal: 200, photo: "soft", ingredients: base("Grilled chicken", "Lettuce", "Cheddar", "Avocado ranch"), addons: extras },
  { id: "black-bean-taco", name: "Black bean taco", category: "tacos", desc: "Black beans, lettuce, cheddar and pico, crunchy or soft.", price: 1.99, cal: 160, tags: ["vegetarian", "value"], photo: "crunchy", ingredients: base("Black beans", "Lettuce", "Cheddar", "Pico de gallo"), options: [shell], addons: extras },
  { id: "fiery-taco", name: "Fiery steak taco", category: "tacos", desc: "Steak, jalapeños, pepper-jack and chipotle sauce in a spiced corn shell.", price: 3.49, cal: 230, tags: ["spicy", "new"], photo: "crunchy", ingredients: base("Steak", "Jalapeños", "Pepper-jack", "Chipotle sauce", "Lettuce"), addons: extras },
  // Burritos
  { id: "bean-burrito", name: "Bean burrito", category: "burritos", desc: "Refried beans, cheddar, onions and red sauce.", price: 2.29, cal: 380, tags: ["vegetarian", "value"], photo: "burrito", ingredients: base("Refried beans", "Cheddar", "Onions", "Red sauce"), addons: extras },
  { id: "beef-burrito", name: "Seasoned beef burrito", category: "burritos", desc: "Beef, rice, beans, cheddar and sour cream.", price: 4.49, cal: 520, photo: "burrito", ingredients: base("Seasoned beef", "Rice", "Refried beans", "Cheddar", "Sour cream"), options: [protein], addons: extras },
  { id: "grilled-burrito", name: "Grilled stuffed burrito", category: "burritos", desc: "Beef, rice, beans, three cheeses and nacho sauce, grilled flat.", long: "Pressed on the grill until the tortilla browns, so the cheese inside sets. The biggest thing on the menu.", price: 5.99, cal: 760, photo: "burrito", ingredients: base("Seasoned beef", "Rice", "Refried beans", "Three-cheese blend", "Nacho cheese sauce", "Sour cream"), options: [protein], addons: extras },
  { id: "chicken-burrito", name: "Chipotle chicken burrito", category: "burritos", desc: "Grilled chicken, rice, chipotle sauce, cheddar and lettuce.", price: 5.49, cal: 590, tags: ["spicy"], photo: "burrito", ingredients: base("Grilled chicken", "Rice", "Chipotle sauce", "Cheddar", "Lettuce"), addons: extras },
  { id: "veggie-burrito", name: "Veggie power burrito", category: "burritos", desc: "Black beans, rice, guacamole, pico, lettuce, cheddar and avocado ranch.", price: 5.29, cal: 540, tags: ["vegetarian"], photo: "burrito", ingredients: base("Black beans", "Rice", "Guacamole", "Pico de gallo", "Lettuce", "Cheddar", "Avocado ranch"), addons: extras },
  // Bowls & salads
  { id: "power-bowl", name: "Power bowl", category: "bowls", desc: "Chicken, rice, black beans, guacamole, pico, lettuce, cheddar and avocado ranch.", price: 6.49, cal: 470, photo: "bowl", ingredients: base("Grilled chicken", "Rice", "Black beans", "Guacamole", "Pico de gallo", "Lettuce", "Cheddar", "Avocado ranch"), options: [protein], addons: extras },
  { id: "veggie-bowl", name: "Veggie bowl", category: "bowls", desc: "The power bowl with black beans in place of the chicken.", price: 5.99, cal: 430, tags: ["vegetarian"], photo: "bowl", ingredients: base("Black beans", "Rice", "Guacamole", "Pico de gallo", "Lettuce", "Cheddar", "Avocado ranch"), addons: extras },
  { id: "taco-salad", name: "Taco salad", category: "bowls", desc: "Beef, beans, rice, lettuce, tomatoes, cheddar and sour cream in a fried tortilla shell.", price: 6.99, cal: 740, photo: "salad", ingredients: base("Seasoned beef", "Refried beans", "Rice", "Lettuce", "Tomatoes", "Cheddar", "Sour cream", "Tortilla shell"), options: [protein], addons: extras },
  // Nachos & sides
  { id: "nachos-grande", name: "Nachos grande", category: "sides", desc: "Chips, beef, beans, nacho cheese, tomatoes and sour cream.", long: "A full tray: chips under seasoned beef, refried beans, warm nacho cheese sauce, diced tomatoes and sour cream. Built for two, or one who is hungry.", price: 5.49, cal: 740, photo: "nachos", ingredients: base("Tortilla chips", "Seasoned beef", "Refried beans", "Nacho cheese sauce", "Tomatoes", "Sour cream"), options: [protein], addons: extras },
  { id: "chips-cheese", name: "Chips & nacho cheese", category: "sides", desc: "A bag of chips and a cup of warm cheese sauce.", price: 1.79, cal: 220, tags: ["vegetarian", "value"], photo: "chips", ingredients: base("Tortilla chips", "Nacho cheese sauce") },
  { id: "chips-salsa", name: "Chips & salsa", category: "sides", desc: "The same chips with a cup of salsa roja.", price: 1.49, cal: 150, tags: ["vegetarian", "value"], photo: "chips", ingredients: base("Tortilla chips", "Salsa roja") },
  { id: "cheese-quesadilla", name: "Cheese quesadilla", category: "sides", desc: "Three cheeses and creamy jalapeño sauce, grilled and cut in four.", price: 3.99, cal: 470, tags: ["vegetarian"], photo: "quesadilla", ingredients: base("Three-cheese blend", "Creamy jalapeño sauce"), options: [{ id: "protein", name: "Add a protein", default: "none", choices: [{ id: "none", name: "Cheese only" }, { id: "chicken", name: "Grilled chicken", price: 1.5, cal: 60 }, { id: "steak", name: "Steak", price: 2.0, cal: 80 }] }] },
  { id: "rice-beans", name: "Rice & beans", category: "sides", desc: "Seasoned rice and black beans, a cup of each.", price: 1.99, cal: 210, tags: ["vegetarian", "value"], photo: "bowl", ingredients: base("Rice", "Black beans") },
  // Breakfast
  { id: "breakfast-burrito", name: "Breakfast burrito", category: "breakfast", desc: "Scrambled eggs, potatoes, cheddar and sausage.", price: 3.49, cal: 480, photo: "breakfast", ingredients: base("Scrambled eggs", "Potatoes", "Cheddar", "Sausage"), options: [{ id: "meat", name: "Meat", default: "sausage", choices: [{ id: "sausage", name: "Sausage" }, { id: "bacon", name: "Bacon" }, { id: "none", name: "No meat", price: -0.5, cal: -110 }] }], addons: extras },
  { id: "breakfast-taco", name: "Breakfast taco", category: "breakfast", desc: "Eggs, cheddar and bacon in a soft tortilla.", price: 1.99, cal: 210, tags: ["value"], photo: "soft", ingredients: base("Scrambled eggs", "Cheddar", "Bacon") },
  { id: "hash-browns", name: "Hash browns", category: "breakfast", desc: "One, crisp, salted.", price: 1.29, cal: 160, tags: ["vegetarian", "value"], photo: "chips", ingredients: base("Potatoes") },
  // Drinks & sweets
  { id: "fountain", name: "Fountain drink", category: "drinks", desc: "Any of eight, with ice.", price: 2.19, cal: 220, photo: "soda", ingredients: [], options: [size, { id: "flavor", name: "Drink", default: "cola", choices: [{ id: "cola", name: "Cola" }, { id: "diet", name: "Diet cola", cal: -220 }, { id: "lemon-lime", name: "Lemon-lime" }, { id: "orange", name: "Orange" }, { id: "root-beer", name: "Root beer" }, { id: "tea", name: "Iced tea, unsweetened", cal: -220 }, { id: "lemonade", name: "Lemonade", cal: -40 }, { id: "water", name: "Water", price: -2.19, cal: -220 }] }] },
  { id: "horchata", name: "Horchata", category: "drinks", desc: "Rice, cinnamon and vanilla, cold.", price: 2.99, cal: 260, tags: ["vegetarian"], photo: "horchata", ingredients: [], options: [size] },
  { id: "cinnamon-twists", name: "Cinnamon twists", category: "drinks", desc: "Puffed, crisp, dusted with cinnamon sugar.", price: 1.49, cal: 170, tags: ["vegetarian", "value"], photo: "twists", ingredients: base("Cinnamon sugar") },
  { id: "churros", name: "Churros", category: "drinks", desc: "Two, warm, with caramel.", price: 2.49, cal: 310, tags: ["vegetarian"], photo: "churros", ingredients: base("Caramel sauce") },
];

/** Combos: an entrée, a side, a medium drink. */
export interface Combo { id: string; name: string; items: string[]; price: number; photo?: string; blurb: string }
export const COMBOS: Combo[] = [
  { id: "c1", name: "Three crunchy tacos", items: ["crunchy-taco", "crunchy-taco", "crunchy-taco", "chips-cheese", "fountain"], price: 8.99, photo: "crunchy", blurb: "Three crunchy tacos, chips and cheese, a medium drink." },
  { id: "c2", name: "Grilled stuffed burrito", items: ["grilled-burrito", "chips-salsa", "fountain"], price: 9.49, photo: "burrito", blurb: "The big burrito, chips and salsa, a medium drink." },
  { id: "c3", name: "Nachos grande", items: ["nachos-grande", "soft-taco", "fountain"], price: 9.99, photo: "nachos", blurb: "A tray of nachos, a soft taco, a medium drink." },
  { id: "c4", name: "Power bowl", items: ["power-bowl", "chips-salsa", "fountain"], price: 9.99, photo: "bowl", blurb: "The bowl, chips and salsa, a medium drink." },
  { id: "c5", name: "Veggie", items: ["veggie-burrito", "black-bean-taco", "fountain"], price: 8.99, photo: "burrito", blurb: "Veggie power burrito, a black bean taco, a medium drink. Vegetarian." },
];

export const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i])) as Record<string, Item>;
export const inCategory = (c: string) => ITEMS.filter((i) => i.category === c);
export const valueItems = () => ITEMS.filter((i) => i.tags?.includes("value")).sort((a, b) => a.price - b.price);
export const money = (n: number) => `$${n.toFixed(2)}`;

/** The nutrition line the reference prints under every item. */
export const DISCLAIMER = "2,000 calories a day is used for general nutrition advice, but calorie needs vary. Calorie counts here are invented for a layout study.";
