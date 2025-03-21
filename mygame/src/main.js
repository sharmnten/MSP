import kaplay from "kaplay";
import "kaplay/global"; // uncomment if you want to use without the k. prefix
kaplay({
    debugKey: 'd',

});

loadRoot("./"); // A good idea for Itch.io publishing later
loadSprite("player", "sprites/player.png");
loadSprite("enemy","sprites/enemy.png");
loadShaderURL("effect", null, "shaders/crt.frag");
usePostEffect("effect",{"u_flatness": 3});
// Game settings
setGravity(0);
setBackground([0, 0, 0]);
const SPEED = 300;
const BULLET_SPEED = 600;
drawStars(100);
    //add postEffect
    
    
    



//game objects
const player = add([
    pos(width()/2, 3*height()/4),
    scale(2),
    sprite("player"),
    anchor("center"),
    area(),
    body(),
]);
    //add enemies
const ENEMY_X = width()/100;
const ENEMY_Y = 4;
for(let j = 0; j < ENEMY_Y; j++) {
    for(let i = 0; i < ENEMY_X; i++) {
        add([
            sprite("enemy"),
            scale(2),
            rotate(180),
            //rect(30, 30),
            pos(i * 64 + 32, j * 64 + 32),
            area(),
            layer("game"),
            color(255, 0, 0),
            "enemy",
        ]);
    }
}
   let score = add([
        text("Score: 0"),
        pos(120, 40),
        anchor('center'),
        layer("ui"),
        {
            value: 0,
        }
    ]);


//Collisions
onCollide("bullet", "enemy", (b, e) => {
    destroy(b);
    destroy(e);
    //addKaboom(e.pos);
    addExplode(e.pos,5,24,1);
    shake(10);
    burp();
    score.value++;
    score.text = "Score: " + score.value;
});






//Controls

onKeyPress("space", () => {
    spawnBullet(player.pos);
});

onKeyDown("left", () => {
    player.move(-SPEED, 0);
});
onKeyDown("right", () => {
    player.move(SPEED, 0);
});


//get all enemies




//onUpdate
onUpdate(() => {
    let enemies = get("enemy");
    if(player.pos.x < 0) {
        player.pos.x = width();
    }
    if(player.pos.x > width()) {
        player.pos.x = 0;
    }
    if(enemies.length === 0) {
        //win
        add([
            text("You win!"),
            pos(width()/2, height()/2),
            anchor("center"),
            color(0, 255, 0),
        ]);
    }
    enemies.forEach((e) => {
        spawnEnemyBullet(e.pos);
        let dir = 1;
        if(e.pos.x>width()){
            e.pos.x = 0;
            e.pos.y = e.pos.y+50;
        }
       
        e.move(20*dir,0);
    });
});





//define function
function spawnBullet(p) {
    add([
        rect(15, 48),
        area(),
        pos(p),
        anchor("center"),
        color(127, 127, 255),
        outline(4),
        move(UP, BULLET_SPEED),
        offscreen({ destroy: true }),
        // strings here means a tag
        "bullet",
    ]);   
}
function spawnEnemyBullet(p) {
    if(Math.random() < 0.01) {
    add([
        rect(15, 48),
        color(255,0,0),
        area(),
        pos(p),
        anchor("center"),
        color(127, 127, 255),
        outline(4),
        move(DOWN, BULLET_SPEED),
        offscreen({ destroy: true }),
        // strings here means a tag
        "e-bullet",
    ]);
}
}
function addExplode(p, n, rad, size) {
    for (let i = 0; i < n; i++) {
        wait(rand(n * 0.1), () => {
            for (let i = 0; i < 2; i++) {
                add([
                    pos(p.add(rand(vec2(-rad), vec2(rad)))),
                    rect(4, 4),
                    scale(1 * size, 1 * size),
                    opacity(),
                    lifespan(0.1),
                    grow(rand(48, 72) * size),
                    anchor("center"),
                ]);
            }
        });
    }
}
function grow(rate) {
    return {
        update() {
            const n = rate * dt();
            this.scale.x += n;
            this.scale.y += n;
        },
    };
}
function drawStars(numStars) {
    for (let i = 0; i < numStars; i++) {
        add([
            rect(rand(2, 5), rand(2, 5)),
            pos(rand(0, width()), rand(0, height())),
            color(255, 255, 255),
            opacity(0.8),
            layer("background"),
            anchor("center"),
        ]);
    }
}

// Call the function to draw stars
drawStars(100);