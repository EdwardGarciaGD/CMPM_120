class Platformer extends Phaser.Scene 
{
    constructor() 
    {
        super("platformerScene");
    }

    init() 
    {
        // variables and settings
        this.ACCELERATION = 150;
        this.DRAG = 100;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2000;
        this.PARTICLE_VELOCITY = 50;
        this.JUMP_VELOCITY = -650;
        this.SCALE = 1;
    }

    preload() 
    {
        // Load the animated tiles plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() 
    {
        this.map = this.add.tilemap("platformer-level-one", 21, 21, 70, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset3 = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_background");

        // Create a layer
        this.backgroundLayer = this.map.createLayer("Background", this.tileset2, 0, 0).setScrollFactor(0.75); // Special Background Scroll
        this.environLayer = this.map.createLayer("Front-Background", this.tileset3, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        //this.groundLayer.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({ Collides: true });

        this.worms = this.map.createFromObjects("Objects", 
        {
            name: "worm",
            key: "tilemap_sheet",
            frame: 324
        });
        // Create animation for coins created from Object layer
        this.anims.create(
        {
            key: 'wormAnim', // Animation key
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                {start: 324, end: 325}
            ),
            frameRate: 2,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });

        // Play the same animation for every memeber of the Object coins array
        this.anims.play('wormAnim', this.worms);
        this.physics.world.enable(this.worms, Phaser.Physics.Arcade.STATIC_BODY);
        this.wormGroup = this.add.group(this.worms);

        this.button = this.map.createFromObjects("Objects", 
        {
            name: "button",
            key: "tilemap_sheet",
            frame: 105
        });
        this.physics.world.enable(this.button, Phaser.Physics.Arcade.STATIC_BODY);

        this.blocks = this.map.createFromObjects("Objects", 
        {
            name: "block",
            key: "tilemap_sheet",
            frame: 220
        });
        this.physics.world.enable(this.blocks, Phaser.Physics.Arcade.STATIC_BODY);
        this.blockGroup = this.add.group(this.blocks);

        // Interactive Frog with text when player is near
        this.frog = this.add.sprite(220, 325, "frog");

        this.bubble = this.add.sprite(241, 313, "bubble").setScale(2);
        this.bubble.flipY = true;
        this.bubble.visible = false;

        this.text = this.add.text(227, 305, 'Jump(Z)', 
        {
            fontStyle: "bold", 
            color: "black"
        });
        this.text.setScale(.5);
        this.text.visible = false;

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(50, -100, "player");
        my.sprite.player.flipX = true;
        //my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.blockGroup);
        this.physics.world.TILE_BIAS = 30;

        this.physics.add.overlap(my.sprite.player, this.wormGroup, (obj1, obj2) => 
        { 
            obj2.destroy();
            this.sound.play("eatSound", { volume: 1 });
        });

        // Interactive Button
        this.physics.add.overlap(my.sprite.player, this.button, (obj1, obj2) => 
        {
            if (obj2.frame.name == 105) this.sound.play("buttonSound", { volume: .75 });
            obj2.setFrame(165);
            this.blockGroup.clear(true);                       // Blocks Disappear
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => 
        {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.rKey = this.input.keyboard.addKey('R');
        this.zKey = this.input.keyboard.addKey('Z');

        my.vfx.walking = this.add.particles(0, 0, "dust", 
        {
            //frame: ['smoke_03.png', 'smoke_09.png'],
            scale: {start: 1, end: 0.1},
            lifespan: 350,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.stop();

        //if (my.sprite.player.body.checkCollision.down) this.sound.play("groundHit", { volume: 1 });

        this.animatedTiles.init(this.map);

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
        this.cameras.main.startFollow(my.sprite.player, true, .2, .2); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 180);
        this.cameras.main.setZoom(this.SCALE+1.5);

        document.getElementById('description').innerHTML = '<h2>Level One: Need H20'
    }

    update() {
        if(cursors.left.isDown) 
        {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2+6, my.sprite.player.displayHeight/2-16, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();

        } 
        else if(cursors.right.isDown) 
        {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-30, my.sprite.player.displayHeight/2-16, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();
        } 
        else 
        {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle', true);
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) 
        {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop()
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.zKey)) 
        {
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

        if (this.collides(my.sprite.player, this.frog)) 
        {
            this.bubble.visible = true;
            this.text.visible = true;
        }
        else 
        {
            this.bubble.visible = false;
            this.text.visible = false;
        }

        if (my.sprite.player.body.y > 600) this.scene.restart(); // Player dies when fallen off map

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) 
        {
            this.scene.restart();
        }

        if (my.sprite.player.body.x >= 1386 && my.sprite.player.body.y == 378) 
        {
            this.scene.start("gameOverScene");
        }
    }

    // A center-radius AABB collision check
    collides(a, b) 
    {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
    }
}