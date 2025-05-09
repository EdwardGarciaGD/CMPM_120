let myScore = 0;

class LevelOne extends Phaser.Scene 
{
    curve;

    constructor() 
    {
        super("SceneLevelOne");
        this.my = {sprite: {}, text: {}};

        this.playerSpeed = 10;
        this.projectileSpeed = 8;

        this.projectileCooldown = 5;
        this.projCooldownCounter = 0;

        this.teardropCooldown = 3;
        this.tearCooldownCounter = 0;
    }

    preload() 
    {
        this.load.setPath("./assets/");
        this.load.image("Player", "player_4.png");
        this.load.image("Ghost", "ghost_2.png");
        this.load.image("heart", "Heart.png");
        this.load.image("tears", "Teardrop.png");
        this.load.image("life", "Empty_Heart.png");
        this.load.image("lifeFill", "Heart_Fill.png");

        this.load.audio("hit", "laserLarge_002.ogg");
        this.load.audio("damage", "Player_Hit.ogg");

        //this.load.image("backround", "tilemap_packed.png");
        //this.load.tilemapTiledJSON("map", "backround.tmj");

        this.load.bitmapFont("Lucida", "Lucida_0.png", "Lucida.fnt");
    }

    create() 
    {
        let my = this.my;
        myScore = 0;

        this.myHealth = 0;

        this.points = [];
        this.points[0] =
        [
            30, 200,
            50, 200,
            100, 200,
            200, 200,
            300, 200,
            400, 200
        ];
        this.points[1] = 
        [
            619, 129,
            532, 217,
            346, 202,
            280, 135
        ];
        this.points[2] = 
        [
            180, 135,
            276, 180,
            396, 180,
            520, 180,
            640, 135
        ];

        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        //this.map = this.add.tilemap("map", 50, 39 , 16, 16);
        //this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "backround");
        //this.backround = this.map.createLayer("Backround", this.tileset, 0, 0);

        my.sprite.healthFill = this.add.sprite(50, 50, "lifeFill");
        my.sprite.healthFill.setScale(0);
        my.sprite.health = this.add.sprite(50, 50, "life");
        my.sprite.health.setScale(4.6);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 80, "Player", null, this.leftKey, this.rightKey, this.playerSpeed);
        my.sprite.player.setScale(3);
        my.sprite.player.scorePoints = 10;

        my.sprite.ghost1 = new Enemy(this, this.points[0], this.points[0], "Ghost", null, this.points[0], 2);
        my.sprite.ghost2 = new Enemy(this, this.points[1], this.points[1], "Ghost", null, this.points[1], 2);
        my.sprite.ghost3 = new Enemy(this, this.points[2], this.points[2], "Ghost", null, this.points[2], 2);  

        this.makeEnemyProjectiles(my.sprite.ghost1);
        this.makeEnemyProjectiles(my.sprite.ghost2);
        this.makeEnemyProjectiles(my.sprite.ghost3);

        my.sprite.HeartGroup = this.add.group(
            {
            active: true,
            defaultKey: "heart",
            maxSize: 7,
            runChildUpdate: true
            }
        );
        my.sprite.HeartGroup.createMultiple(
            {
            classType: Projectile,
            active: false,
            key: my.sprite.HeartGroup.defaultKey,
            repeat: my.sprite.HeartGroup.maxSize-1
            }
        );
        my.sprite.HeartGroup.propertyValueSet("speed", this.projectileSpeed);

        my.text.score = this.add.bitmapText(605, 0, "Lucida", "Love: " + myScore + "%");

