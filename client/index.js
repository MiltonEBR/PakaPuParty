function initFormToggle(elementList, form) {
    const showForm = function (element) {
        if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
            element.classList.add("visible");
        }
    };

    const toggleElements = function (toShow, toHide) {
        if (toShow.classList.contains("disabled")) {
            toShow.classList.remove("disabled");
        }

        if (!toHide.classList.contains("disabled")) {
            toHide.classList.add("disabled");
        }
    };

    elementList.forEach(({ button, show, hide }) => {
        button.addEventListener("click", () => {
            showForm(form);
            toggleElements(show, hide);
        });
    });
    // if (create.classList.contains("disabled")) {
    //     create.classList.remove("disabled");
    // }
}

function hideElement(form) {
    if (form.classList.contains("visible")) {
        form.classList.remove("visible");
        form.classList.add("hidden");
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

    const formOptions = [
        { button: createOpenBtn, show: playersHolder, hide: roomInput },
        { button: joinOpenBtn, show: roomInput, hide: playersHolder },
    ];
    initFormToggle(formOptions, form);

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
