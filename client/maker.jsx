const helper = require('./helper');
const React = require('react');
import Select from 'react-select';
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
import 'bulma/css/bulma.css';
//
// fetch stuff for poke API
const urlPoke = "https://pokeapi.co/api/v2/pokemon/";

const loadFetch = async (url, callback) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        callback(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const handleAddMon = (e, onMonAdded) => {
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
        console.log(`species: ${species}, name: ${name}, evs: ${evs}, ivs: ${ivs}, moves: ${moves}`);
        return false;
    };

    helper.sendPost(e.target.action, { species, name, evs, ivs, moves }, onMonAdded);
}

const MonForm = (props) => {
    const [monToLoad, setMonToLoad] = useState(null);

    useEffect(() => {
        const defaultPokemon = props.defaultPokemon || 'charizard';
        loadFetch(`${urlPoke}${defaultPokemon}`, (data) => {
            setMonToLoad(data);
        });
    }, [props.defaultPokemon]);

    const handleMon = (selectedOption) => {
        const loadLink = `${urlPoke}${selectedOption.value}`;
        loadFetch(loadLink, (data) => {
            setMonToLoad(data);
        });
    };

    if (!monToLoad) return <div>Loading...</div>;

    return (
        <container>
            <form id='monForm'
                onSubmit={(e) => handleAddMon(e, props.triggerReload)}
                name='monForm'
                action='/maker'
                method='POST'
            >
                <div className='is-flex is-flex-direction-row '>
                <div id='names' className='justify-content justify-content-center'>
                    <input id='name' type='text' value={monToLoad.name}></input>
                    <img src={monToLoad.sprites.front_default} alt={monToLoad.name}></img>
                    <MonList handleMon={handleMon} />
                </div>
                <div id='moveset'>
                    <span>
                        <label htmlFor='move1'>Move 1: </label>
                        <MoveList mon={monToLoad.name} slot={0} />
                    </span>
                    <span>
                        <label htmlFor='move2'>Move 2: </label>
                        <MoveList mon={monToLoad.name} slot={1} />
                    </span>
                    <span>
                        <label htmlFor='move3'>Move 3: </label>
                        <MoveList mon={monToLoad.name} slot={2} />
                    </span>
                    <span>
                        <label htmlFor='move4'>Move 4: </label>
                        <MoveList mon={monToLoad.name} slot={3} />
                    </span>
                </div>
                <div id='etc'>
                    <span id='level'>
                        <label htmlFor='level'>Level: </label>
                        <input type='number' min='1' max='100' value='50'></input>
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
                            value={"serious"}
                            options={[
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
                            ]}
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
                            value={monToLoad.abilities[0].ability.name}
                            options={monToLoad.abilities.map((ability) => ({
                                value: ability.ability.name,
                                label: ability.ability.name
                            }))}
                        />
                    </span>
                </div>
                <div id='stats' className='is-flex is-flex-direction-column'>
                    <span>
                        <label htmlFor='hp'>HP: {monToLoad.stats[0].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' value='0'></input>
                        <input className='iv' type='number' min='0' max='31' value='31'></input>
                    </span>
                    <span>
                        <label htmlFor='atk'>Atk: {monToLoad.stats[1].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' value='0'></input>
                        <input className='iv' type='number' min='0' max='31' value='31'></input>
                    </span>
                    <span>
                        <label htmlFor='def'>Def: {monToLoad.stats[2].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' value='0'></input>
                        <input className='iv' type='number' min='0' max='31' value='31'></input>
                    </span>
                    <span>
                        <label htmlFor='spAtk'>Sp. Atk: {monToLoad.stats[3].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' value='0'></input>
                        <input className='iv' type='number' min='0' max='31' value='31'></input>
                    </span>
                    <span>
                        <label htmlFor='spDef'>Sp. Def: {monToLoad.stats[4].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' value='0'></input>
                        <input className='iv' type='number' min='0' max='31' value='31'></input>
                    </span>
                    <span>
                        <label htmlFor='speed'>Speed: {monToLoad.stats[5].base_stat}</label>
                        <input className='ev' type='number' min='0' max='252' value='0'></input>
                        <input className='iv' type='number' min='0' max='31' value='31'></input>
                    </span>
                </div>
                </div>
                <input type='submit' value='Add Pokemon'></input>
            </form>
        </container>
    )
};

const MonList = ({ handleMon }) => {
    const [monNodes, setMonNodes] = useState([]);

    useEffect(() => {
        loadFetch(`${urlPoke}?offset=0&limit=1025`, (data) => {
            setMonNodes(data.results.map((mon) => ({
                value: mon.name,
                label: mon.name
            })));
        });
    }, []);

    return (
        <Select
            className='basic-single'
            isDisabled={false}
            isLoading={monNodes.length === 0}
            isClearable={true}
            isRtl={false}
            isSearchable={true}
            id='monSpecies'
            options={monNodes}
            onChange={handleMon}
        />
    );
};

const MoveList = ({ mon, slot, props }) => {
    const [moveNodes, setMoveNodes] = useState([]);
    const [selection, setSelection] = useState(null);

    useEffect(() => {
        loadFetch(`${urlPoke}${mon}`, (data) => {
            setMoveNodes(data.moves.map((move) => ({
                value: move.move.name,
                label: move.move.name
            })));
        });
    }, [mon]);

    const changeHandler = (m) => { 
        console.log(m);
        setSelection(m);
        console.log(selection);
    };

    return (
        <Select
            className='basic-single'
            isDisabled={false}
            isLoading={moveNodes.length === 0}
            isClearable={true}
            isRtl={false}
            isSearchable={true}
            id={`move${slot + 1}`}
            options={moveNodes}
            value={selection}
            onChange = {changeHandler}
        />
    );
}

const AddedMons = (props) => { 
const [monList, setMonList] = useState([]);
useEffect(() => {
    const loadMons = async () => { 
    const response = await fetch('/getMons');
    const data = await response.json();
    setMonList(data.monList);
    };
}, [props.triggerReload]);

if(monList.length === 0) return <div>No Pokemon added yet!</div>;

const addedNodes = monList.map((mon) => { 
    return (
        <div id={mon.name} className='is-flex'>
            <h3>{mon.name} the {mon.species}</h3>
            <container className='is-flex is-flex-direction-column'>
                <span>Level: {mon.level}</span>
                <span>Ability: {mon.ability}</span>
                <span>Moves: {mon.moves.join(', ')}</span>
                <span>Hidden Stats: HP / ATK / DEF / Sp. ATK / Sp. DEF/ Speed</span>
                <span>EVs: {mon.evs.join(' / ')}</span>
                <span>IVs: {mon.ivs.join(' / ')}</span>
            </container>
        </div>
    )})

    return (
        <div id='addedMons'>
            {addedNodes}

        </div>
    )
};


const App = () => {
    return (
        <div>
            <MonForm defaultPokemon="charizard" triggerReload={() => { }} />
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;