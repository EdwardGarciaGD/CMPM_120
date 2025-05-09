class GameOver extends Phaser.Scene 
{
    constructor() 
    {
        super("SceneGameOver");
        this.my = {sprite: {}, text: {}};

        this.teardropCooldown = 3;
        this.tearCooldownCounter = 0;
        this.tearCooldownCounter2 = 0;
        this.projectileSpeed = 8;
    }

    preload() 
    {
        this.load.setPath("./assets/");
        this.load.image("DeadGhost", "Game_Over_Ghost.png");
        this.load.image("tears", "Teardrop.png");

        this.load.bitmapFont("Lucida", "Lucida_0.png", "Lucida.fnt");
    }

    create() 
    {
        let my = this.my;

        this.nextScene = this.input.keyboard.addKey("R");

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 200, "DeadGhost");
        my.sprite.player1 = this.add.sprite(game.config.width/2, game.config.height - 200, "DeadGhost");
        my.sprite.player.setScale(3);
        my.sprite.player1.setScale(3);
        this.makeEnemyProjectiles(my.sprite.player);
        this.makeEnemyProjectiles(my.sprite.player1);

        my.text.GameOver = this.add.bitmapText(320, 100, "Lucida", "GAME OVER");
        my.text.Restart = this.add.bitmapText(250, 300, "Lucida", "Press R To Restart");

        document.getElementById('description').innerHTML = '<h2>Game Over</h2>R: Restart'

    }

    update() 
    {
        let my = this.my;

        this.tearCooldownCounter--;
        this.tearCooldownCounter2--;

        this.activateEnemyProj(my.sprite.player);
        if (this.tearCooldownCounter2 < 0) 
        {
            let tear2 = my.sprite.player1.TearsGroup.getFirstDead();
            if (tear2 != null) 
            {
                tear2.setScale(2.5);
                this.tearCooldownCounter2 = this.teardropCooldown + 3;
                tear2.makeActive();
                tear2.x = my.sprite.player.x + 28;
                tear2.y = my.sprite.player.y + 14; 
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) 
        {
            this.scene.start("SceneLevelOne");
        }
    }

    makeEnemyProjectiles(enemy) 
    {
        enemy.TearsGroup = this.add.group(
            {
            active: true,
            defaultKey: "tears",
            maxSize: 5,
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
        if (this.tearCooldownCounter < 0) 
            {
                let tear = ghost.TearsGroup.getFirstDead();
                if (tear != null) 
                {
                    tear.setScale(2.5);
                    this.tearCooldownCounter = this.teardropCooldown + .5;
                    tear.makeActive();
                    tear.x = ghost.x + 12;
                    tear.y = ghost.y + 14; 
                }
            }
    }
}