// Handles editor appearance settings and persists the selected configuration.
let color_div = document.getElementById("ch_col");
area = document.getElementById("f_c");
line_div = document.getElementById("l_d");
let font_up = document.getElementById("font_u");
let font_down = document.getElementById("font_d");
let save_div = document.getElementById("save_set");
let sets = document.getElementById("sets");

let styles = [{
    bgc: "white",
    fc: "black"
},
{
    bgc: "#2a2b2b",
    fc: "white"
},
{
    bgc: "#2f0338",
    fc: "white"
},
{
    bgc: "#140d40",
    fc: "white"
},
]

let cur_sets = sets.innerText.split("-")

let current_settings = {
    bgc: cur_sets[0],
    fc: cur_sets[1],
    font: cur_sets[2]
}

let current_style = 0;

for (let i = 0; i < styles.length; i++) {
    if (styles[i].bgc == current_settings.bgc && styles[i].fc == current_settings.fc) {
        current_style = i;
    }
}

console.log(current_style);

color_div.onclick = function () {
    current_style++;
    if (current_style == 4) {
        current_style = 0;
    }
    area.style.backgroundColor = styles[current_style].bgc;
    area.style.color = styles[current_style].fc;
    line_div.style.backgroundColor = styles[current_style].bgc;
}

let current_font = current_settings.font;

font_up.onclick = function () {
    current_font++;
    area.style.fontSize = current_font + "px";
    line_div.style.fontSize = (current_font + 1) + "px"
}

font_down.onclick = function () {
    current_font--;
    area.style.fontSize = current_font + "px";
    line_div.style.fontSize = (current_font + 1) + "px"
}

function fetchPost(config) {

    const body = JSON.stringify(config) // body czyli przesyłane na serwer dane

    const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

    fetch("/show", { method: "post", body, headers }) // fetch
        .then(response => response.json())
        .then(
            data => console.log(data) // dane odpowiedzi z serwera
        )

}

save_div.onclick = function () {
    current_settings = {
        bgc: styles[current_style].bgc,
        fc: styles[current_style].fc,
        font: current_font
    }

    fetchPost(current_settings);
}
