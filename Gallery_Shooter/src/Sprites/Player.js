class Player extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, texture, frame, leftKey, rightKey, speed) {
        super(scene, x, y, texture, frame);

        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = speed;
        this.displayBorder = 20;

        scene.add.existing(this);
        return this;
    }

    update() 
    {
        if (this.left.isDown) 
            {
                if (this.x > this.displayBorder) this.x -= this.playerSpeed;
            }
        if (this.right.isDown) 
            {
                if (this.x < game.config.width-this.displayBorder) this.x += this.playerSpeed;
            }
    }

}