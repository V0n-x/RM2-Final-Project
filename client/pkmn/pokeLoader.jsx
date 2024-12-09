const { all } = require("underscore");

// fetch stuff for poke API
const urlPoke = "https://pokeapi.co/api/v2/pokemon/";
const urlItem = "https://pokeapi.co/api/v2/item/"; //IMPLEMENT ONCE IT ACTUALLY WORKS

const loadXHR = (url, callback) =>{

    if((parseResult(xhr) === 0) || (parseResult(xhr) === null)){return;};

    let xhr = new XMLHttpRequest;
    xhr.onload = () => callback(xhr);
    xhr.open("GET",url);
    xhr.send();
}

// returns a json object if it goes through and returns 0 for bailing out
// placed here instead of with <Main> for the form loader
const parseResult = (xhr) => {
    // get xhr response and declare json variable to attempt to store the object
    const string = xhr.responseText;
    let json;

    // try-catch block
    try{
        json = JSON.parse(string);
    }catch(error){
        console.log(`Error: ${error}`)
        // bailout
        return 0;
    }
    console.log(json)
    return json;
}

// load the list
const pokeList = () => {
    
    const allPoke = loadXHR(`${urlPoke}?offset=0&limit=1025`, parseResult);
    
    const pokeListItems = allPoke.results.map((poke) => {});
}