//Sets button to show an element while hiding another
function setButtonToggle(button, show, hide) {
    const toggle = function (toShow, toHide) {
        if (toShow.classList.contains('disabled')) {
            toShow.classList.remove('disabled');
        }

        if (!toHide.classList.contains('disabled')) {
            toHide.classList.add('disabled');
        }
    };

    button.addEventListener('click', () => {
        toggle(show, hide);
    });
}

//Hides given target
function hideElement(target) {
    if (!target.classList.contains('disabled')) {
        target.classList.add('disabled');
    }
}

//Sets the form's back button (Clears user input)
function setBackBtn({ backBtn, form, roomInput, passInput, playerOptions }) {
    backBtn.addEventListener('click', (e) => {
        hideElement(form);
        if (roomInput) roomInput.value = '';
        if (playerOptions) playerOptions[0].selected = 'selected';
        passInput.value = '';
    });
}

//Sets the form's accept button (Sends request to join/create)
function setAcceptBtn({ acceptBtn, passInput, roomInput, playerSelect }) {
    if (playerSelect) {
        acceptBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const password = passInput.value;
            const players = playerSelect.value;

            fetch('/play', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ players, password }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.text();
                    } else {
                        throw 'Error on the AJAX call';
                    }
                })
                .then((url) => {
                    window.location.replace(window.location + 'play?room=' + '123');
                });
        });
    } else {
        acceptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Join req ' + passInput.value + ' | ' + roomInput.value);
        });
    }
}

function initLobby() {
    const joinElements = {
        form: document.querySelector('#lobby-form-join'),
        backBtn: document.querySelector('#back-join'),
        acceptBtn: document.querySelector('#accept-join'),
        roomInput: document.querySelector('#room'),
        passInput: document.querySelector('#password-join'),
    };

    const createElements = {
        form: document.querySelector('#lobby-form-create'),
        backBtn: document.querySelector('#back-create'),
        acceptBtn: document.querySelector('#accept-create'),
        passInput: document.querySelector('#password-create'),
        playerSelect: document.querySelector('#player-select'),
        playerOptions: document.getElementsByTagName('option'),
    };

    const joinBtn = document.querySelector('#join');
    const createBtn = document.querySelector('#create');

    //Join form setup
    setButtonToggle(joinBtn, joinElements.form, createElements.form);
    setBackBtn(joinElements);
    setAcceptBtn(joinElements);

    //Create form setup
    setButtonToggle(createBtn, createElements.form, joinElements.form);
    setBackBtn(createElements);
    setAcceptBtn(createElements);
}

initLobby();
