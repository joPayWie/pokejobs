/* 
----------------------------------------------------------------------------
GENERAL
----------------------------------------------------------------------------
*/

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const putInUpperCase = (location) => {  
    let locationArr = location.split('')
    locationArr[0].toUpperCase()
    return locationArr.join('')
}  // DOESN'T WORK YET

/* 
----------------------------------------------------------------------------
API fetching
----------------------------------------------------------------------------
*/

const getPokeJobs = async () => {
    const response = await fetch("https://6372bd9a348e947299fc35f9.mockapi.io/tp/jobs")
    const jobs = await response.json()
    return jobs
}

getPokeJobs().then(data => renderPokeJobs(data))

/* 
----------------------------------------------------------------------------
DOM
----------------------------------------------------------------------------
*/

// Show pokéjobs

const renderPokeJobs = (pokeJobs) => {
    for (const { name, description, location, pkType, level, email } of pokeJobs) {
        $("#job-container").innerHTML += ` 
        <div class="w-full md:w-1/4 bg-white text-black text-sm rounded p-3 my-3 md:m-3">
            <h2 class="font-semibold">${name}</h2>
            <div class="flex">
                <img src="assets/images/pokeTypes/${pkType[0]}.svg" alt="${pkType}" class="h-12 mx-1">
                <img src="assets/images/pokeTypes/${pkType[1] ? pkType[1] : 'notype'}.svg" class="h-12 mx-1">
                <img src="assets/images/pokeTypes/${pkType[2] ? pkType[2] : 'notype'}.svg" class="h-12 mx-1">
            </div>
            <p><strong>Description: </strong>${description}</p>
            <span><strong>Location: </strong>${location}</span><br>
            <span><strong>Level required: </strong>${level}</span><br>
            <address><small><strong>Contact: </strong>${email}</small></address>
        </div>
        `
    }
}

// Pkmn sprites in menu

const pokeLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 1, 2, 3, 4, 5, 6, 7];

const getRandomChar = (pokeArray) => {
    let randomIndex = Math.floor(Math.random() * pokeArray.length)
    let randomSelection = pokeArray[randomIndex];
    return randomSelection  
}

const showRandomPkmn = () => {
    $("#sprite1").innerHTML = `${getRandomChar(pokeLetters)}`
    $("#sprite2").innerHTML = `${getRandomChar(pokeLetters)}`
    $("#sprite3").innerHTML = `${getRandomChar(pokeLetters)}`
    $("#sprite4").innerHTML = `${getRandomChar(pokeLetters)}`
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
    showRandomPkmn()
    $(".mobile-menu").classList.toggle("hidden");
    $("#burger-icon-lines").classList.toggle("hidden")
    $("#burger-icon-xmark").classList.toggle("hidden")
})