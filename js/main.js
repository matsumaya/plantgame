var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var seedling;
var baddie;
var platforms;
var cursors;
var stars;
var sky;

var score = 0;
var scoreText;
var dandelion;

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('seedling', 'assets/seedling.png', 54, 96, 9);
  game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32, 4);
  game.load.atlasJSONArray('dandelion', 'assets/DandelionEnemyClone.png',
  'assets/DandelionEnemyClone.json')
}

function create() {

    game.world.setBounds(0, 0, 2000, 600);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    sky = game.add.sprite(0, 0, 'sky');

    // trying to add dandelion
    dandelion = game.add.sprite(400, 0, 'dandelion');
    dandelion.animations.add('blinking');
    dandelion.animations.play('blinking', 2, true);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(4, 2);
    sky.scale.setTo(4, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(200, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;
  
    // The seedling and its settings
    seedling = game.add.sprite(32, game.world.height - 200, 'seedling');

    //add dog thing
    baddie = game.add.sprite(96, game.world.height - 200, 'baddie');

    //  We need to enable physics on the seedling
    game.physics.arcade.enable(seedling);
    game.physics.arcade.enable(baddie);

    //  seedling physics properties. Give the little guy a slight bounce.
    seedling.body.bounce.y = 0.2;
    seedling.body.gravity.y = 300;
    seedling.body.collideWorldBounds = false;
    baddie.body.gravity.y = 300;
    baddie.body.collideWorldBounds = false;
    baddie.body.bounce.y = 0.2;

    baddie.body.velocity.x = 100;

    //  Our two animations, walking left and right.
    seedling.animations.add('left', [0, 1, 2, 3], 10, true);
    seedling.animations.add('right', [5, 6, 7, 8], 10, true);

    stars = game.add.group();

    stars.enableBody = true;

    // add the baddie
    baddie = game.add.sprite(32, game.world.height - 165, 'baddie');

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 6;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
//    cursors = game.input.keyboard.addKeys({'up' : Phaser.KeyCode.W,
//              'down' : Phaser.KeyCode.S, 'left' : Phaser.KeyCode.A,
//              'right' : Phaser.KeyCode.D});

    //game.camera.follow(seedling);

}

var characterJumped = false
//so that the character can only jump once?
function update() {
    //  Collide the seedling and the stars with the platforms

    if (baddie.x == game.world.width - baddie.width)
    {
      baddie.body.velocity.x = -100;
    }

    if (baddie.x == 0)
    {
      baddie.body.velocity.x = 100;
    }
    game.physics.arcade.collide(seedling, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(baddie, platforms);

    game.physics.arcade.overlap(seedling, stars, collectStar, null, this);
    game.physics.arcade.overlap(seedling, baddie, seedlingDies, null, this);

    //  Reset the seedlings velocity (movement)
    seedling.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        seedling.body.velocity.x = -150;

        seedling.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        seedling.body.velocity.x = 150;

        seedling.animations.play('right');
    }
    else if (cursors.up.isDown)
    {
      if (characterJumped == false)
      {
        seedling.body.velocity.y = -300;
        console.log("the guy jumps");
        //character can only jump after it jumps once/lands on gruond??
      }
    }

    else
    {
        //  Stand still
        seedling.animations.stop();

        seedling.frame = 4;
    }

    //  Allow the seedling to jump if they are touching the ground.
    if (cursors.up.isDown && seedling.body.touching.down)
    {
        seedling.body.velocity.y = -150;
    }
        game.camera.x = seedling.x;
        game.camera.y = seedling.y;
        console.log(seedling.x + "This is x of seedling");
        console.log(seedling.y + "This is y of seedling");
        console.log(game.camera.x + "This is the game camera");
        console.log(Phaser.Camera.x + "This is the phaser camera");
}
function collectStar (seedling, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;


}
function seedlingDies (seedling, baddie) {

  seedling.kill();
  var style = { font: "32px Arial", fill: "black", wordWrap: true, align: "center", backgroundColor: "white" };

  var text = game.add.text(0, 0, "you died :(", style);
  text.anchor.set(0.5);

  text.x = 200;
  text.y = 200;

}
