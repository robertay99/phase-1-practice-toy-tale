let isToyFormVisible = false;

document.addEventListener("DOMContentLoaded", () => {
    const toyCreationButton = document.querySelector("#new-toy-btn");
    const formContainer = document.querySelector(".container");
    const toyCreationForm = document.querySelector(".add-toy-form");
    const toysDisplayArea = document.getElementById("toy-collection");

    // Toggle visibility of the toy creation form
    toyCreationButton.addEventListener("click", () => {
        isToyFormVisible = !isToyFormVisible;
        formContainer.style.display = isToyFormVisible ? "block" : "none";
    });

    // Fetch existing toys and display them on page load
    fetch('http://localhost:3000/toys')
        .then(res => res.json())
        .then(toys => {
            toys.forEach(toy => {
                displayToy(toy);
            });
        })
        .catch(err => console.error("Error fetching toys:", err));

    // Handle the submission of the toy creation form
    toyCreationForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent the form from refreshing the page

        const toyName = event.target.name.value;  // Retrieve the name from the form
        const toyImageURL = event.target.image.value; // Retrieve the image URL from the form

        console.log("Creating toy:", toyName, toyImageURL);  // Log the toy details

        const newToyData = {
            name: toyName,
            image: toyImageURL,
            likes: 0  // Set initial likes to zero
        };

        // Send a POST request to add the new toy
        fetch('http://localhost:3000/toys', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newToyData)  // Convert toy data to JSON
        })
        .then(res => res.json())
        .then(toy => {
            displayToy(toy);  // Render the new toy card
            toyCreationForm.reset();  // Clear the form fields
        })
        .catch(err => {
            console.error("Error adding new toy:", err);  // Log any errors
        });
    });

    // Function to create and display a toy card
    function displayToy(toy) {
        const toyCard = document.createElement('div');
        toyCard.className = 'card';

        toyCard.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class="toy-avatar" />
            <p>${toy.likes} Likes</p>
            <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;

        toysDisplayArea.appendChild(toyCard);

        // Attach event listener to the like button
        const likeButton = toyCard.querySelector('.like-btn');
        likeButton.addEventListener('click', () => {
            updateLikes(toy.id, toyCard); // Call function to update likes
        });
    }

    // Function to update the likes count
    function updateLikes(toyId, toyCard) {
        const likesText = toyCard.querySelector('p');
        const currentLikes = parseInt(likesText.textContent); // Get current likes
        const updatedLikes = currentLikes + 1; // Increment likes

        // Send a PATCH request to update the likes for the toy
        fetch(`http://localhost:3000/toys/${toyId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ likes: updatedLikes })  // Send the new likes count
        })
        .then(res => res.json())
        .then(updatedToy => {
            likesText.textContent = `${updatedToy.likes} Likes`; // Update the displayed likes
        })
        .catch(err => {
            console.error("Error updating likes:", err); // Log any errors
        });
    }
});
