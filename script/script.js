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

const pkTypes = $$(".pk-type")

const maxThreeTypes = () => {
    let checkedArr = []
    for (const checkbox of pkTypes) {
        if (checkbox.checked && checkedArr.length < 3) {
            checkedArr.push(checkbox.value)
        }
    } return checkedArr
}

/* 
----------------------------------------------------------------------------
API fetching
----------------------------------------------------------------------------
*/
// get pokejobs
const getPokeJobs = async (jobId = '') => {
    const response = await fetch(`https://6372bd9a348e947299fc35f9.mockapi.io/tp/jobs/${jobId}`)
    const jobs = await response.json()
    return jobs
}

getPokeJobs().then(data => renderPokeJobs(data))



// post pokejob
const createNewJob = () => {
    return {
        "name": $("#addjob-name").value,
        "description": $("#addjob-description").value,
        "location": $("#addjob-location").value,
        "pkType": maxThreeTypes(),
        "level": $("#addjob-level").value,
        "email": $("#addjob-email").value
    }
}

const postPokeJob = async () => {
    fetch(`https://6372bd9a348e947299fc35f9.mockapi.io/tp/jobs`, {
    method: "POST",
    headers: {
        'Content-Type': 'Application/json'
    },
    body: JSON.stringify(createNewJob())
    }).finally(() => window.location.href = "index.html")
}

/* 
----------------------------------------------------------------------------
DOM
----------------------------------------------------------------------------
*/
// Show details of pokejob
const renderSelectedPkJob = (pkJob) => {
    const { id, name, pkType, description, location, level, email } = pkJob
    $("#job-container").innerHTML = ``
    $("#job-container").innerHTML = `
    <div class="w-full md:w-1/4 bg-white text-black text-sm rounded p-3 my-3 md:m-3">
        <h2 class="font-semibold text-lg">${name}</h2>
        <div class="flex">
            <img src="assets/images/pokeTypes/${pkType[0]}.svg" alt="${pkType}" class="h-12 mx-1">
            <img src="assets/images/pokeTypes/${pkType[1] ? pkType[1] : 'notype'}.svg" class="h-12 mx-1">
            <img src="assets/images/pokeTypes/${pkType[2] ? pkType[2] : 'notype'}.svg" class="h-12 mx-1">
        </div>
        <p><strong>Description: </strong>${description}</p>
        <span><strong>Location: </strong>${location}</span><br>
        <span><strong>Level required: </strong>${level}</span><br>
        <address><small><strong>Contact: </strong>${email}</small></address>
        <button class="text-xs flex items-center bg-[#36A95E] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]" job-id="${id}">Edit</button> <button class="text-xs flex items-center bg-[#ED6764] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]" job-id="${id}">Delete</button>
    </div>
    `
}

// Show pokéjobs
const renderPokeJobs = (pokeJobs) => {
    for (const { id, name, description, location, pkType, level } of pokeJobs) {
        $("#job-container").innerHTML += ` 
        <div class="w-full md:w-1/4 bg-white text-black text-sm rounded p-3 my-3 md:m-3">
            <h2 class="font-semibold text-lg">${name}</h2>
            <div class="flex">
                <img src="assets/images/pokeTypes/${pkType[0]}.svg" alt="${pkType}" class="h-12 mx-1">
                <img src="assets/images/pokeTypes/${pkType[1] ? pkType[1] : 'notype'}.svg" class="h-12 mx-1">
                <img src="assets/images/pokeTypes/${pkType[2] ? pkType[2] : 'notype'}.svg" class="h-12 mx-1">
            </div>
            <p><strong>Description: </strong>${description}</p>
            <span><strong>Location: </strong>${location}</span><br>
            <span><strong>Level required: </strong>${level}</span><br>
            <button class="details-btn text-xs flex items-center bg-[#242424] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]"  job-id="${id}">Details</button>
        </div>
        `
        for (const btn of $$(".details-btn")) {
            btn.addEventListener("click", () => {
                let jobId = btn.getAttribute("job-id")
                getPokeJobs(jobId).then(data => renderSelectedPkJob(data))
            })
        } 
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
    for (let sprite of $$(".sprites")) {
        sprite.innerHTML = `${getRandomChar(pokeLetters)}`
    } 
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

// Modal checkboxes
for (const checkbox of pkTypes) {
    checkbox.addEventListener("change", () => {
        if ( maxThreeTypes().length === 3 ) {
            for (const checkbox of pkTypes) {
                if (!checkbox.checked) {
                    checkbox.setAttribute("disabled", '')
                }
            }
        } else {
            for (const checkbox of pkTypes) {
                checkbox.removeAttribute("disabled", '')
            }
        }
    })
}

// Modal posting pokejob
$("#modal-btn-add").addEventListener("click", (e) => {
    e.preventDefault()
    if ($("#addjob-name").value === '') {
        return $(".modal-error-name").classList.remove("hidden")
    }
    if ($("#addjob-description").value === '') {
        return $(".modal-error-description").classList.remove("hidden")
    }
    if (maxThreeTypes().length === 0) {
        $("#choose-pktype").innerHTML = ''
        $("#choose-pktype").style.color = "red"
         return $("#choose-pktype").innerHTML = 'Please choose at least one poké-type'
    }
    if ($("#addjob-level").value === '') {
        return $(".modal-error-level").classList.remove("hidden")
    }
    if ($("#addjob-email").value === '') {
        return $(".modal-error-email").classList.remove("hidden")
    }
    else { 
        postPokeJob()
        $("#container-modal").classList.add("hidden") 
    }
}) 


// Burger menu
$(".mobile-menu-button").addEventListener("click", () => {
    showRandomPkmn()
    $(".mobile-menu").classList.toggle("hidden");
    $("#burger-icon-lines").classList.toggle("hidden")
    $("#burger-icon-xmark").classList.toggle("hidden")
})