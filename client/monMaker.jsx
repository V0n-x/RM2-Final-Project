const helper = require('./helper');
const React = require('react');
import Select from 'react-select';
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
//
// fetch stuff for poke API
const urlPoke = "https://pokeapi.co/api/v2/pokemon/";

const loadXHR = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => callback(xhr);
    xhr.open("GET", url);
    xhr.send();
    if ((parseResult(xhr) === 0) || (parseResult(xhr) === null)) { return; };
}

// returns a json object if it goes through and returns 0 for bailing out
// placed here instead of with <Main> for the form loader
const parseResult = (xhr) => {
    // get xhr response and declare json variable to attempt to store the object
    const string = xhr.responseText;
    let json;

    // try-catch block
    try {
        json = JSON.parse(string);
    } catch (error) {
        console.log(`Error: ${error}`)
        // bailout
        return 0;
    }
    console.log(json)
    return json;
}

const handleMon = (e, onMonAdded) => {
    e.preventDefault();
    helper.hideError();

    const species = e.target.querySelector('#monSpecies').value;
    const name = e.target.querySelector('#name').value;
    let evs = [];
    let ivs = [];
    const moves = [
        e.target.querySelector('#move1').value,
        e.target.querySelector('#move2').value,
        e.target.querySelector('#move3').value,
        e.target.querySelector('#move4').value
    ]

    const effortList = e.target.querySelectorAll('.ev');
    const ivList = e.target.querySelectorAll('.iv');

    effortList.forEach((ev) => {
        evs.push(ev.value);
    });
    ivList.forEach((iv) => {
        ivs.push(iv.value);
    });

    if (!species || !name || !evs || !ivs || !moves) {
        helper.handleError('All fields required!');
        return false;
    };

    helper.sendPost(e.target.action, { species, name, evs, ivs, moves }, onMonAdded);
}

