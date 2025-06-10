class LevelOne extends Phaser.Scene 
{
    constructor() 
    {
        super("levelOneScene");
    }

    init() 
    {
        // Variables and Settings
        this.ACCELERATION = 150;
        this.DRAG = 350;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2000;
        this.PARTICLE_VELOCITY = 50;
        this.JUMP_VELOCITY = -750;
        this.SCALE = 1;
    }

    preload() 
    {
        // Load the animated tiles plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() 
    {
        this.physics.world.setBounds(0,0,1450, 400);

        this.sound.play("Background", { volume: .4, loop: true });

        this.map = this.add.tilemap("platformer-level-one", 18, 18, 80, 20);
        // Tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles");
        this.tileset3 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_background");

        // Creating Layers
        this.backgroundLayer = this.map.createLayer("Background", this.tileset2, 0, 0).setScrollFactor(0.75); // Special Background Scroll
        this.environLayer = this.map.createLayer("Front-Background", this.tileset3, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setCollisionByProperty({ Collides: true });

        // Collidable life collectables
        this.lifePoints = this.map.createFromObjects("Objects", 
        {
            name: "life",
            key: "tilemap_sheet",
            frame: 44
        });
        // Animation for Object layer
        this.heartAnim = this.anims.create(
        {
            key: 'lifeAnim', 
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                { frames: [44,46] }
            ),
            frameRate: 10, 
            repeat: -1     
        });
        this.anims.play('lifeAnim', this.lifePoints);
        this.physics.world.enable(this.lifePoints, Phaser.Physics.Arcade.STATIC_BODY);
        this.lifePointsGroup = this.add.group(this.lifePoints);

        // Button Animation and setup
        this.button = this.map.createFromObjects("Objects", 
        {
            name: "button",
            key: "tilemap_sheet",
            frame: 148,
        });
        this.physics.world.enable(this.button, Phaser.Physics.Arcade.STATIC_BODY);

        // Blocked path with blocks setup
        this.blocks = this.map.createFromObjects("Objects", 
        {
            name: "block",
            key: "tilemap_sheet",
            frame: 150
        });
        this.physics.world.enable(this.blocks, Phaser.Physics.Arcade.STATIC_BODY);
        this.blockGroup = this.add.group(this.blocks);

        // Interactible flag setup
        this.flag = this.map.createFromObjects("Objects", 
        {
            name: "flag",
            key: "tilemap_sheet",
            frame: 111,
        });
        this.flagAnim = this.anims.create(
        {
            key: 'flagAnim', // Animation key
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                { frames: [111,112] }
            ),
            frameRate: 7,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });
        this.anims.play('flagAnim', this.flag);
        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);

        // Player Input help in-game
        this.info = this.add.sprite(221, 205, "info").setScale(1.1);
        this.text = this.add.text(190, 190, 'Jump(Z)', 
        {
            fontStyle: "bold",
            color: "black"
        });

        // Enemy
        this.enemyY = this.add.sprite(220, 260, "enemyYellow").setScale(.5);
        this.enemyY.flipX = true;

        // Player Set Up
        my.sprite.player = this.physics.add.sprite(50, -100, "player");
        my.sprite.leftArm = this.add.sprite(my.sprite.player.x-25, my.sprite.player.y+7, "playerArms");
        my.sprite.sword = this.add.sprite(my.sprite.player.x+25, my.sprite.player.y-7, "playerSword");
        my.sprite.rightArm = this.add.sprite(my.sprite.player.x+25, my.sprite.player.y+7, "playerArms");
        this.bigAttack = 1;
        this.attackMode = false;
        my.sprite.player.setCollideWorldBounds(true);

        // Life UI Setup
        this.heart1 = this.add.sprite(20, 10, "heart");
        this.heart2 = this.add.sprite(40, 10, "heart");
        this.heart3 = this.add.sprite(60, 10, "heart");
        this.hp = 3;


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.blockGroup);
        this.physics.world.TILE_BIAS = 20;
        this.enemyCollisionCooldown = 0;
        // Interactive Collectibles
        this.physics.add.overlap(my.sprite.player, this.lifePointsGroup, (obj1, obj2) => 
        { 
            obj2.destroy();
            if (this.hp == 1) { this.heart2.visible = true; this.hp++ }
            else if (this.hp == 2) { this.heart3.visible = true; this.hp++ }
            this.sound.play("healthUp", { volume: 1 });
        });
        // Interactive Button
        this.physics.add.overlap(my.sprite.player, this.button, (obj1, obj2) => 
        {
            if (obj2.frame.name == 148) this.sound.play("buttonSound", { volume: .75 });
            obj2.setFrame(149);
            this.blockGroup.clear(true);  // Blocks Disappear
        });
        // Collidable Flag to pass level
        this.physics.add.overlap(my.sprite.player, this.flag, (obj1, obj2) => 
        {
            this.sound.stopAll();
            this.scene.start("levelTwoScene");
        });

        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => 
        {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Player Input Set Up
        this.rKey = this.input.keyboard.addKey('R');
        this.zKey = this.input.keyboard.addKey('Z');

        // Player Walking VFX Effect
        my.vfx.walking = this.add.particles(0, 0, "dust", 
        {
            scale: {start: 1, end: 0.1},
            lifespan: 250,
            gravityY: -300,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.stop();

        this.animatedTiles.init(this.map);

        // Camera
        this.cameras.main.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
        this.cameras.main.startFollow(my.sprite.player, true, .2, .2); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 180);
        this.cameras.main.setZoom(this.SCALE+1.5);

        document.getElementById('description').innerHTML = '<h2>Level One: Training Camp'
    }

    update() 
    {
        this.enemyCollisionCooldown--;

        this.updatePlayerParts();

        this.updateUI();

        if (this.collides(this.enemyY, my.sprite.sword) && this.attackMode == true) 
        {
            this.enemyY.x = -250;
            this.enemyY.y = -250;
            this.enemyY.visible = false;
            this.enemyY.active = false;
        }
        else if (this.collides(this.enemyY, my.sprite.sword) && this.attackMode == false && this.enemyCollisionCooldown <= 0) 
        {
            this.hp--;
            my.sprite.player.body.setVelocityX(-350);
            my.sprite.player.body.setVelocity(-350);
            this.enemyCollisionCooldown = 100;
            this.sound.play("playerDamage", { volume: 1 });
            this.updateUI();
        } 

        if(cursors.left.isDown) 
        {
            my.sprite.player.body.setVelocityX(-this.ACCELERATION);
            my.sprite.player.flipX = true;
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-16, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();

        } 
        else if(cursors.right.isDown) 
        {
            my.sprite.player.body.setVelocityX(this.ACCELERATION);
            my.sprite.player.flipX = false;
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-60, my.sprite.player.displayHeight/2-16, false);
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
        if(!my.sprite.player.body.blocked.down) my.vfx.walking.stop();
        if (my.sprite.player.body.blocked.down) this.attackMode = false;
        if(Phaser.Input.Keyboard.JustDown(this.zKey) && this.bigAttack > 0) 
        {
            this.bigAttack = 0;
            this.attackMode = true;
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound", { volume: .25 });

            my.sprite.leftArm.x = my.sprite.player.x;
            my.sprite.leftArm.y = my.sprite.player.y + 17;

            my.sprite.rightArm.x = my.sprite.player.x;
            my.sprite.rightArm.y = my.sprite.player.y + 17;

            my.sprite.sword.x = my.sprite.rightArm.x;
            my.sprite.sword.y = my.sprite.rightArm.y + 15;
            my.sprite.sword.angle = 180;
        }
        else if (this.bigAttack <= 0 && my.sprite.player.body.blocked.down) this.bigAttack = 1;

        // Restart Input
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) 
        {
            this.scene.start("TitleScene");
            this.sound.stopAll();
        }
    }

    // A center-radius AABB collision check
    collides(a, b) 
    {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
    }

    updatePlayerParts() 
    {
        if (this.attackMode)
        { 
            my.sprite.leftArm.x = my.sprite.player.x;
            my.sprite.leftArm.y = my.sprite.player.y + 17;

            my.sprite.rightArm.x = my.sprite.player.x;
            my.sprite.rightArm.y = my.sprite.player.y + 17;

            my.sprite.sword.x = my.sprite.rightArm.x;
            my.sprite.sword.y = my.sprite.rightArm.y + 15;
            my.sprite.sword.angle = 180;
            this.jumpActive = false;
        }
        else 
        {
            my.sprite.rightArm.x = my.sprite.player.x + 35;
            my.sprite.rightArm.y = my.sprite.player.y + 7;

            my.sprite.leftArm.x = my.sprite.player.x - 35;
            my.sprite.leftArm.y = my.sprite.player.y + 7;

            my.sprite.sword.x = my.sprite.rightArm.x;
            my.sprite.sword.y = my.sprite.rightArm.y - 18;
            my.sprite.sword.angle = 0;
        }
    }

    updateUI() 
    {
        this.heart1.x = my.sprite.player.x - 20;
        this.heart1.y = my.sprite.player.y - 55;

        this.heart2.x = my.sprite.player.x;
        this.heart2.y = my.sprite.player.y - 65;

        this.heart3.x = my.sprite.player.x + 20;
        this.heart3.y = my.sprite.player.y - 55;

        if (this.hp == 2) this.heart3.visible = false;
        if (this.hp == 1) this.heart2.visible = false;
        if (this.hp == 0) 
        {
            this.sound.stopAll();
            this.scene.start("gameOverScene");
        }
    }
}