// Create Player class and constructor
// extends with Sprite class
class Player extends Sprite{
    constructor({position,
                 collisionBlocks,
                 platformCollisionBlocks, 
                 imageSrc, 
                 frameRate, 
                 scale = 0.5, 
                 animations}) {
        super({imageSrc, frameRate, scale});
        this.position= position;
        this.velocity = {
            x: 0,
            y: 1,
        }

        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
//Player hitbox
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10
        }
        this.animations = animations
// Set defaut player direction is 'right'
        this.lastDirection = 'right'

        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }
// Camerabox, move screen when player moving and camera box collision with sreen
        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return
        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate

    }
// update camera box
    updateCameraBox() {
        this.camerabox = {
            position: {
                x: this.position.x - 30,
                y: this.position.y,
            },
            width: 150,
            height: 80,
        }
    }
// Check for horizontal canvas collision
    checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 644 || this. hitbox.position.x + this.velocity.x <=0) {
            this.velocity.x = 0
        }
    }
    

    shouldPanCameraToTheLeft({canvas, camera}) {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
        const scaledDownCanvasWidth = canvas.width / 4

        if (cameraboxRightSide >= 640) return

        if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }
    shouldPanCameraToTheRight({canvas, camera}) {
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }
    shouldPanCameraUp({canvas, camera}) {
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }
    shouldPanCameraDown({canvas, camera}) {
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 800) return

        const scaledCanvasHeight =  canvas.height / 4

        if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y 
        }
    }
    
    update() {
        this.updateFrames();
        this.updateHitbox();
        this.updateCameraBox();
        

        c.fillStyle = 'rgba(0,0,255,0.2';
        c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height);

        // draws out the image
        //c.fillStyle = 'rgba(0,255,0,0.2';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.fillStyle = 'rgba(255,0,0,0.2';
        c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);




        this.drawCharacter();
        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkForHorizontalCollisions();
        this.applyGravity(); 
        this.updateHitbox();
        this.checkForVerticalCollisions();
        
    }
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 28,
            },
            width: 15,
            height: 25
        }
    }
    // Check for player collision: Horizontal Collision
    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if(collision({
                object1: this.hitbox,
                object2: collisionBlock,
            })) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0

                    
                    const offsetx = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - offsetx - 0.01
                    break;
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0

                    const offsetx = this.hitbox.position.x - this.position.x

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offsetx + 0.01
                    break;
                }
            }
        }
    }
    applyGravity() {
            this.velocity.y += gravity;
            this.position.y += this.velocity.y;
        
            
        }
    // Check for player collision: Vertical collision
        checkForVerticalCollisions() {
            for (let i = 0; i < this.collisionBlocks.length; i++) {
                const collisionBlock = this.collisionBlocks[i]

                if(collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        //take the distance from the bottom of hitbox to the top of the original player position.y and take the collisionBLock.position.y - that distance so we can get the correct of this.position.y of the hitbox

                        // lấy khoảng cách giữa đáy hitbox đến đỉnh của khung nguyên bản và lấy vị trí của khối va chạm trừ đi khoảng cách đó ta được khoảng cách giữa chân người chơi và đáy khung nguyên bản, sau đó chỉ cần trừ đi khoảng cách đó khi reset mỗi khi va chạm là chân người chơi sẽ chạm đất.
                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                        this.position.y = collisionBlock.position.y - offset - 0.01
                        break;
                    }
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0

                        const offset = this.hitbox.position.y - this.position.y

                        this.position.y = collisionBlock.position.y + collisionBlock.height- offset + 0.01
                        break;
                    }
                }
            }
            // platfrom collision blocks
            for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
                const platformCollisionBlock = this.platformCollisionBlocks[i]

                if(platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock,
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        //take the distance from the bottom of hitbox to the top of the original player position.y and take the platformCollisionBlock.position.y - that distance so we can get the correct of this.position.y of the hitbox

                        // lấy khoảng cách giữa đáy hitbox đến đỉnh của khung nguyên bản và lấy vị trí của khối va chạm trừ đi khoảng cách đó ta được khoảng cách giữa chân người chơi và đáy khung nguyên bản, sau đó chỉ cần trừ đi khoảng cách đó khi reset mỗi khi va chạm là chân người chơi sẽ chạm đất.
                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                        this.position.y = platformCollisionBlock.position.y - offset - 0.01
                        break;
                    }

                }
            }
        }
        
};

