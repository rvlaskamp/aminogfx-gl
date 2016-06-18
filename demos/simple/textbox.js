'use strict';

var amino = require('../../main.js');

amino.start(function (core, stage) {
    //root
    var root = new amino.Group().id('group');

    root.acceptsMouseEvents = true;
    stage.setRoot(root);

    //rect
    var rect = new amino.Rect().w(300).h(50).fill('#cccccc').x(50).y(50).id('bg');

    rect.acceptsMouseEvents = true;
    rect.acceptsKeyboardEvents = true;
    root.add(rect);

    core.on('focusgain', rect, function () {
        rect.fill('#ffffff');
    });

    core.on('focuslose', rect, function () {
        rect.fill('#cccccc');
    });

    //cursor
    var cursor = new amino.Rect().w(3).h(40).fill('#ff0000').x(50 + 20).y(55).id('cursor');

    root.add(cursor);

    //label
    var label = new amino.Text().x(50).y(50 + 40).fill('#000000').id('text').text('F').fontSize(40);

    root.add(label);

    core.on('keypress', rect, function (e) {
        console.log('got keyboard event', e.printable, e.key, e.keycode, e.char);

        if (e.printable === true) {
            label.text(label.text() + e.char);
            cursor.x(50 + label.calcWidth());
        }

        //FIXME special keys on macOS
        if (e.key == 'BACK_DELETE') {
            var text = label.text();

            if (text) {
                text = text.substring(0, text.length - 1);
                label.text(text);
                cursor.x(50 + label.calcWidth());
            }
        }

    });
});
