

const App = () => {
    return (
        <div>
            <div id='makeTeam'>
                <TeamForm />
            </div>
            <div id='teams'>
                <TeamList teams={[]} />
            </div>
        </div>
    );
}

const init = () => { 
    const root = createRoot(document.getElementById('app'));
};