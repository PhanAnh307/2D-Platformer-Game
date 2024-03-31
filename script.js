
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let x = 100;
let y = 100;
canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
    width : canvas.width / 4,
    height : canvas.height / 4,
}

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 40) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 40));
}
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 793) {
            collisionBlocks.push(new CollisionBlock({ position: {
                x: x * 16,
                y: y * 16,
            }
            }))
        }
    })
});


const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 40) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 40));
}
const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 793) {
            platformCollisionBlocks.push(new PlatformBlocks({ position: {
                x: x * 16,
                y: y * 16,
            },
            height: 4
        }))
        }
    })
});



const gravity = 0.1;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc : "img/Vertical Platform Map.png",
})


const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}
//Create new Player
const player = new Player({
    position: {
        x: 0,
        y: canvas.height + 150, 
    },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: 'img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: 'img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 6
        },
        Run: {
            imageSrc: 'img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 6
        },
        Jump: {
            imageSrc: 'img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3
        },
        Fall: {
            imageSrc: 'img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3
        },
        FallLeft: {
            imageSrc: 'img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3
        },
        RunLeft: {
            imageSrc: 'img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 6
        },
        IdleLeft: {
            imageSrc: 'img/warrior/Idle_left.png',
            frameRate: 8,
            frameBuffer: 6
        },
        JumpLeft: {
            imageSrc: 'img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3
        },

    }
});

const backgrounImageHeight = 800
const camera = {
    position: {
        x: 0,
        y: -800 + scaledCanvas.height,
    }
}

function animate() { 
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(4,4);
    c.translate(camera.position.x, camera.position.y);
    background.update();
    //collisionBlocks.forEach(collisionBlock => {
    //   collisionBlock.update();
    //})
    //platformCollisionBlocks.forEach(platformBlocks => {
    //    platformBlocks.update();
    //})

    player.checkForHorizontalCanvasCollision();
    player.update();
    
    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({canvas, camera})
        
    } else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({canvas, camera})
    }else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') {
        player.switchSprite('Idle')
        }else player.switchSprite('IdleLeft')
    }

    if(player.velocity.y < 0) {
        player.shouldPanCameraUp({canvas, camera})

        if (player.lastDirection === 'right') {

        player.switchSprite('Jump')
        }else player.switchSprite('JumpLeft')

    }else if (player.velocity.y > 0) {
        player.shouldPanCameraDown({canvas, camera})
        if(player.lastDirection === 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }
    
    c.restore();
    
    
    window.requestAnimationFrame(animate);

    
}

animate();

window.addEventListener('keydown', () => {
    switch (event.key) {
        case 'a' :
        keys.a.pressed = true;
        break;
        case 'd' :
        keys.d.pressed = true;
        break;
        case 'w' :
        player.velocity.y = -3.1;
        break;

    }
});
window.addEventListener('keyup', () => {
    switch (event.key) {
        case 'a' :
        keys.a.pressed = false;
        break;
        case 'd' :
        keys.d.pressed = false;
        break;
    }
})
