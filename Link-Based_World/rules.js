class Items extends Scene
{
    water = false;
    watermelon = false;
    key = false;
}

var Invntry = new Items;

class Start extends Scene {
    create() 
    {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin Your Final Journey");
    }

    handleChoice() 
    {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene 
{
    create(key) 
    {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if(locationData.Choices)
        { 
            for (let choice of locationData.Choices) 
            {
                if (key == "Pouch Filled") Invntry.water = true;
                if (key == "Beast Interaction") Invntry.key = true;
                if (key == "Watermelon Room") Invntry.watermelon = true;
                if (choice.Text == "Fill Pouch With Water" && Invntry.water == true) continue;
                else if (choice.Text == "Enter Side Door" && Invntry.key == true) continue;
                else if (choice.Text == "Walk And Enter Door One" && Invntry.watermelon == true) continue;
                else if (choice.Text == "Use Key" && Invntry.key == false) continue;
                else if (choice.Text == "Give Water" && Invntry.water == false) continue;
                else if (choice.Text == "Eat Watermelon" && Invntry.watermelon == false) continue;
                else 
                {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } 
        else 
        {
            this.engine.addChoice("End");
        }
    }

    handleChoice(choice) 
    {
        if(choice) 
        {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } 
        else 
        {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene 
{
    create() 
    {
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');