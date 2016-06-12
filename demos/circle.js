'use strict';

var path = require('path');
var amino = require('../main.js');

amino.start(function (core, stage) {
    //gree background
    stage.fill("#00ff00");

    //setup root
    var root = new amino.Group();

    stage.setRoot(root);

    //blue rectangle
    var rect = new amino.Rect().w(200).h(250).x(0).y(0).fill("#0000ff");

    root.add(rect);
    rect.acceptsMouseEvents = true;
    rect.acceptsKeyboardEvents = true;

    //circle
    var circle = new amino.Circle().radius(50)
        .fill('#ffcccc').filled(true)
        .x(100).y(100);

    circle.acceptsMouseEvents = true;

    core.on('click', circle, function () {
        console.log('clicked on the circle');
    });

    core.on('keypress', rect, function (e) {
        console.log('key was pressed', e.keycode, e.printable, e.char);
    });

    core.on('click', rect, function () {
        console.log("clicked on the rect");
    });

    root.add(circle);

    //images
    var iv = new amino.ImageView();

    iv.src(path.join(__dirname, '/images/tree.png'));
    iv.sx(4).sy(4);
    root.add(iv);

    var iv2 = new amino.ImageView();

    iv2.src(path.join(__dirname, '/images/yose.jpg'));
    iv2.sx(4).sy(4);
    iv2.x(300);
    root.add(iv2);

    iv2.x.anim().delay(1000).from(0).to(1000).dur(3000).start();

});
