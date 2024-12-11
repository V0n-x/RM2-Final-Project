const socket = io();

const handleEditBox = () => {
    const editForm = document.getElementById('editForm');
    const editBox = document.getElementById('editBox');
    const channelSelect = document.getElementById('channelSelect');

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(editBox.value){
            socket.emit('chat message', editBox.value);
            editBox.value = '';
        }

        return false;
    });
};

const displayMessage = (msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    document.getElementById('messages').appendChild(messageDiv);
}

const handleChannelSelect = () => {
    const channelSelect = document.getElementById('channelSelect');
    const messages = document.getElementById('messages');

    channelSelect.addEventListener('change', () => {
        messages.innerHTML = '';
        socket.emit('room change', channelSelect.value);
    });
}

export const init = () => {

    handleEditBox();
    socket.on('chat message', displayMessage);
    handleChannelSelect();
};
