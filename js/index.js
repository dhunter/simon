var button_colors = ["red", "blue", "green", "yellow"];
var audio_objects = {};
for (var i = 0; i < button_colors.length; i++) {
    audio_objects[button_colors[i]] = new Audio("sounds/" + button_colors[i] + ".mp3");
}
var sequence_computer = [];
var sequence_user = [];

// Add event listeners to all four buttons.
Object.keys(audio_objects).forEach(function(color) {
    $("#" + color).click(function() {
        check_user(color);
        animate_button({color: color});
        play_sound(color);
    })
})

function add_to_sequence(color) {
    sequence_computer.push(color);
    console.log(sequence_computer);
    animate_button({color: color});
}

async function animate_button({color, duration = 200} = {}) {
    $("#" + color).toggleClass("pressed");
    await new Promise(r => setTimeout(r, duration));
    $("#" + color).toggleClass("pressed");
}

function check_user(color) {
    sequence_user.push(color);
    console.log(sequence_user);
}

function play_sound(color) {
    audio_objects[color].currentTime = 0;
    audio_objects[color].play();
}

function random_color() {
    return button_colors[Math.floor(Math.random() * 4)];
}