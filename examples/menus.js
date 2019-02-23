const RACES = [
    {
        name: 'HUMAN',
        icon: new wglt.Sprite(6, 648, 36, 36, undefined, undefined, undefined, 0xC0A040FF),
        description: 'Youngest race, ambitious, well-rounded',
        details: [
            { text: '+1 all attributes', color: 0x00FF00FF }
        ]
    },
    {
        name: 'DWARF',
        icon: new wglt.Sprite(46, 728, 36, 36, undefined, undefined, undefined, 0x4080C0FF),
        description: 'Bold and hardy, skilled warriors',
        details: [
            { text: '+4 Constitution, +2 Strength', color: 0x00FF00FF }
        ]
    },
    {
        name: 'ELF',
        icon: new wglt.Sprite(6, 688, 36, 36, undefined, undefined, undefined, 0xF08080FF),
        description: 'Magical people of otherworldly grace',
        details: [
            { text: '+3 Dexterity, +3 Intelligence', color: 0x00FF00FF }
        ]
    },
    {
        name: 'ORC',
        icon: new wglt.Sprite(246, 688, 36, 36, undefined, undefined, undefined, 0x20C020FF),
        description: 'Noble savages of shamanistic roots',
        details: [
            { text: '+2 Constitution, +4 Strength', color: 0x00FF00FF }
        ]
    },
    {
        name: 'UNDEAD',
        icon: new wglt.Sprite(126, 728, 36, 36, undefined, undefined, undefined, 0xC020C0FF),
        description: 'Cursed by the plague, forsaken for eternity',
        details: [
            { text: '+2 Intelligence, +2 Wisdom', color: 0x00FF00FF }
        ]
    },
];

const CLASSES = [
    {
        name: 'BARBARIAN',
        icon: new wglt.Sprite(99, 551, 28, 26, undefined, undefined, undefined, 0x804000FF),
        description: 'Lords of war, strength, and combat',
        details: [
            { text: '+5 Strength, +2 Constitution', color: 0x00FF00FF }
        ]
    },
    {
        name: 'CLERIC',
        icon: new wglt.Sprite(6, 518, 28, 26, undefined, undefined, undefined, 0xFFFFFFFF),
        description: 'Lethal assasins and masters of stealth',
        details: [
            { text: '+3 Dexterity, +3 Cunning', color: 0x00FF00FF }
        ]
    },
    {
        name: 'PALADIN',
        icon: new wglt.Sprite(99, 617, 28, 26, undefined, undefined, undefined, 0xFF8080FF),
        description: 'Masters of time and space',
        details: [
            { text: '+5 Magic, +3 Willpower', color: 0x00FF00FF }
        ]
    },
    {
        name: 'RANGER',
        icon: new wglt.Sprite(37, 551, 28, 26, undefined, undefined, undefined, 0x80FF80FF),
        description: 'Lords of war, strength, and combat',
        details: [
            { text: '+5 Strength, +2 Constitution', color: 0x00FF00FF }
        ]
    },
    {
        name: 'ROGUE',
        icon: new wglt.Sprite(6, 551, 28, 26, undefined, undefined, undefined, 0xA00000FF),
        description: 'Lethal assasins and masters of stealth',
        details: [
            { text: '+3 Dexterity, +3 Cunning', color: 0x00FF00FF }
        ]
    },
    {
        name: 'WARLOCK',
        icon: new wglt.Sprite(37, 518, 28, 26, undefined, undefined, undefined, 0xA020A0FF),
        description: 'Masters of time and space',
        details: [
            { text: '+5 Magic, +3 Willpower', color: 0x00FF00FF }
        ]
    },
];

const player = {
    race: null,
    // category: null,
    class: null
};

function updateMenu() {
    selectDialog.selectedIndex = 0;

    if (!player.race) {
        prompt.message = new wglt.Message('Choose your race', wglt.Colors.WHITE);
        selectDialog.options = RACES;
        selectDialog.renderer.lineHeight = 40;
    } else if (!player.class) {
        prompt.message = new wglt.Message('Choose your class', wglt.Colors.WHITE);
        selectDialog.options = CLASSES;
        selectDialog.renderer.lineHeight = 33;
    } else {
        prompt.message = new wglt.Message('All done!', wglt.Colors.WHITE);
        selectDialog.options = [];
    }
}

function onSelect(choice) {
    if (!player.race) {
        player.race = choice;
    } else if (!player.class) {
        player.class = choice;
    }

    updateMenu();
}

function onCancel() {
    if (player.class) {
        player.class = null;
    } else if (player.race) {
        player.race = null;
    }

    updateMenu();
}

const app = new wglt.App({
    canvas: document.querySelector('canvas'),
    imageUrl: 'graphics.png',
    size: new wglt.Rect(0, 0, 400, 224)
});

const mainMenu = new wglt.AppState(app);
mainMenu.gui.renderer.baseRect = new wglt.Rect(0, 88, 24, 24);

const prompt = new wglt.MessagePanel(
    mainMenu.gui,
    new wglt.Rect(2, 4, 256, 10),
    new wglt.Message('Choose your character type', wglt.Colors.WHITE));
mainMenu.gui.add(prompt);

const selectDialog = new wglt.ComplexSelectDialog(
    mainMenu.gui,
    new wglt.Rect(5, 15, 246, 204),
    'INVENTORY',
    []);

selectDialog.renderer = {
    lineHeight: 40,

    drawOption: function (gui, point, option, selected) {
        const app = gui.app;
        let x = point.x;
        let y = point.y;
        let iconColor = wglt.Colors.GRAY;
        let titleColor = wglt.Colors.GRAY;
        let descColor = wglt.Colors.GRAY;

        if (selected) {
            iconColor = undefined;
            titleColor = wglt.Colors.YELLOW;
            descColor = wglt.Colors.WHITE;
        }

        if (option.icon) {
            option.icon.draw(app, x, y, iconColor);
            x += option.icon.width;
        }

        app.drawString(option.name, x, y, titleColor);

        if (option.description) {
            app.drawString(option.description, x + 3, y + 10, descColor);
        }

        if (option.details) {
            for (let j = 0; j < option.details.length; j++) {
                const msg = option.details[j];
                const color = selected ? msg.color : wglt.Colors.LIGHT_GRAY;
                app.drawString(msg.text, x + 3, y + 20 + j * 10, color);
            }
        }
    },

    getHeight: function () {
        // return 40;
        return this.lineHeight;
    }
};

selectDialog.onSelect = onSelect;
selectDialog.onCancel = onCancel;
updateMenu();

mainMenu.gui.add(selectDialog);

app.state = mainMenu;
