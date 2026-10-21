// Sends edited text and an optional new filename back to the server.
let ren_div = document.getElementById("rename");
let ren_dial = document.getElementById("ren_dial");
let ren_name = document.getElementById("new_name");
let ren_ok = document.getElementById("ren_ok");
let ren_can = document.getElementById("ren_cancel");
let save_chg_div = document.getElementById("save_chg");
area = document.getElementById("f_c");
let f_name_div = document.getElementById("f_name");

let ren_visible = false;

ren_div.onclick = function () {
    if (!ren_visible) {
        ren_dial.style.visibility = "visible";
        ren_visible = true;
    }
    else {
        ren_dial.style.visibility = "hidden";
        ren_visible = false;
    }
}

ren_can.onclick = function () {
    ren_dial.style.visibility = "hidden";
    ren_visible = false;
}

let new_filename = "";

ren_ok.onclick = function () {
    new_filename = ren_name.value;
    console.log(new_filename);
    ren_dial.style.visibility = "hidden";
    ren_visible = false;
    alert("Nazwa zostanie zmieniona wraz z zapisem zmian w pliku!")
}

function fetchSave(changes) {

    const body = JSON.stringify(changes) // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    let obj = { method: "post", body, headers }

    console.log(obj);
    alert("Plik zapisano!!!")

    fetch("/show", obj) // fetch
        .then(response => response.json())
        .then(
            data => console.log(data) // dane odpowiedzi z serwera
        )
}

save_chg_div.onclick = function () {
    let chg = {
        new_name: new_filename,
        file_content: area.value,
        file_name: f_name_div.innerText
    }

    fetchSave(chg);
}