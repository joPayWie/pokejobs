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

getPokeJobs().then(data => renderPokeJobs(data)).catch(() => alert(`Sorry, database is not available at the time :(`))

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

// put
const editPokeJob  = async (jobId) => {
    fetch(`https://6372bd9a348e947299fc35f9.mockapi.io/tp/jobs/${jobId}`, {
    method: "PUT",
    headers: {
        'Content-Type': 'Application/json'
    },
    body: JSON.stringify(createNewJob())
    }).finally(() => window.location.href = "index.html")
}

/* 
----------------------------------------------------------------------------
FILTERS
----------------------------------------------------------------------------
*/

const filterByName = (pokeJobs, nameSearched) => {
    return pokeJobs.filter(pokeJob => {
        let pkJobName = pokeJob.name.toLowerCase()
        pkJobName = pkJobName.split(' ')
        for ( let i = 0; i < pkJobName.length; i++ ) {
            let eachWord = pkJobName[i]
            for ( let  j = 0; j < eachWord.length; j++ ) {
                if ( eachWord.includes(nameSearched.toLowerCase())) {
                    return pokeJob
                }
            }
        }
    })
}

const filterByLocation = (pokeJobs, value) => {
    return pokeJobs.filter(pokeJob => {
      return pokeJob.location === value
    })
}

const filterByType = (pokeJobs, value) => {
    return pokeJobs.filter(pokeJob => {
        return pokeJob.pkType.includes(value)
    }) 
}

const filterByLevel = (pokeJobs) => {
    return pokeJobs.filter(pokeJob => {
        return pokeJob.level <= $("#search-level").value
    })
}

const filterJobs = (data) => {
    let arrayFiltered = data
    if ($("#search-name").value !== '') {
        arrayFiltered = filterByName(arrayFiltered, $("#search-name").value)
    }
    if ($("#search-location").value !== 'all') {
        arrayFiltered = filterByLocation(arrayFiltered, $("#search-location").value)
    }
    if ($("#search-type").value !== 'all') {    
        arrayFiltered = filterByType(arrayFiltered, $("#search-type").value)
    }
    if ($("#search-level").value !== 'all') {
        arrayFiltered = filterByLevel(arrayFiltered)
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

const typeCheckboxes = $$(".pk-type") 

const cleanPkTypes = () => {
    for (const checkbox of typeCheckboxes) {
        checkbox.checked = false
    }
}

// Show details of pokejob
const renderSelectedPkJob = (pkJob) => {
    $("#job-container").innerHTML = `
    <div>
        <img src="./assets/images/spinner.gif" alt="spinner" width="50px">
    </div>`
    const afterTimeOut = () => {
        const { id, name, pkType, description, location, level, email } = pkJob
        $("#job-container").innerHTML = ``
        $("#job-container").innerHTML = `
            <div class="flex flex-col md:flex-row justify-center w-full">
                <div class="self-center">
                    <button id="go-back-arrow">
                        <i class="fa-solid fa-arrow-left text-5xl text-[#FEDF63] mx-3 py-1.5 px-2 footer-icons"></i>
                    <button>
                </div>
                <div class="w-full md:w-2/5 bg-white text-black text-sm rounded p-3 my-3 md:m-3">
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
                        <div class="w-1/4">
                            <button class="text-xs flex items-center bg-[#36A95E] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]" job-id="${id}" id="edit-job">Edit</button> <button class="text-xs flex items-center bg-[#ED6764] mt-2 px-3 py-1 rounded text-white hover:bg-[#53AEE5]" job-id="${id}" id="unhideDelete">Delete</button>
                        </div>
                        <span id="are-u-sure" class="flex hidden items-center justify-center self-center font-semibold bg-[#FEDF63] pl-3 py-1 h-1/2 w-3/4">Are you sure? <button class="font-semibold text-green-600 ml-1 px-3 py-1.5 rounded-full hover:bg-[#36A95E] hover:text-[#FEDF63]" onclick="deletePokeJob(${id})">YES</button>/<button class="font-semibold text-red-600 mx-2 px-3 py-1.5 rounded-full hover:bg-[#ED6764] hover:text-[#FEDF63]" id="hideDelete">NO</button></span>
                    </div>
                </div>
            </div>
            `
            $("#unhideDelete").addEventListener("click", () => {
                unHideElement($("#are-u-sure"))
            })
            $("#hideDelete").addEventListener("click", () => {
                hideElement($("#are-u-sure"))
            })
            $("#go-back-arrow").addEventListener("click", () => {
                getPokeJobs().then(data => renderPokeJobs(filterJobs(data))).catch(() => alert(`Sorry, database is not available at the time :(`))
            })
            $("#edit-job").addEventListener("click", () => {
                hideElement($("#btns-addmodal"))
                hideElement(("#addpkjob-title"))
                unHideElement($("#editpkjob-title"))
                unHideElement($("#btns-editmodal"))
                unHideElement($("#container-modal"))
                cleanPkTypes()
                $("#addjob-name").value = name
                $("#addjob-description").value = description
                $("#addjob-location").value = location
                $("#addjob-level").value = level
                $("#addjob-email").value = email
                for (let type of $$(".pk-type")) {
                    for (let i = 0; i < pkType.length; i++) {
                        if (pkType[i] === type.value) {
                            type.checked = true
                        } 
                    }
            }
        })
        $("#modal-btn-save").setAttribute("job-id", id)
    }
    window.setTimeout(afterTimeOut, 1500)
}

$("#modal-btn-save").addEventListener("click", (e) => {
    e.preventDefault()
    const jobId = $("#modal-btn-save").getAttribute("job-id")
    getPokeJobs().then(() => editPokeJob(jobId))
})

// Show pokéjobs
const renderPokeJobs = (pokeJobs) => {
    $("#job-container").innerHTML = ''
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
                    getPokeJobs(jobId).then(data => renderSelectedPkJob(data)).catch(() => alert(`Sorry, database is not available at the time :(`))
                })
            } 
        }
}

// Search jobs
$("#search-button").addEventListener("click", (e) => {
    e.preventDefault()
    $("#job-container").innerHTML = `
    <div>
        <img src="./assets/images/spinner.gif" alt="spinner" width="50px">
    </div>`
    getPokeJobs().then(data => renderPokeJobs(filterJobs(data)))
})

$("#clear-button").addEventListener("click", (e) => {
    e.preventDefault()
    $("#search-form").reset()
})

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
        unHideElement($("#btns-addmodal"))
        unHideElement($("#addpkjob-title"))
        hideElement($("#editpkjob-title"))
        hideElement($("#btns-editmodal"))
        unHideElement($("#container-modal"))
    })
}

for (const cancelBtn of $$(".modal-btn-cancel")) {
    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        hideElement($("#container-modal"))
    })
}   

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