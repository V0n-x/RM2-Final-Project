const { all } = require("underscore");
const helper = require('../helper');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

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

const App = () => {
    return (
        <div>
            <DexList />
        </div>
    )
}

const DexList = () => {
    const allMons= loadXHR(`${urlPoke}?offset=0&limit=1025`, parseResult);

    const monNodes = allMons.map((mon) => {
        return (
            <span key={mon.id} className='monNode'>
                <img src={mon.sprites.find('front_default')}></img>
                <h3 className='monName'>{mon.id + ': ' + mon.name}</h3>
            </span>
        );
    });

    return (
        <div className='monList'>
            {document.querySelectorAll('.monNode').forEach((node) => {
                node.addEventListener('click', (e) => {
                    
                });
            })}
            {monNodes}
        </div>
    )
}

// load the list
const PokeList = (props) => {
    const [teams, setTeams] = useState(props.mons);
    
    useEffect(() => {
        const LoadTeamsFromServer = async () => {
            const response = await fetch('/getTeams');
            const data = await response.json();
            setTeams(data.teams);
        };
        LoadTeamsFromServer();
    }, [props.reloadTeams]);

    if(teams.length === 0){
        return (
            <div className='teamList'>
                <h3 className='emptyTeam'>No Teams Yet!</h3>
            </div>
        );
    }

    const teamNodes = teams.map((team) => {
        return (
            <div key={team._id} className='teamNode'>
                {teams.map((t) => {
                    <span>
                        {t.mons.map((mon) => {
                            let imgSrc = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/}'+mon.id+'.png';
                            <span>
                                {mon.name}
                                <img src={imgSrc} alt={'Source: '+imgSrc}></img>
                            </span>
                        })};
                    </span>
                })}
            </div>
        );
    });

    return (
        <div className='teamList'>
            {teamNodes}
        </div>
    );
}