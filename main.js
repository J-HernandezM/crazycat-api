const API = 'https://api.thecatapi.com/v1'
const queryForRandom='limit=3'
const apikey= 'api_key=live_dmrJe4N7iBfBzCsV1xstWzE3vaN40chdGlnk26PIQzpwYHnfNqFNI5DTQI4e1w4H'
const newBtn = document.querySelector('.newBtn')
const favBtn = document.querySelectorAll('.favoriteBtn')
const imgs = document.querySelectorAll('.randomCats')
const favSection = document.querySelector('.favorites')
const deleteAllBtn = document.querySelector('.deleteAll')
const showAllBtn = document.querySelector('.showAll')
let idArray=[]
let imgsArray = [...imgs]
let btnsArray = [...favBtn]

async function fetchData(urlApi, query){
    if(query){
        let response
        if(query.method=='POST' || query.method=='DELETE'){
            response = await fetch(urlApi, query)
            return response
        }

    }else{
        response = await fetch(urlApi)
        const data = await response.json()
        return data
    }
}
async function callRandomData(urlApi){
    try{
        const fullInfo = await fetchData(`${urlApi}/images/search?${queryForRandom}&${apikey}`)
        for (let i=0; i<imgsArray.length; i++){
            imgsArray[i].src=fullInfo[i].url
            imgsArray[i].id=fullInfo[i].id
        } 
    }
    catch(error){
        console.log('Hubo un error: ', error)
    }
}
async function callFavouriteData(urlApi, toDelete){
    let fullInfo
    try{
        fullInfo = await fetchData(`${urlApi}/favourites?${apikey}`)
        if(!toDelete){
            favSection.innerHTML=''

            fullInfo.forEach((fav)=>{
                const imageURL = fav.image.url
                const imageID = fav.id
                const imageStructure = `<figure class="imgContainer fav"><img src="${imageURL}" alt="a CrazyCat" class="randomCats"><button id=${imageID} class="btn closeBtn">❌</button></figure>`
                const newDiv = document.createElement('div')
                newDiv.classList.add('card', 'favCard')
                newDiv.innerHTML=imageStructure
                favSection.appendChild(newDiv)
        })
        }else{
            fullInfo.forEach((favToDelete)=>{
                const id = favToDelete.id
                deleteFavouriteData(API, id)
            })
        }
    }
    catch(error){
        console.log('Hubo un error: ', error)
    }
}
async function postFavouriteData(urlApi, idImage){
    let rawBody = JSON.stringify({
        "image_id": `${idImage}`})
    const fullInfo = await fetchData(`${urlApi}/favourites?${apikey}`, {
        method: 'POST',
        body: rawBody,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    callFavouriteData(API)
    
}
async function deleteFavouriteData(urlApi, id){
    const response = await fetchData(`${urlApi}/favourites/${id}?${apikey}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    callFavouriteData(API)
}
function execute(){
    callRandomData(API)
}
newBtn.addEventListener('click', execute)
favBtn.forEach((btn=>{
    //add to fav
    btn.addEventListener('click', (event)=>{
        const idImage = event.target.previousElementSibling.id
        //post fav and call all favs
        postFavouriteData(API, idImage)
    })
}))
//Event delegation
favSection.addEventListener('click', (event)=>{
    if(event.target.classList.contains('closeBtn')){
        let favIdDelete = event.target.id
        deleteFavouriteData(API, favIdDelete)
/*         let parentElement = event.target.parentElement.parentElement
        favElement.removeChild(parentElement) */
    }
})
showAllBtn.addEventListener('click', ()=>{callFavouriteData(API)})
deleteAllBtn.addEventListener('click', async ()=>{
    let toDelete = true
    callFavouriteData(API, toDelete)
})

callRandomData(API)