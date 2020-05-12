var button_colors = ["red", "blue", "green", "yellow"];
var audio_objects = {};
var sequence_computer = [];
var sequence_player = [];
var duration = 200;

// Enable all soundfiles
for (var i = 0; i < button_colors.length; i++) {
    audio_objects[button_colors[i]] = new Audio("sounds/" + button_colors[i] + ".mp3");
}
var wrong_sound = new Audio("sounds/wrong.mp3");

// Add event listeners to all four buttons.
Object.keys(audio_objects).forEach(function(color) {
    $("#" + color).click(function() {
        take_a_turn({color: color, player: "player"});
        animate_button({color: color});
        play_sound(color);
    })
})

$("#start_button").click(function() {
    new_game();
    take_a_turn({player: "computer"});
 });

function add_to_sequence({color, player = "computer"} = {}) {
    var current_sequence = [];
    if (player === "computer") {
        current_sequence = sequence_computer;
    } else {
        current_sequence = sequence_player;
    }
    current_sequence.push(color);
    console.log(player, current_sequence);
    // animate_button({color: color});
}

async function animate_button({color, duration = 200} = {}) {
    $("#" + color).toggleClass("pressed");
    await new Promise(r => setTimeout(r, duration));
    $("#" + color).toggleClass("pressed");
}

function check_user() {
    if (sequence_computer.length === sequence_player.length) {
        if (sequence_player[(sequence_player.length - 1)]
            = sequence_computer[(sequence_computer.length - 1)]) {
                return true;
            } else {
                return false;
            }
    } else {
        alert("Player turns not equal");
    }
}

// function increase_speed() {
//     if duration < 
// }

function new_game() {
    sequence_computer = [];
    sequence_player = [];
    duration = 200;
}

function play_sound(color) {
    if (color === "wrong_sound") {
        wrong_sound.play()
    } else {
        audio_objects[color].currentTime = 0;
        audio_objects[color].play();
    }
}

function random_color() {
    return button_colors[Math.floor(Math.random() * 4)];
}

function take_a_turn({color = random_color(), player = "computer"} = {}) {
    add_to_sequence({color: color, player: player});
    if (player === "computer") {
        animate_button({color: color});
        play_sound(color);
    }
    if (player === "player") {
        if (check_user() === true) {
            
        };
    }

}