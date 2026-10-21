// Controls image-filter visibility and applies the selected CSS filter.
let show_filters = document.getElementById("show_filters");
let filters_div = document.getElementById("filters_div");
let img_edit = document.getElementById("img_edit");
let ren_div = document.getElementById("rename");
let ren_dial = document.getElementById("ren_dial");
let ren_name = document.getElementById("new_name");
let ren_ok = document.getElementById("ren_ok");
let ren_can = document.getElementById("ren_cancel");
let save_chg_div = document.getElementById("save_chg");
let file_name_div = document.getElementById("f_name");

let filters_visible = false;

show_filters.onclick = function () {
    if (!filters_visible) {
        filters_div.style.width = "150px";
        filters_visible = true;
    }
    else {
        filters_div.style.width = "0px";
        filters_visible = false;
    }
}

let filters = [
    "grayscale",
    "invert",
    "sepia",
    "none"
]


const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
let dataUrl;
window.onload = function () {
    canvas.width = img_edit.width // testowa szerokość, docelowo trzeba zamienić na rzeczywistą szerokość obrazka
    canvas.height = img_edit.height // testowa wysokość, docelowo trzeba zamienić na rzeczywistą wysokość obrazka
    //canvas.style.display = "none";

    filters_div.appendChild(canvas)
    context.filter = "none";

    context.drawImage(img_edit, 0, 0, canvas.width, canvas.height);
    dataUrl = canvas.toDataURL("image/jpeg");
    console.log(dataUrl);
}



for (let i = 0; i < filters.length; i++) {
    let filter = document.getElementById(filters[i]);
    filter.onclick = function () {
        let filter_name = filters[i];
        if (filters[i] != "none") {
            filter_name += "(100%)";
        }
        img_edit.style.filter = filter_name;
        context.filter = filter_name; // przykładowy filtr
        context.drawImage(img_edit, 0, 0, canvas.width, canvas.height); // obrazek z filtrem widocznym na canvasie

        dataUrl = canvas.toDataURL("image/jpeg");
        console.log(dataUrl);
    }

}

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

    const body = changes // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    fetch("/show", { method: "post", body, headers })
        .then(response => response.json())
        .then(
            data => {
                console.log("plik zapisany")
            }
        )

}

save_chg_div.onclick = function () {
    let chg = JSON.stringify({
        dataUrl: dataUrl,
        new_name: new_filename,
        path: file_name_div.innerText
    })

    console.log(chg);
    alert("Plik został zapisany!!!");
    fetchSave(chg);
}