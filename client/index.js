function setButtonToggles(btnList, form) {
    const showForm = function (form) {
        if (form.classList.contains("hidden")) {
            form.classList.remove("hidden");
            form.classList.add("visible");
        }
    };

    const toggle = function (toShow, toHide) {
        if (toShow.classList.contains("disabled")) {
            toShow.classList.remove("disabled");
        }

        if (!toHide.classList.contains("disabled")) {
            toHide.classList.add("disabled");
        }
    };

    btnList.forEach(({ button, show, hide }) => {
        button.addEventListener("click", () => {
            showForm(form);
            toggle(show, hide);
        });
    });
}

function hideElement(element) {
    if (element.classList.contains("visible")) {
        element.classList.remove("visible");
        element.classList.add("hidden");
    }
}

function initForm() {
    const joinOpenBtn = document.querySelector("#join");
    const createOpenBtn = document.querySelector("#create");

    const form = document.querySelector("#lobby-form");

    const acceptBtn = document.querySelector("#accept");
    const backBtn = form.querySelector("#back");

    const roomInput = document.querySelector("#room");
    const passInput = document.querySelector("#password");
    const playerSelect = document.querySelector("#player-select");
    const playersHolder = document.querySelector("#players");
    const playerOptions = document.getElementsByTagName("option");

    const btnToggles = [
        { button: createOpenBtn, show: playersHolder, hide: roomInput },
        { button: joinOpenBtn, show: roomInput, hide: playersHolder },
    ];
    setButtonToggles(btnToggles, form);

    backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        roomInput.value = "";
        passInput.value = "";
        playerOptions[0].selected = "selected";
        hideElement(form);
    });

    acceptBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (playersHolder.classList.contains("disabled")) {
            const roomNum = roomInput.value;
            const pass = passInput.value;
            console.log(roomNum, pass);
        } else {
            const pass = passInput.value;
            const players = playerSelect.value;
            console.log(pass, players);
        }
    });
}

initForm();
