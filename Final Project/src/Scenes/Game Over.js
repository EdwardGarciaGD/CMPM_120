class GameOver extends Phaser.Scene 
{
    constructor() 
    {
        super("gameOverScene");
    }

    create() 
    {
        this.map = this.add.tilemap("platformer-GameOver-Lose", 21, 21, 60, 34);

        this.tileset = this.map.addTilesetImage("water_tilemap_packed", "tilemap_tiles2");

        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0);

        my.sprite.player = this.add.sprite(500, 500, "ghost").setScale(6);
        my.sprite.sword = this.add.sprite(500, 600, "playerSword").setScale(3);
        my.sprite.sword.angle = 90;
        this.tweens.add(
        {
            targets: my.sprite.player,
            y: 100,
            duration: 8200,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });

        this.rKey = this.input.keyboard.addKey('R');

        this.sound.play("lose", { volume: .5 });

        this.text = this.add.text(0, 0, 'Created by Edward Garcia', 
        {
            fontStyle: "bold",
            color: "black"
        });
        this.text.setScale(2);

        document.getElementById('description').innerHTML = '<h2>Game Over (Press R to restart)'
    }

    update() 
    {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) this.scene.start("TitleScene");
    }
}