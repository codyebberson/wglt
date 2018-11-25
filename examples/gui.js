
const term = new wglt.Terminal(document.querySelector('canvas'), 80, 50);

const gui = new wglt.GUI(term);

const options = [
    'Sword',
    'Banana',
    'Magic Potion',
    'Red Stapler'
];

let x = 10;
let y = 10;

term.update = function () {
    if (!gui.handleInput(term)) {
        if (term.isKeyDown(wglt.Keys.VK_UP)) {
            y--;
        }
        if (term.isKeyDown(wglt.Keys.VK_LEFT)) {
            x--;
        }
        if (term.isKeyDown(wglt.Keys.VK_RIGHT)) {
            x++;
        }
        if (term.isKeyDown(wglt.Keys.VK_DOWN)) {
            y++;
        }
        if (term.isKeyPressed(wglt.Keys.VK_H)) {
            gui.add(new wglt.MessageDialog('ALERT', 'Hello World'));
        }
        if (term.isKeyPressed(wglt.Keys.VK_I)) {
            gui.add(new wglt.SelectDialog('INVENTORY', options, (choice) => {
                gui.add(new wglt.MessageDialog('ALERT', 'You chose: ' + options[choice]));
            }));
        }
    }

    term.clear();
    term.fillRect(0, 0, 80, 50, 0, wglt.Colors.YELLOW, wglt.Colors.DARK_BLUE);
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(1, 5, 'Press "h" to open a MessageDialog');
    term.drawString(1, 7, 'Press "i" to open a SelectDialog');
    term.drawString(x, y, '@');
    gui.draw();
};
