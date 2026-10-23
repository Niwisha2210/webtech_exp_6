// =======================================
// YUMMYBITES - JAVASCRIPT FUNCTIONS
// =======================================

// Get HTML elements
const recipeForm = document.getElementById("recipeForm");
const recipeName = document.getElementById("recipeName");
const recipeCategory = document.getElementById("recipeCategory");
const recipeDescription = document.getElementById("recipeDescription");

const recipeGrid = document.getElementById("recipeGrid");
const recipeCount = document.getElementById("recipeCount");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

const filterButtons = document.querySelectorAll(".filter-button");

// Current filter
let currentFilter = "all";

// Default recipes
const starterRecipes = [
    {
        id: "starter-1",
        name: "Strawberry Pancakes",
        category: "Breakfast",
        description: "Fluffy pancakes topped with fresh strawberries and maple syrup.",
        image: "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\strawberry pancake.png",
        favourite: true
    },
    {
        id: "starter-2",
        name: "Creamy Pasta",
        category: "Lunch",
        description: "Comforting pasta tossed in a creamy sauce with herbs.",
        image: "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\pasta.png",
        favourite: false
    },
    {
        id: "starter-3",
        name: "Chocolate Cake",
        category: "Dessert",
        description: "A rich chocolate treat for your sweetest celebrations.",
        image: "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\chocolate cake.png",
        favourite: true
    },
    {
        id: "starter-4",
        name: "Fresh Garden Salad",
        category: "Lunch",
        description: "Crisp greens and colourful vegetables in every bite.",
        image: "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\salad-backup.jpg",
        favourite: false
    },
    {
        id: "starter-5",
        name: "Berry Smoothie",
        category: "Drinks",
        description: "A refreshing blend of berries for a bright start.",
        image: "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\smoothie.png",
        favourite: false
    },
    {
        id: "starter-6",
        name: "Golden Croissants",
        category: "Snacks",
        description: "Buttery, flaky pastries perfect for a cosy morning.",
        image: "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\croissant.png",
        favourite: false
    }
];

// Load saved recipes or show the starter recipes
function loadRecipes() {
    try {
        const savedRecipes = localStorage.getItem("yummyBitesRecipes");

        if (savedRecipes !== null) {
            const parsedRecipes = JSON.parse(savedRecipes);

            if (Array.isArray(parsedRecipes)) {
                return parsedRecipes;
            }
        }
    } catch (error) {
        console.error("Could not load recipes:", error);
    }

    return starterRecipes;
}

// Save recipes in the browser
function saveRecipes() {
    try {
        localStorage.setItem(
            "yummyBitesRecipes",
            JSON.stringify(recipes)
        );
    } catch (error) {
        console.error("Could not save recipes:", error);
    }
}

// Store all recipes in one array
let recipes = loadRecipes();


// =======================================
// 1. CREATE A RECIPE
// =======================================

function createRecipe(name, category, description) {
    return {
        id: Date.now() + "-" + Math.random().toString(16).slice(2),
        name: name,
        category: category,
        description: description,
        image: getCategoryImage(category),
        favourite: false
    };
}


// Choose a picture based on the category
function getCategoryImage(category) {
    const images = {
        Breakfast:
            "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\breakfast.png",

        Lunch:
            "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\lunch.png",

        Dinner:
            "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\dinner.png",

        Dessert:
            "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\chocolate cake.png",

        Snacks:
            "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\croissant.png",

        Drinks:
            "C:\\Users\\USER\\OneDrive\\Desktop\\web tech lab\\exp 6\\smoothie.png"
    };

    return images[category] || images.Dessert;
}


// =======================================
// 2. ADD A RECIPE
// =======================================

function addRecipe(name, category, description) {
    const newRecipe = createRecipe(name, category, description);

    recipes.push(newRecipe);

    saveAndRender();
}


// =======================================
// 3. TOGGLE A FAVOURITE
// =======================================

function toggleFavourite(id) {
    recipes = recipes.map(function(recipe) {
        if (recipe.id === id) {
            return {
                ...recipe,
                favourite: !recipe.favourite
            };
        }

        return recipe;
    });

    saveAndRender();
}


// =======================================
// 4. DELETE A RECIPE
// =======================================

function deleteRecipe(id) {
    recipes = recipes.filter(function(recipe) {
        return recipe.id !== id;
    });

    saveAndRender();
}


// =======================================
// 5. FILTER AND SEARCH RECIPES
// =======================================

function getVisible() {
    let visibleRecipes = recipes;

    // Show favourites only when selected
    if (currentFilter === "favourites") {
        visibleRecipes = visibleRecipes.filter(function(recipe) {
            return recipe.favourite;
        });
    }

    // Search by recipe name, category or description
    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText !== "") {
        visibleRecipes = visibleRecipes.filter(function(recipe) {
            return (
                recipe.name.toLowerCase().includes(searchText) ||
                recipe.category.toLowerCase().includes(searchText) ||
                recipe.description.toLowerCase().includes(searchText)
            );
        });
    }

    return visibleRecipes;
}


