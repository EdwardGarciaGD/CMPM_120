class GameOverWin extends Phaser.Scene 
{
    constructor() 
    {
        super("gameOverWinScene");
    }
    
    init() 
    {
        this.physics.world.gravity.y = 2000;
    }

    create() 
    {
        this.map = this.add.tilemap("platformer-GameOver-Win", 21, 21, 60, 40);

        this.tileset = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_background");

        // Create Layers
        this.backgroundLayer = this.map.createLayer("Background", this.tileset2, 0, 0);
        this.environmentLayer = this.map.createLayer("Background2", this.tileset, 0, 0);

        my.vfx.victory = this.add.particles(480, 85, "spark", 
        {
            scale: {start: 2, end: 0.1},
            lifespan: 1500,
            speed: { min: 150, max: 250 },
            gravityY: 200,
            alpha: {start: 1, end: 0.1}
        });

        my.sprite.player = this.add.sprite(480, 340, "player").setScale(3);
        my.sprite.leftArm = this.add.sprite(my.sprite.player.x-15, my.sprite.player.y-100, "playerArms").setScale(3);
        my.sprite.sword = this.add.sprite(my.sprite.player.x, my.sprite.player.y-170, "playerSword").setScale(3);
        my.sprite.rightArm = this.add.sprite(my.sprite.player.x+20, my.sprite.player.y-100, "playerArms").setScale(3);

        this.rKey = this.input.keyboard.addKey('R');

        this.sound.play("win", { volume: .5 });

        this.text = this.add.text(0, 0, 'Created by Edward Garcia', 
        {
            fontStyle: "bold",
            color: "black"
        });
        this.text.setScale(2);

        document.getElementById('description').innerHTML = '<h2>Game Over You Win! (Press R to restart)'
    }

    update() 
    {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) this.scene.start("TitleScene");
    }
}