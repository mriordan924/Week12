// const recipeURL="https://64ee46831f872182714277cf.mockapi.io/Recipes"


$(document).ready(function () {
    const recipeURL = "https://64ee46831f872182714277cf.mockapi.io/Recipes";

    // function to fetch and display recipe cards
    function fetchRecipeCards() {
        $.ajax({
            url: recipeURL,
            method: "GET",
            success: function (recipes) {
                const recipeCardsContainer = $("#recipeCardsContainer");
                recipeCardsContainer.empty();

                recipes.forEach(function (recipe) {
                    const card = `
                    <div class="col-md-4 mb-4 recipe-card">
                        <div class="card">
                            <img src="${recipe.dishPhoto}" class="card-img-top" alt="Recipe Photo">
                            <div class="card-body">
                                <h5 class="card-title">${recipe.dishName}</h5>
                                <p class="card-text">Ingredients:  ${recipe.ingredients}</p>
                                <p class="card-text recipe-preview">Recipe: ${recipe.dishRecipe.substring(0,100)}<button class="btn btn-outline-secondary btn-sm toggle-recipe small-button" data-toggle="collapse" data-target="recipeCollapse${recipe.id}">Read More</button></p>
                                <p class="card-text recipe-full" style="display:none;">Recipe: ${recipe.dishRecipe}<button class="btn btn-outline-secondary btn-sm toggle-recipe small-button" data-toggle="collapse" data-target="recipeCollapse${recipe.id}">Read Less</button></p>
                                <p class="card-text">Shared by: ${recipe.username} </p>
                                <button data-id="${recipe.id}" class="btn btn-outline-success edit-button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                                <button data-id="${recipe.id}" class="btn btn-outline-danger delete-button">Delete</button> 
                            </div>
                        </div>
                    </div>
                    `;
                    recipeCardsContainer.append(card);
                });
                // handle read more recipe: 

                $(".toggle-recipe").click(function () {
                    const card = $(this).closest(".recipe-card");
                    const preview = card.find(".recipe-preview");
                    const fullRecipe = card.find(".recipe-full");
        
                    if (fullRecipe.is(":hidden")) {
                        // show full recipe and change button to "Read Less"
                        fullRecipe.show();
                        preview.hide();
                        // $(this).text("Read Less");
                    } else {
                        // hide full recipe and change button to "Read More"
                        fullRecipe.hide();
                        preview.show();
                        // $(this).text("Read More");
                    }
                });

                // edit button
                $(".edit-button").click(function () {
                    const id = $(this).data("id");
                    const modal = $("#editModal");

                    $.ajax({
                        url: `${recipeURL}/${id}`,
                        method: "GET",
                        success: function (recipe) {
                            // Populate the modal or form with the current data
                            modal.find("#editDishName").val(recipe.dishName);
                            modal.find("#editIngredients").val(recipe.ingredients);
                            modal.find("#editDishRecipe").val(recipe.dishRecipe);
                            modal.find("#editDishPhoto").val(recipe.dishPhoto);
                            modal.find("#editUsername").val(recipe.username);

            modal.find("#editForm").submit(function (e) {
                    e.preventDefault();
// get updated edited values:
                    const updatedDishName = modal.find("#editDishName").val();
                    const updatedIngredients = modal.find("#editIngredients").val();
                    const updatedDishRecipe = modal.find("#editDishRecipe").val();
                    const updatedDishPhoto = modal.find("#editDishPhoto").val();
                    const updatedUsername = modal.find("#editUsername").val();

                    // update recipe

                    $.ajax({
                        url: `${recipeURL}/${id}`,
                        method: "PUT", 
                        data: {
                            dishName: updatedDishName,
                            ingredients: updatedIngredients,
                            dishRecipe: updatedDishRecipe,
                            dishPhoto: updatedDishPhoto,
                            username: updatedUsername,
                        },
                        success: function () {
                            // close modal
                            modal.modal("hide");
                            // fetch and display updated recipe cards
                            fetchRecipeCards();
                        }
                    });
                });
            }
         });
});
                // delete button
                // $(".delete-button").click(function () {
                $("#recipeCardsContainer").on("click", ".delete-button", function () {
                const id = $(this).data("id");
                // console.log("delete button clicked for id", id);
                 

                $.ajax({
                    url: `${recipeURL}/${id}`,
                    method: "DELETE",
                    success: function () {
                        $(this).closest(".card").remove();
                        fetchRecipeCards();
                    }
                });
        });
    }
});
}

    // fetch and display initial recipe cards
    fetchRecipeCards();

    // submit form
    $("#recipeForm").submit(function (e) {
        e.preventDefault();

        const username = $("#username").val();
        const dishName = $("#dishName").val();
        const ingredients = $("#ingredients").val();
        const dishRecipe = $("#dishRecipe").val();
        const dishPhoto = $("#dishPhoto").val();

                // create a new recipe
                const newRecipe = {
                    username: username,
                    dishName: dishName,
                    ingredients: ingredients,
                    dishRecipe: dishRecipe,
                    dishPhoto: dishPhoto,
                };
        
                
        
                // add the new recipe to the mockAPI
                $.ajax({
                    url: recipeURL,
                    method: "POST",
                    data: newRecipe,
                    success: function () {
                        // clear form inputs
                        $("#username").val("");
                        $("#dishName").val("");
                        $("#ingredients").val("");
                        $("#dishRecipe").val("");
                        $("#dishPhoto").val("");
        
                        // fetch and display updated recipe cards
                        fetchRecipeCards();
                    }
                });
    });
});