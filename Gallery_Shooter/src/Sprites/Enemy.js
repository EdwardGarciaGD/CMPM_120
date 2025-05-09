class Enemy extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, texture, frame, path, scale) {
        super(scene, x, y, texture, frame);

        this.curve = new Phaser.Curves.Spline(path);
        this.enemy = scene.add.follower(this.curve, this.curve.points[0].x,  this.curve.points[0].y, texture);
        this.enemy.startFollow({ 
            from: 0,
            to: 1,
            delay: 30,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: false,
            rotationOffset: 0,
        }); 
        this.enemy.setScale(scale);

        scene.add.existing(this.enemy);
        return this;
    }

}