const monForm = (props) => {
    const [monToLoad, setMonToLoad] = useState(null);

    useEffect(() => {
        loadXHR(`${urlPoke}charizard`, (xhr) => {
            setMonToLoad(parseResult(xhr));
        });
    }, []);

    const handleMon = (e) => {
        console.log(`Selected: ${e.target.value}`);
        const loadLink = `${urlPoke}${e.target.value}`;
        loadXHR(loadLink, (xhr) => {
            setMonToLoad(parseResult(xhr));
        });
    };

    if (!monToLoad) return <div>Loading...</div>;

    return (
        <div>
            <form id='monForm'
                onSubmit={(e) => handleMon(e, props.triggerReload)}
                name='monForm'
                action='/maker'
                method='POST'
                className='monForm'
            >
                <div id='names'>
                    <input id='name' type='text' placeholder={monToLoad.name}></input>
                    <img src={monToLoad.sprites.front_default} alt={monToLoad.name} />
                    {monList(handleMon)}
                </div>
                <div id='moveset'>
                    <span>
                        <label htmlFor='move1'>Move 1: </label>
                        {moveList(monToLoad.name, 0)}
                    </span>
                    <span>
                        <label htmlFor='move1'>Move 2: </label>
                        {moveList(monToLoad.name, 1)}
                    </span>
                    <span>
                        <label htmlFor='move1'>Move 3: </label>
                        {moveList(monToLoad.name, 2)}
                    </span>
                    <span>
                        <label htmlFor='move1'>Move 4: </label>
                        {moveList(monToLoad.name, 3)}
                    </span>
                </div>
                <div id='etc'>
                    <span id='level'>
                        <label htmlFor='level'>Level: </label>
                        <input type='number' min='1' max='100' placeholder='50'></input>
                    </span>
                    <span id='nature'>
                        <label htmlFor='nature'>Nature: </label>
                        <Select
                            className='basic-single'
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isRtl={false}
                            isSearchable={true}
                            defaultValue={"serious"}
                            options={
                                [
                                    { value: "adamant", label: "adamant" },
                                    { value: "bashful", label: "bashful" },
                                    { value: "bold", label: "bold" },
                                    { value: "brave", label: "brave" },
                                    { value: "calm", label: "calm" },
                                    { value: "careful", label: "careful" },
                                    { value: "docile", label: "docile" },
                                    { value: "gentle", label: "gentle" },
                                    { value: "hardy", label: "hardy" },
                                    { value: "hasty", label: "hasty" },
                                    { value: "impish", label: "impish" },
                                    { value: "jolly", label: "jolly" },
                                    { value: "lax", label: "lax" },
                                    { value: "lonely", label: "lonely" },
                                    { value: "mild", label: "mild" },
                                    { value: "modest", label: "modest" },
                                    { value: "naive", label: "naive" },
                                    { value: "naughty", label: "naughty" },
                                    { value: "quiet", label: "quiet" },
                                    { value: "quirky", label: "quirky" },
                                    { value: "rash", label: "rash" },
                                    { value: "relaxed", label: "relaxed" },
                                    { value: "sassy", label: "sassy" },
                                    { value: "serious", label: "serious" },
                                    { value: "timid", label: "timid" }
                                ]
                            }
                        />
                    </span>
                    <span id='ability'>
                        <label htmlFor='ability'>Ability: </label>
                        <Select
                            className='basic-single'
                            isDisabled={false}
                            isLoading={false}
                            isClearable={true}
                            isRtl={false}
                            isSearchable={true}
                            defaultValue={monToLoad.abilities[0].ability.name}
                            options={monToLoad.abilities.map((ability) => {
                                return (
                                    {
                                        value: ability.ability.name,
                                        label: ability.ability.name
                                    }
                                )
                            })}
                        />
                    </span>
                </div>
                <div id='stats'>
                    <span>
                        <label htmlFor='atk'>HP: {monToLoad.stats[0].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' placeholder='0'></input>
                        <input className='iv' type='number' min='0' max='31' placeholder='31'></input>
                    </span>
                    <span>
                        <label htmlFor='atk'>Atk: {monToLoad.stats[1].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' placeholder='0'></input>
                        <input className='iv' type='number' min='0' max='31' placeholder='31'></input>
                    </span>
                    <span>
                        <label htmlFor='def'>Def: {monToLoad.stats[2].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' placeholder='0'></input>
                        <input className='iv' type='number' min='0' max='31' placeholder='31'></input>
                    </span>
                    <span>
                        <label htmlFor='atk'>Sp. Atk: {monToLoad.stats[3].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' placeholder='0'></input>
                        <input className='iv' type='number' min='0' max='31' placeholder='31'></input>
                    </span>
                    <span>
                        <label htmlFor='atk'>Sp. Def: {monToLoad.stats[4].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' placeholder='0'></input>
                        <input className='iv' type='number' min='0' max='31' placeholder='31'></input>
                    </span>
                    <span>
                        <label htmlFor='def'>Speed: {monToLoad.stats[5].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' placeholder='0'></input>
                        <input className='iv' type='number' min='0' max='31' placeholder='31'></input>
                    </span>
                </div>
            </form>
        </div>
    )
};

const monList = (changeEvent) => {

    // load list options
    const allMons = loadXHR(`${urlPoke}?offset=0&limit=1025`, parseResult);
    let monNodes = [];
    allMons.results.map((mon) => {
        monNodes.push(
            {
                value: mon.name,
                label: mon.name
            }
        );
    });

    // use react-select to make a dropdown
    // https://react-select.com/home
    return (
        <Select
            className='basic-single'
            isDisabled={false}
            isLoading={false}
            isClearable={true}
            isRtl={false}
            isSearchable={true}
            id='monSpecies'
            options={monNodes}
            defaultValue={monNodes[5]}
            onChange={changeEvent}
        />
    )
};

// movepool list
// mon is the movepool to load, slot is the slot to load it into so default values aren't all the same
const moveList = (mon, slot) => {
    // for react-select, explained later
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);

    const movepool = loadXHR(`${urlPoke}${mon}`, parseResult).moves;
    let moveNodes = [];
    movepool.map((move) => {
        moveNodes.push(
            {
                value: move.move.name,
                label: move.move.name
            }
        );
    });
    return (
        <Select
            className='basic-single'
            isDisabled={false}
            isLoading={false}
            isClearable={isClearable}
            isRtl={false}
            isSearchable={isSearchable}
            id='movepool'
            options={monNodes}
            defaultValue={monNodes[slot]}
        />
    );

}

const App = () => {
    return (
        <div>
            <monForm triggerReload={() => { }} />
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));

    root.render(<App />);
};

window.onload = init;