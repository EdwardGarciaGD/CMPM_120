class LevelTwo extends Phaser.Scene 
{
    constructor() 
    {
        super("levelTwoScene");
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
        this.physics.world.setBounds(0,0,1250, 400);

        this.sound.play("Background2", { volume: .2, loop: true });

        this.map = this.add.tilemap("platformer-level-two", 18, 18, 80, 20);
        // Connect Tilesets to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset4 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles");
        this.tileset6 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles");
        this.tileset5 = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_background");

        // Layer creations
        this.backgroundLayer = this.map.createLayer("Backgroundlv2", this.tileset5, 0, 0).setScrollFactor(0.75); // Special Background Scroll
        this.environLayer = this.map.createLayer("Front-Background", this.tileset6, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset4, 0, 0);
        // Make it collidable
        this.groundLayer.setCollisionByProperty({ Collides: true });

        // Collidable life collectables
        this.lifePoints = this.map.createFromObjects("Objects", 
        {
            name: "life",
            key: "tilemap_sheet",
            frame: 44
        });
        // Create animation for Object layer
        this.heartAnim = this.anims.create(
        {
            key: 'lifeAnim', // Animation key
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                { frames: [44,46] }
            ),
            frameRate: 10,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });
        // Play the same animation for every member of the Object array
        this.anims.play('lifeAnim', this.lifePoints);
        this.physics.world.enable(this.lifePoints, Phaser.Physics.Arcade.STATIC_BODY);
        this.lifePointsGroup = this.add.group(this.lifePoints);

        // Flag Setup and Anim
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

        // Enemies
        this.enemies = [];
        this.enemies[0] = this.physics.add.sprite(300, 290, "enemySoldier").setScale(.5);
        this.enemies[0].flipX = true;
        this.enemies[1] = this.physics.add.sprite(420, 290, "enemySoldier").setScale(.5);
        this.enemies[1].flipX = true;
        this.enemies[2] = this.physics.add.sprite(620, 290, "enemySoldier").setScale(.5);
        this.enemies[2].flipX = true;
        this.enemies[3] = this.physics.add.sprite(820, 290, "enemySoldier").setScale(.5);
        this.enemies[3].flipX = true;
        this.enemies[4] = this.physics.add.sprite(1020, 290, "enemyArcher").setScale(.45);
        this.enemies[4].flipX = true;
        this.enemies[5] = this.physics.add.sprite(1200, 290, "enemyArcher").setScale(.45);
        this.enemies[5].flipX = true;
        this.enemyMovementCooldown = 80;
        this.enemyXSwitch = false;
        this.arrow = this.add.sprite(1000, 295, "arrow").setScale(.4);
        this.arrow.flipX = true;
        this.arrow2 = this.add.sprite(1175, 295, "arrow").setScale(.4);
        this.arrow2.flipX = true;
        this.enemiesLeft = 6;

        // Player Set Up
        my.sprite.player = this.physics.add.sprite(50, -100, "player").setScale(.8);
        my.sprite.leftArm = this.add.sprite(my.sprite.player.x-20, my.sprite.player.y+7, "playerArms").setScale(.8);
        my.sprite.sword = this.add.sprite(my.sprite.player.x+20, my.sprite.player.y-7, "playerSword").setScale(.8);
        my.sprite.rightArm = this.add.sprite(my.sprite.player.x+20, my.sprite.player.y+7, "playerArms").setScale(.8);
        this.bigAttack = 1;
        this.attackMode = false;
        my.sprite.player.setCollideWorldBounds(true);

        // PowerUp Item
        this.powerup = this.add.sprite(220, 310, "powerup").setScale(.45);
        this.text = this.add.text(20, 70, 'Double Jump Activated', 
        {
            fontStyle: "bold",
            color: "black"
        });
        this.text.visible = false;
        this.powerupActive = false;
        my.vfx.victory = this.add.particles(my.sprite.sword.x, my.sprite.sword.y, "flame", 
        {
            scale: {start: 2, end: 0.1},
            lifespan: 1500,
            speed: { min: 150, max: 250 },
            gravityY: 200,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.victory.stop();

        // Life UI Setup
        this.heart1 = this.add.sprite(20, 10, "heart");
        this.heart2 = this.add.sprite(40, 10, "heart");
        this.heart3 = this.add.sprite(60, 10, "heart");
        this.hp = 3;


        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(this.enemies, this.groundLayer);
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

        // set up Phaser-provided cursor key input
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
            scale: {start: .9, end: 0.1},
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

        document.getElementById('description').innerHTML = '<h2>Level Two: Onward!'
    }

    update() 
    {
        this.enemyCollisionCooldown--;

        // Enemy Movement
        if (this.enemyMovementCooldown < 0) 
        {
            this.enemyMovementCooldown = 80;
            this.enemyXSwitch = !this.enemyXSwitch;
            this.enemies[0].flipX = !this.enemies[0].flipX;
            this.enemies[1].flipX = !this.enemies[1].flipX;
            this.enemies[2].flipX = !this.enemies[2].flipX;
            this.enemies[3].flipX = !this.enemies[3].flipX;
        }
        this.updateEnemyMovement();

        // Enemy Arrows Movement and Collision
        this.arrow.x -= 4;
        if (this.arrow.x < -100) this.arrow.x = 1000;
        if ((this.collides(this.arrow2, my.sprite.player) || this.collides(this.arrow, my.sprite.player)) && this.attackMode == false && this.enemyCollisionCooldown <= 0) 
        {
            if (this.collides(this.arrow2, my.sprite.player)) this.arrow2.x = -50;
            else { this.arrow.x = -50; }
            this.hp--;
            my.sprite.player.body.setVelocityX(-350);
            my.sprite.player.body.setVelocity(-650);
            this.enemyCollisionCooldown = 80;
            this.sound.play("playerDamage", { volume: 1 });
            this.updateUI();
        }
        this.arrow2.x -= 6;
        if (this.arrow2.x < -100) this.arrow2.x = 1175;

        my.vfx.victory.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-90, my.sprite.player.displayHeight/2+90, false);

        this.updatePlayerParts();

        this.updateUI();

        // Powerup Activation
        if (this.collides(this.powerup, my.sprite.player) && !this.powerupActive) 
        {
            this.text.visible = true;
            this.powerupActive = true;
            my.sprite.hat = this.add.sprite(my.sprite.player.x, my.sprite.player.y-30, "powerup").setScale(.45);
            this.powerup.x = -200;
            this.powerup.y = -200;
            this.powerup.visible = false;
            this.powerup.active = false;
            this.bigAttack = 2;
        }

        // Player Enemy Collision Handler
        for (let i=0; i < this.enemies.length; i++) 
        {
            if (this.collides(this.enemies[i], my.sprite.sword) && this.attackMode) 
            {
                this.enemies[i].x = -250;
                this.enemies[i].y = -250;
                this.enemies[i].visible = false;
                this.enemies[i].active = false;
                this.enemiesLeft--;
                if (i == 4) 
                {
                    this.arrow.x = -99;
                    this.arrow.y = -100;
                    this.arrow.visible = false;
                    this.arrow.active = false;
                }
                if (i == 5) 
                {
                    this.arrow2.x = -99;
                    this.arrow2.y = -100;
                    this.arrow2.visible = false;
                    this.arrow2.active = false;
                }
            }
            else if (this.collides(this.enemies[i], my.sprite.sword) && !this.attackMode && this.enemyCollisionCooldown <= 0) 
            {
                this.hp--;
                my.sprite.player.body.setVelocityX(-350);
                my.sprite.player.body.setVelocity(-650);
                this.enemyCollisionCooldown = 80;
                this.sound.play("playerDamage", { volume: 1 });
                this.updateUI();
            }
        }

        // Player Movement
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
            this.bigAttack--;
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
        else if (this.bigAttack == 1 && my.sprite.player.body.blocked.down && this.powerupActive) this.bigAttack = 2;
        else if (this.bigAttack <= 0 && my.sprite.player.body.blocked.down && this.powerupActive) 
        {
            this.bigAttack = 2; 
            this.text.visible = false;
            my.vfx.victory.explode(20);
            this.sound.play("explosion", { volume: .3 });
        }
        else if (this.bigAttack <= 0 && my.sprite.player.body.blocked.down) this.bigAttack = 1;

        // Restart Game Input
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) 
        {
            this.scene.start("TitleScene");
            this.sound.stopAll();
        }

        // Game Over Win Handler
        if (this.enemiesLeft == 0 && my.sprite.player.x > 1200) 
        {
            this.scene.start("gameOverWinScene");
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
            my.sprite.rightArm.x = my.sprite.player.x + 25;
            my.sprite.rightArm.y = my.sprite.player.y + 7;

            my.sprite.leftArm.x = my.sprite.player.x - 25;
            my.sprite.leftArm.y = my.sprite.player.y + 7;

            my.sprite.sword.x = my.sprite.rightArm.x;
            my.sprite.sword.y = my.sprite.rightArm.y - 18;
            my.sprite.sword.angle = 0;
        }

        if (this.powerupActive) 
        {
            my.sprite.hat.x = my.sprite.player.x;
            my.sprite.hat.y = my.sprite.player.y - 25;
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
            this.scene.start("gameOverScene");
            this.sound.stopAll();
        }
    }

    updateEnemyMovement() 
    {
        if (!this.enemyXSwitch) 
        {
            this.enemies[0].setVelocityX(-70);
            this.enemies[1].setVelocityX(-30);
            this.enemies[2].setVelocityX(-60);
            this.enemies[3].setVelocityX(-45);
        }
        else 
        {
            this.enemies[0].setVelocityX(70);
            this.enemies[1].setVelocityX(30);
            this.enemies[2].setVelocityX(60);
            this.enemies[3].setVelocityX(45);
        }
        this.enemyMovementCooldown--;
    }
}