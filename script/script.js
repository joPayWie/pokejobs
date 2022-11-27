/* 
----------------------------------------------------------------------------
GENERAL
----------------------------------------------------------------------------
*/

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)




/* 
----------------------------------------------------------------------------
DOM
----------------------------------------------------------------------------
*/

const pokeLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 1, 2, 3, 4, 5, 6, 7];

const getRandomChar = (pokeArray) => {
    let randomIndex = Math.floor(Math.random() * pokeArray.length)
    let randomSelection = pokeArray[randomIndex];
    return randomSelection  
}

const showRandomPkmn = () => {
    $("#sprite1").innerHTML = `${getRandomChar(pokeLetters)}`
    $("#sprite2").innerHTML = `${getRandomChar(pokeLetters)}`
}

showRandomPkmn()

// Modal
for (const btn of $$(".add-job-link")) { 
    btn.addEventListener("click", () => {
        $("#container-modal").classList.remove("hidden")
    })
}

$("#modal-btn-cancel").addEventListener("click", () => {
    $("#container-modal").classList.add("hidden")
})

// Burger menu
$(".mobile-menu-button").addEventListener("click", () => {
    $(".mobile-menu").classList.toggle("hidden");
    $("#burger-icon-lines").classList.toggle("hidden")
    $("#burger-icon-xmark").classList.toggle("hidden")
})