// =======================================
// 6. CREATE A RECIPE CARD
// =======================================

function recipeItem(recipe) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    // Image area
    const imageBox = document.createElement("div");
    imageBox.className = "recipe-image";

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.name;
    image.loading = "lazy";

    // Use a local fallback if a remote image fails
    image.addEventListener("error", function() {
        imageBox.style.background = "#fff0f1";
        image.style.display = "none";
    }, { once: true });

    const category = document.createElement("span");
    category.className = "category-badge";
    category.textContent = recipe.category;

    // Favourite button
    const favouriteButton = document.createElement("button");
    favouriteButton.type = "button";
    favouriteButton.className = "favourite-button";

    if (recipe.favourite) {
        favouriteButton.classList.add("is-favourite");
    }

    favouriteButton.textContent = recipe.favourite ? "♥" : "♡";
    favouriteButton.setAttribute(
        "aria-label",
        recipe.favourite ? "Remove from favourites" : "Add to favourites"
    );
    favouriteButton.setAttribute("aria-pressed", String(recipe.favourite));

    favouriteButton.addEventListener("click", function() {
        toggleFavourite(recipe.id);
    });

    imageBox.appendChild(image);
    imageBox.appendChild(category);
    imageBox.appendChild(favouriteButton);

    // Recipe details
    const info = document.createElement("div");
    info.className = "recipe-info";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const description = document.createElement("p");
    description.textContent = recipe.description;

    const bottom = document.createElement("div");
    bottom.className = "recipe-bottom";

    const label = document.createElement("span");
    label.textContent = recipe.favourite
        ? "♥ Your favourite"
        : "✿ Made with love";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-recipe";
    deleteButton.textContent = "Delete ×";
    deleteButton.setAttribute("aria-label", "Delete " + recipe.name);

    deleteButton.addEventListener("click", function() {
        deleteRecipe(recipe.id);
    });

    bottom.appendChild(label);
    bottom.appendChild(deleteButton);

    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(bottom);

    card.appendChild(imageBox);
    card.appendChild(info);

    return card;
}


// =======================================
// 7. DISPLAY RECIPES
// =======================================

function renderRecipes() {
    recipeGrid.innerHTML = "";

    const visibleRecipes = getVisible();

    visibleRecipes.forEach(function(recipe) {
        recipeGrid.appendChild(recipeItem(recipe));
    });

    recipeCount.textContent = recipes.length;

    emptyState.hidden = visibleRecipes.length !== 0;

    filterButtons.forEach(function(button) {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });
}


// =======================================
// 8. SAVE AND REFRESH
// =======================================

function saveAndRender() {
    saveRecipes();
    renderRecipes();
}


// =======================================
// 9. VALIDATE THE RECIPE FORM
// =======================================

function clearErrors() {
    document.getElementById("nameError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("descriptionError").textContent = "";
    document.getElementById("successMessage").textContent = "";
}

function validateRecipeForm() {
    clearErrors();

    let isValid = true;

    const name = recipeName.value.trim();
    const category = recipeCategory.value;
    const description = recipeDescription.value.trim();

    if (name === "") {
        document.getElementById("nameError").textContent =
            "Please enter a recipe name.";
        isValid = false;
    } else if (name.length < 3) {
        document.getElementById("nameError").textContent =
            "Recipe name must have at least 3 characters.";
        isValid = false;
    }

    if (category === "") {
        document.getElementById("categoryError").textContent =
            "Please choose a category.";
        isValid = false;
    }

    if (description === "") {
        document.getElementById("descriptionError").textContent =
            "Please describe your recipe.";
        isValid = false;
    } else if (description.length < 10) {
        document.getElementById("descriptionError").textContent =
            "Description must have at least 10 characters.";
        isValid = false;
    }

    return isValid;
}


// =======================================
// 10. HANDLE FORM SUBMISSION
// =======================================

function handleSubmit(event) {
    event.preventDefault();

    if (!validateRecipeForm()) {
        return;
    }

    addRecipe(
        recipeName.value.trim(),
        recipeCategory.value,
        recipeDescription.value.trim()
    );

    document.getElementById("successMessage").textContent =
        "♥ Your recipe has been added to YummyBites!";

    recipeForm.reset();

    // Return to all recipes so the new recipe is visible
    currentFilter = "all";
    searchInput.value = "";
    renderRecipes();

    document.getElementById("recipes").scrollIntoView({
        behavior: "smooth"
    });
}


// =======================================
// 11. CHANGE FILTER
// =======================================

function setFilter(filter) {
    currentFilter = filter;
    renderRecipes();
}


// =======================================
// 12. CONNECT EVENTS
// =======================================

// Handle recipe form submission
recipeForm.addEventListener("submit", handleSubmit);

// Handle search
searchInput.addEventListener("input", renderRecipes);

// Handle filter buttons
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        setFilter(button.dataset.filter);
    });
});


// =======================================
// 13. INITIAL PAGE RENDER
// =======================================

renderRecipes();