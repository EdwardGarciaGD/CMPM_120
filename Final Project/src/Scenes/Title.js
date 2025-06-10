class Title extends Phaser.Scene 
{
    constructor() 
    {
        super("TitleScene");
    }

    preload() 
    {
        // Load the animated tiles plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() 
    {
        this.map = this.add.tilemap("platformer-Title", 18, 18, 60, 40);
        // Tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_background");

        // Create Layers
        this.backgroundLayer = this.map.createLayer("Background", this.tileset2, 0, 0);
        this.environmentLayer = this.map.createLayer("Background2", this.tileset, 0, 0);

        this.text = this.add.text(280, 100, 'Press S To Start', 
        {
            fontStyle: "bold",
            color: "black"
        });
        this.text.setScale(3);

        // Player Input Setup
        this.sKey = this.input.keyboard.addKey('S');
    }

    update() 
    {
        if (Phaser.Input.Keyboard.JustDown(this.sKey)) this.scene.start("levelOneScene");
    }
}