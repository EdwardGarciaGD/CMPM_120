class Load extends Phaser.Scene 
{
    constructor() 
    {
        super("loadScene");
    }

    preload() 
    {
        this.load.setPath("./assets/");

        this.load.image("player", "Sprites/character_roundPurple.png");
        this.load.image("playerArms", "Sprites/character_handPurple.png");
        this.load.image("playerSword", "Sprites/item_sword.png");
        this.load.image("ghost", "Sprites/ghost.png");

        this.load.image("enemyYellow", "Sprites/character_squareYellow.png");
        this.load.image("enemySoldier", "Sprites/enemySoldier.png");
        this.load.image("enemyArcher", "Sprites/enemyArcher.png");
        this.load.image("arrow", "Sprites/item_arrow.png");
        this.load.image("info", "Sprites/tile_arrowDown.png");
        this.load.image("dust", "Sprites/dust.png");
        this.load.image("heart", "Sprites/Heart.png");
        this.load.image("spark", "Sprites/spark.png");
        this.load.image("powerup", "Sprites/item_tophat.png");
        this.load.image("flame", "Sprites/fire.png");

        // Load tilemap information
        this.load.image("tilemap_tiles", "Spritesheets/tilemap2_packed.png");                         // Packed tilemap
        this.load.image("tilemap_tiles2", "Spritesheets/tilemap_packed.png");
        this.load.image("tilemap_background", "Spritesheets/tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("platformer-Title", "Tiled/platformer-Title.tmj");                 // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level-one", "Tiled/platformer-level-one.tmj");
        this.load.tilemapTiledJSON("platformer-level-two", "Tiled/platformer-level-two.tmj");
        this.load.tilemapTiledJSON("platformer-GameOver-Lose", "Tiled/platformer-GameOver-Lose.tmj");
        this.load.tilemapTiledJSON("platformer-GameOver-Win", "Tiled/platformer-GameOver-Win.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "Spritesheets/tilemap2_packed.png", 
        {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.audio("jumpSound", "Sounds/swordSlice.ogg");
        this.load.audio("playerDamage", "Sounds/damage.ogg");
        this.load.audio("eatSound", "Sounds/switch_007.ogg");
        this.load.audio("buttonSound", "Sounds/select_004.ogg");
        this.load.audio("healthUp", "Sounds/hp.ogg");
        this.load.audio("explosion", "Sounds/explosion.ogg");
        this.load.audio("win", "Sounds/level-win.mp3");
        this.load.audio("lose", "Sounds/GameOverLose.mp3");
        this.load.audio("Background", "Sounds/RPG Background.mp3");
        this.load.audio("Background2", "Sounds/RPG Background 2.mp3");
    }

    create() 
    {
        this.anims.create(
        {
            key: 'walk',
            frames: 
            [
                { key: "player" },
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

         // Pass to the next Scene
         this.scene.start("TitleScene");
    }

    update() 
    {
    }
}