        document.getElementById('description').innerHTML = '<h2>Level One</h2>Left Arrow: Move left // Right Arrow: Move right // Z: Give love'

    }

    update() 
    {
        let my = this.my;
        this.projCooldownCounter--;
        this.tearCooldownCounter--;

        my.sprite.player.update();

        this.zKey.on('down', (key, event) => 
            {
                if (this.projCooldownCounter < 0) 
                {
                    let heart = my.sprite.HeartGroup.getFirstDead();
                    if (heart != null) 
                    {
                        this.projCooldownCounter = this.projectileCooldown;
                        heart.makeActive();
                        heart.x = my.sprite.player.x;
                        heart.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                    }
                }
            }
        );

        this.activateEnemyProj(my.sprite.ghost1);
        this.activateEnemyProj(my.sprite.ghost2);
        this.activateEnemyProj(my.sprite.ghost3);

        for (let heart of my.sprite.HeartGroup.children.entries) 
        {
            if (heart.hit(my.sprite.ghost1.enemy)) 
            {
                this.setCollisionResults(my.sprite.ghost1.enemy, heart);
            }
            else if (heart.hit(my.sprite.ghost2.enemy)) 
            {
                this.setCollisionResults(my.sprite.ghost2.enemy, heart);
            }
            else if (heart.hit(my.sprite.ghost3.enemy)) 
            {
                this.setCollisionResults(my.sprite.ghost3.enemy, heart);
            }
        }

        for (let teardrop of my.sprite.ghost1.TearsGroup.children.entries) 
        {
            if (teardrop.hit(my.sprite.player)) 
            {
                this.setTeardropCollision(my.sprite.player, teardrop);
            }
        }
        for (let teardrop of my.sprite.ghost2.TearsGroup.children.entries) 
        {
            if (teardrop.hit(my.sprite.player)) 
            {
                this.setTeardropCollision(my.sprite.player, teardrop);
            }
        }
        for (let teardrop of my.sprite.ghost3.TearsGroup.children.entries) 
        {
            if (teardrop.hit(my.sprite.player)) 
            {
            this.setTeardropCollision(my.sprite.player, teardrop);
            }
        }

        if (this.myHealth >= 100) 
        {
            my.sprite.player.x = -250;
            my.sprite.player.y = -250;
            my.sprite.player.visible = false;
            my.sprite.player.active = false;
            this.scene.start("SceneGameOver");
        }

        if (myScore >= 30) this.scene.start("SceneLevelTwo");
    }

    updateScore() 
    {
        let my = this.my;
        my.text.score.setText("Love: " + myScore + "%");
    }

    makeEnemyProjectiles(enemy) 
    {
        enemy.TearsGroup = this.add.group(
            {
            active: true,
            defaultKey: "tears",
            maxSize: 3,
            runChildUpdate: true
            }
        );
        enemy.TearsGroup.createMultiple(
            {
            classType: Projectile,
            active: false,
            key: enemy.TearsGroup.defaultKey,
            repeat: enemy.TearsGroup.maxSize-1
            }
        );
        enemy.TearsGroup.propertyValueSet("speed", this.projectileSpeed);
        enemy.TearsGroup.propertyValueSet("enemy", true);
    }

    activateEnemyProj(ghost) 
    {
        if (this.tearCooldownCounter < 0 && ghost.enemy.visible == true) 
            {
                let tear = ghost.TearsGroup.getFirstDead();
                if (tear != null) 
                {
                    tear.setScale(2.5);
                    this.tearCooldownCounter = this.teardropCooldown;
                    tear.makeActive();
                    tear.x = ghost.enemy.pathVector.x + 20;
                    tear.y = ghost.enemy.pathVector.y + 14; 
                }
            }
    }

    setCollisionResults(enemy, heart) 
    {
        heart.y = -100;
        enemy.stopFollow();
        enemy.x = -250;
        enemy.y = -250;
        enemy.visible = false;
        this.sound.play("hit", 
            {
                volume: 1,
            }
        );
        myScore += this.my.sprite.player.scorePoints;
        this.updateScore();
        heart.makeInactive();
        enemy.active = false;
    }

    setTeardropCollision(player, tear) 
    {
        tear.y = -100;
        this.myHealth += 10;
        tear.makeInactive();
        this.my.sprite.healthFill.setScale(this.myHealth/10 * .5);
        this.sound.play("damage", 
            {
                volume: 1,
            }
        );
    }
}