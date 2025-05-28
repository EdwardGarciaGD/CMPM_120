class GameOver extends Phaser.Scene 
{
    constructor() 
    {
        super("gameOverScene");
    }

    init() 
    {
        this.ACCELERATION = 250;
        this.DRAG = 280;
        this.physics.world.gravity.y = 30;
        this.PARTICLE_VELOCITY = 50;
        this.JUMP_VELOCITY = -50;
        this.SCALE = 1;
    }

    create() 
    {
        this.map = this.add.tilemap("platformer-level-two", 21, 21, 60, 34);

        this.tileset = this.map.addTilesetImage("water_tilemap_packed", "tilemap_tiles");

        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0); // Special Background Scroll

        my.sprite.player = this.physics.add.sprite(150, 200, "player");
        my.sprite.player.flipX = true;
        my.sprite.player.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-D', () => 
        {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.rKey = this.input.keyboard.addKey('R');
        this.zKey = this.input.keyboard.addKey('Z');

        this.sound.play("win", { volume: .7 });

        this.cameras.main.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
        this.cameras.main.startFollow(my.sprite.player, true, .2, .6);
        this.cameras.main.setDeadzone(50, 480);
        this.cameras.main.setZoom(this.SCALE+1.5);

        document.getElementById('description').innerHTML = '<h2>Game Over'
    }

    update() {
        if(cursors.left.isDown) 
        {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } 
        else if(cursors.right.isDown) 
        {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
        } 
        else 
        {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle', true);
        }

        if(Phaser.Input.Keyboard.JustDown(this.zKey)) 
        {
            my.sprite.player.anims.play('jump');
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound", { volume: 1 });
            if (my.sprite.player.flipX) 
            {
                this.tweens.add(
                {
                    targets: my.sprite.player,
                    angle: 360,
                    duration: 220,
                    ease: 'Linear', // Optional: Choose an easing function
                    loop: true // Optional: Set to true for looping
                });
            }
            else 
            {
                this.tweens.add(
                {
                    targets: my.sprite.player,
                    angle: -360,
                    duration: 220,
                    ease: 'Linear', // Optional: Choose an easing function
                    loop: true // Optional: Set to true for looping
                });
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) 
        {
            this.scene.restart();
        }
    }
}