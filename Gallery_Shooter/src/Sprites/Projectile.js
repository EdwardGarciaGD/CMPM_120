class Projectile extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y, texture, frame) 
    {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.counter = 0;
        this.switch = false;
        return this;
    }

    update() 
    {
        if (this.active && this.enemy) 
        {
            this.y += this.speed;
            if (this.y > game.config.height) this.makeInactive();
        }
        else if (this.active) 
        {
            this.y -= this.speed;

            if (!this.switch) 
            {
                this.x += 3;
                this.counter += 1;
            }
            else
            {
                this.x -= 3;
                this.counter -= 1;
            }

            if (this.counter == 10) 
            {
                this.switch = true;
            }
            else if (this.counter == 0)
            {
                this.switch = false;
            }

            if (this.y < -(this.displayHeight/2)) this.makeInactive();
        }
    }

    makeActive() 
    {
        this.visible = true;
        this.active = true;
    }

    makeInactive() 
    {
        this.visible = false;
        this.active = false;
    }

    hit(enemy) 
    {
        if (this.collides(enemy, this)) return true;
        return false;
    }

    // A center-radius AABB collision check
    collides(a, b) 
    {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
    }

}