// Keeps the editor line-number gutter aligned with the text area content.
let area = document.getElementById("f_c")
let line_div = document.getElementById("l_d")
let place_div = document.getElementById("place")
function number_lines() {
    let lines = area.value.split(/\r|\r\n|\n/);
    let line_numbers = "";
    let all_lines = 0;
    for (let i = 1; i <= lines.length; i++) {
        line_numbers += i + "\n";
        all_lines++;
    }
    for (let i = 0; i < lines.length; i++) {
        for (let j = 1; j < lines[i].length / 81; j++) {
            console.log(lines[i].length)
            if (lines[i].length > j * 81) {
                all_lines++;
                line_numbers += all_lines + "\n";
            }
        }
    }

    area.rows = all_lines + 5
    line_div.innerHTML = line_numbers;
    line_div.style.height = ((all_lines + 5) * 25) + "px";
    place_div.style.height = ((all_lines + 5) * 25) + "px";
}

number_lines();

area.onkeyup = number_lines;