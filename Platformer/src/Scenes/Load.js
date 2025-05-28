class Load extends Phaser.Scene 
{
    constructor() 
    {
        super("loadScene");
    }

    preload() 
    {
        this.load.setPath("./assets/");

        this.load.image("player", "tile_0350.png");
        this.load.image("player2", "tile_0351.png");

        this.load.image("frog", "tile_0418.png");
        this.load.image("bubble", "tile_0258.png");
        this.load.image("dust", "tile_0047.png");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("tilemap_background", "tilemap-backgrounds_packed.png");  
        this.load.tilemapTiledJSON("platformer-level-one", "platformer-level-one.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level-two", "platformer-level-two.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", 
        {
            frameWidth: 21,
            frameHeight: 21
        });

        this.load.audio("jumpSound", "drop_004.ogg");
        this.load.audio("eatSound", "switch_007.ogg");
        this.load.audio("buttonSound", "select_004.ogg");
        this.load.audio("win", "level-win.mp3");
    }

    create() 
    {
        this.anims.create(
        {
            key: 'walk',
            frames: 
            [
                { key: "player" },
                { key: "player2" }
            ],
            frameRate: 20,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'idle',
            frames: 
            [
                { key: "player" },
                { key: "player2" }
            ],
            frameRate: 1.5,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'jump',
            frames: 
            [
                { key: "player" }
            ],
            repeat: -1
        });

         // ...and pass to the next Scene
         //this.scene.start("gameOverScene");
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() 
    {
    }
}