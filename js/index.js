var button_colors = ["red", "blue", "green", "yellow"];
var audio_objects = {};
var duration = 200;
var playing = false;
var level = 1;

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
    playing = true;
    level = 1;
    $("#level_title").text("Level " + level);
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
    } else {
        // TODO: Fix looping issue not working properly.  Currently, it only
        // considers a match if the user only clicks the last button in the
        // computer's sequence, (or the first if you uncomment out the
        // player_one.sequence = []; line in the if (playing === true) section
        // below) rather than cycling through and testing the entire array.

        // for (var x in player.sequence) {
        // for (var i = 0; i < player.sequence.length; i++) {
        //     console.log(i);
        // }
        // for (var x = 0; x < player.sequence.length; x++) {
        //     console.log("player one", player.sequence[x]);
        //     console.log("computer", computer.sequence[x]);
        // }
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
                playing = false;
                $("#level_title").text("Game Over");
                break;
                } else {
                    playing = false;
                    $("#level_title").text("Game Over");
                    alert("Too many buttons!");
                    // TODO: Better error-handling for this state and/or remove
                    // ability for user to get into this state at all, (i.e. 
                    // toggling event listeners, etc).
                    console.log("Player pressed more buttons than are in the computer sequence");
                    break;
                }               
            }
        }
        if (playing === true) {
            player_one.sequence = [];
            await new Promise(r => setTimeout(r, 800));
            level = level + 1;
            $("#level_title").text("Level " + level);
            take_a_turn({player: computer});
        }  
    }
}

// TODO: Add timer to computer turns so that the amount of time between, and
// the duration of, the computer animations decreases, (i.e. the game speeds up)
// as the levels go up.  Note: there probably should be a floor to how low these
// can go to not make the game impossible.

// TODO: Add timer to player's turn to reduce the amount of time they have to 
// respond to the computer's patterns as the levels go up.

// TODO: Add formal scorekeeping and (top 10) high score board.

// TODO: After scorekeeping, add ability for a group of players to keep their
// own high score boards, separate and distinct from all others.  The idea is
// that a given person can share a link, etc with some of their friends to get
// them to try to beat their score, and that that group-specific scoreboard will
// be maintained for that group as a way of helping engage that group to keep
// coming back to play again, presuming that a high score board of just their
// friends will be much more motivating than a ridiculously high general score
// board filled of random Internet people.  Note: there should be no limit to 
// the number of people that can be in each group.