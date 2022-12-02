/* 
----------------------------------------------------------------------------
GENERAL
----------------------------------------------------------------------------
*/

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const putInUpperCase = (location) => {  
    const locationUpper = location.charAt(0).toUpperCase() + location.slice(1)
    return locationUpper
} 

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

const deletePokeJob = async (jobId) => {
    fetch(`https://6372bd9a348e947299fc35f9.mockapi.io/tp/jobs/${jobId}`, {
        method: "DELETE"
    }).finally(() => window.location.href = "index.html")
}

/* 
----------------------------------------------------------------------------
FILTERS
----------------------------------------------------------------------------
*/

const filterBy = (pokeJobs, key, value) => {
    const filterArr = pokeJobs.filter(pokeJob => {
      return pokeJob[key] === value
    })
    return filterArr
}

getPokeJobs().then(data => renderPokeJobs(filterJobs(data)))

const searchLocationInput = $("#search-location")
const searchTypeInput = $("#search-type")
const searchLevelInput = $("#search-level")


let cagate = [{
    "name": "Fireman",
    "description": "You will have to put out forest and home fires. Mandatory being water type.",
    "location": "johto",
    "pkType": ["water"],
    "level": 50,
    "id": "1",
    "email": "firemen123@pkmn.com" 
   },
   {
    "name": "Energy booster",
    "description": "Your duty will be to provide energy to different establishments (hospitals, companies, etc.). Mandatory to be electric type.",
    "location": "kanto",
    "pkType": ["electric"],
    "level": 20,
    "id": "2",
    "email": "energyplant@pkmn.com" 
   },
   {
    "name": "Water transfers",
    "description": "You will make transfers from one place to another through water, using a safety trailer. Part time job. Desirable water type.",
    "location": "hoenn",
    "pkType": ["water"],
    "level": 60,
    "id": "3",
    "email": "acquatic-transfers@pkmn.com" 
   },
   {
    "name": "Trash burning",
    "description": "Garbage burning and ash management.",
    "location": "johto",
    "pkType": ["fire"],
    "level": 35,
    "id": "4",
    "email": "goodbye-garbage@pkmn.com" 
   }]

const filterJobs = (data) => {
    let arrayFiltered = data
    if (searchLocationInput.value !== 'all') {
        arrayFiltered = filterBy(arrayFiltered, 'location', searchLocationInput.value)
    }
    if (searchTypeInput.value !== 'all') {
        arrayFiltered = filterBy(arrayFiltered, 'type', searchTypeInput.value)
    }
    if (searchLevelInput !== 'all') {
        
    }
    return arrayFiltered
}


/* 
----------------------------------------------------------------------------
DOM
----------------------------------------------------------------------------
*/

const hideElement = (selector) => selector.classList.add("hidden")
const unHideElement = (selector) => selector.classList.remove("hidden")

const unhideDelete = () => {
    unHideElement($("#are-u-sure"))
}

const hideDelete = () => {
    hideElement($("#are-u-sure"))
}

// Show details of pokejob
const renderSelectedPkJob = (pkJob) => {
    const { id, name, pkType, description, location, level, email } = pkJob
    $("#job-container").innerHTML = ``
    $("#job-container").innerHTML = `
    <div class="w-full md:w-2/4 bg-white text-black text-sm rounded p-3 my-3 md:m-3">
        <h2 class="font-semibold text-lg">${name}</h2>
        <div class="flex">
            <img src="assets/images/pokeTypes/${pkType[0]}.svg" alt="${pkType}" class="h-12 mx-1">
            <img src="assets/images/pokeTypes/${pkType[1] ? pkType[1] : 'notype'}.svg" class="h-12 mx-1">
            <img src="assets/images/pokeTypes/${pkType[2] ? pkType[2] : 'notype'}.svg" class="h-12 mx-1">
        </div>
        <p><strong>Description: </strong>${description}</p>
        <span><strong>Location: </strong>${putInUpperCase(location)}</span><br>
        <span><strong>Level required: </strong>${level}</span><br>
        <address><small><strong>Contact: </strong>${email}</small></address>
        <div class="flex">
            <div class="mr-3">
                <button class="text-xs flex items-center bg-[#36A95E] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]" job-id="${id}">Edit</button> <button class="text-xs flex items-center bg-[#ED6764] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]" job-id="${id}" onclick="unhideDelete()">Delete</button>
            </div>
            <span id="are-u-sure" class="hidden self-center font-semibold bg-[#FEDF63] pl-3 py-1 h-1/2 w-1/2 md:w-auto">Are you sure? <button class="font-semibold text-green-600 mx-2 px-3 py-1.5 rounded-full hover:bg-[#36A95E] hover:text-[#FEDF63]" onclick="deletePokeJob(${id})">YES</button>/<button class="font-semibold text-red-600 mx-2 px-3 py-1.5 rounded-full hover:bg-[#ED6764] hover:text-[#FEDF63]" onclick="hideDelete()">NO</button></span>
        </div>
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
            <span><strong>Location: </strong>${putInUpperCase(location)}</span><br>
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

$("#modal-btn-cancel").addEventListener("click", (e) => {
    e.preventDefault()
    hideElement($("#container-modal"))
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
$("#new-pkjob").addEventListener("submit", (e) => {
    e.preventDefault()
    if (maxThreeTypes().length === 0) {
            $("#choose-pktype").innerHTML = ''
            $("#choose-pktype").style.color = "red"
            return $("#choose-pktype").innerHTML = 'Please choose at least one poké-type'
    }
     else {
        postPokeJob()
        hideElement($("#container-modal")) 
    }
}) 


for (const checkbox of $$(".pk-type")) {
    checkbox.addEventListener("change", () => {
        $("#choose-pktype").innerHTML = ''
        $("#choose-pktype").style.color = "#035A9A"
        $("#choose-pktype").innerHTML = 'You can choose up to 3 types'
    })
}

// Burger menu
$(".mobile-menu-button").addEventListener("click", () => {
    showRandomPkmn()
    $(".mobile-menu").classList.toggle("hidden");
    $("#burger-icon-lines").classList.toggle("hidden")
    $("#burger-icon-xmark").classList.toggle("hidden")
})