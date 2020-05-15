var button_colors = ["red", "blue", "green", "yellow"];
var audio_objects = {};
var duration = 200;

// Enable all soundfiles
for (var i = 0; i < button_colors.length; i++) {
    audio_objects[button_colors[i]] = new Audio("sounds/" + button_colors[i] + ".mp3");
}
var wrong_sound = new Audio("sounds/wrong.mp3");

// Add players
var computer = new Player({name : "Computer"});
var player_one = new Player({name : "Player One"});

// Add event listeners to all four buttons.
button_colors.forEach(function(color) {
    $("#" + color).click(function() {
        take_a_turn({color: color, player: player_one});
    })
})

$("#start_button").click(function() {
    new_game();
    take_a_turn({player: computer});
 });

async function animate_button({color, button_press_duration = 200} = {}) {
    $("#" + color).toggleClass("pressed");
    await new Promise(r => setTimeout(r, button_press_duration)); 
    $("#" + color).toggleClass("pressed");
}

function new_game() {
    computer.sequence = [];
    player_one.sequence = [];
    duration = 200;
}

function Player({name} = {}) {
    this.name = name; // Any text string
    this.sequence = [];
}

function play_sound({color} = {}) {
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

async function take_a_turn({color = random_color(), 
                            player, 
                            pause_between_button_presses_duration = 900} = {}) {                        
    player.sequence.push(color);
    console.log(player, player.sequence);
    if (player === computer) {
        for (var i = 0; i < player.sequence.length; i++) {
            animate_button({color: player.sequence[i]});
            play_sound({color: player.sequence[i]});
            await new Promise(r => setTimeout(r, pause_between_button_presses_duration));
        }
    } else if (player != computer) {
        animate_button({color: color});
        for (var i = 0; i < player.sequence.length; i++) {
            if (player.sequence[i] === computer.sequence[i]) {
                play_sound({color: color});
            } else {
                play_sound({color: "wrong_sound"});
                await new Promise(r => setTimeout(r, 200));
                if (player.sequence.length <= computer.sequence.length) {
                    for (var repeat = 0; repeat < 3; repeat++) {
                        animate_button({color: computer.sequence[i]});
                        play_sound({color: computer.sequence[i]});
                        await new Promise(r => setTimeout(r, 300));
                    }
                } else {
                    alert("Too many buttons!");
                    break;
                }               
            }
        }
    }
}