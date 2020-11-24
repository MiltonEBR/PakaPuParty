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
function setBackBtn({ backBtn, form, roomInput, nameInput, privCheck }) {
    backBtn.addEventListener('click', (e) => {
        hideElement(form);
        if (roomInput) roomInput.value = '';
        if (privCheck) privCheck.checked = false;
        nameInput.value = '';
    });
}

//Sets the form's accept button (Sends request to join/create)
function setAcceptBtn({ acceptBtn, nameInput, roomInput, privCheck }) {
    if (privCheck) {
        acceptBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const username = nameInput.value;
            const private = privCheck.checked;

            fetch('/play', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, private }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.text();
                    } else {
                        throw 'Error on the AJAX call';
                    }
                })
                .then((url) => {
                    window.location.replace(window.location + 'play?room=' + url);
                });
        });
    } else {
        acceptBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.preventDefault();

            const username = nameInput.value;
            const room = roomInput.value;

            fetch('/play', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, room }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.text();
                    } else {
                        throw 'Error on the AJAX call';
                    }
                })
                .then((url) => {
                    window.location.replace(window.location + 'play?room=' + url);
                });
        });
    }
}

function initLobby() {
    const joinElements = {
        form: document.querySelector('#lobby-form-join'),
        backBtn: document.querySelector('#back-join'),
        acceptBtn: document.querySelector('#accept-join'),
        roomInput: document.querySelector('#room'),
        nameInput: document.querySelector('#username-join'),
    };

    const createElements = {
        form: document.querySelector('#lobby-form-create'),
        backBtn: document.querySelector('#back-create'),
        acceptBtn: document.querySelector('#accept-create'),
        nameInput: document.querySelector('#username-create'),
        privCheck: document.querySelector('#priv-check'),
        // playerSelect: document.querySelector('#player-select'),
        // playerOptions: document.getElementsByTagName('option'),
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
