class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(100, 100, Phaser.AUTO, 'test', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('test', 'img/test.png');
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'test');
        logo.anchor.setTo(0.5, 0.5);
    }

}

window.onload = () => {

   // var game = new SimpleGame();

};