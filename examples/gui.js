
const app = new wglt.App(document.querySelector('canvas'), 80, 50);

const gui = new wglt.GUI(app);

const options = [
    'Sword',
    'Banana',
    'Magic Potion',
    'Red Stapler'
];

let x = 10;
let y = 10;

app.update = function () {
    if (!gui.handleInput(app)) {
        if (app.isKeyDown(wglt.Keys.VK_UP)) {
            y--;
        }
        if (app.isKeyDown(wglt.Keys.VK_LEFT)) {
            x--;
        }
        if (app.isKeyDown(wglt.Keys.VK_RIGHT)) {
            x++;
        }
        if (app.isKeyDown(wglt.Keys.VK_DOWN)) {
            y++;
        }
        if (app.isKeyPressed(wglt.Keys.VK_H)) {
            gui.add(new wglt.MessageDialog('ALERT', 'Hello World'));
        }
        if (app.isKeyPressed(wglt.Keys.VK_I)) {
            gui.add(new wglt.SelectDialog('INVENTORY', options, (choice) => {
                gui.add(new wglt.MessageDialog('ALERT', 'You chose: ' + options[choice]));
            }));
        }
    }

    //app.clear();
    //app.fillRect(0, 0, 80, 50, 0, wglt.Colors.YELLOW, wglt.Colors.DARK_BLUE);
    app.drawString(1, 1, 'Hello world!');
    app.drawString(1, 3, 'Use arrow keys to move');
    app.drawString(1, 5, 'Press "h" to open a MessageDialog');
    app.drawString(1, 7, 'Press "i" to open a SelectDialog');
    app.drawString(x, y, '@');
    gui.draw();
};
