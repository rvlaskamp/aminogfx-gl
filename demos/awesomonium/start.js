'use strict';

//Attention: increase GPU memory! With 64 MB the rendering suddenly gets very slow while drawing polygons!!!

//Raspberry Pi 3 1080p@60: 13 fps (polygons could be improved)

var amino = require('../../main.js');
var data = require('./countries.js');
var onecolor = require('onecolor');

var fs = require('fs');
var path = require('path');
var cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json')).toString());

var w = 1280; //1920;
var h = 768;  //1080;
var radius = w / 6;
var animated = true;

amino.fonts.registerFont({
    name: 'mech',
    path: path.join(__dirname, 'resources/'),
    weights: {
        400: {
            normal: 'MechEffects1BB_reg.ttf',
            italic: 'MechEffects1BB_ital.ttf'
        }
    }
});

var gfx = new amino.AminoGfx({
    //resolution: '1080p@24'
    //resolution: '720p@50'
    //resolution: '720p@60'
});

gfx.w(w);
gfx.h(h);

gfx.start(function (err) {
    if (err) {
        console.log('Start failed: ' + err.message);
        return;
    }

    //setup
    if (this.w() > 100) {
	    w = this.w();
	    h = this.h();
    }

    this.w(w);
    this.h(h);

    //root
    var root = this.createGroup();

    this.setRoot(root);

    //the globe
    var group = this.createGroup();

    root.add(group);

    buildGlobe(group);

    //lower left bar charts
    root.add(createBar1(200, 50, 15, '#3333ff').x(5).y(500));
    root.add(createBar1(200, 50, 15, '#ffff33').x(5).y(700).sy(-1));

    makeHeader(root);

    makeFooterSymbols(root);

    //root.add(createParticles().x(w-250).y(h));

    root.add(buildDashboard().y(130));

});

function buildDashboard() {
    var group = gfx.createGroup();

    function addLine(text, x, y, glyph) {
        group.add(gfx.createRect()
            .x(x + 5)
            .y(y - 25)
            .w(200)
            .h(32)
            .fill('#ea5036')
        );
        group.add(gfx.createText()
            .text(text)
            .fill('#fcfbcf')
            .fontName('mech')
            .fontSize(30)
            .x(x+10)
            .y(y)
        );
        if (glyph) {
            group.add(gfx.createText()
                .text(glyph)
                .fill('#fcfbcf')
                .fontName('awesome')
                .fontSize(20)
                .x(x + 200 - 25)
                .y(y - 2)
            );
        }
    }

    function addSmallLine(text, x, y) {
        group.add(gfx.createText()
            .text(text)
            .fill('#fcfbcf')
            .fontName('mech')
            .fontSize(20)
            .x(x + 15)
            .y(y)
        );
    }

    {
        var x = 0;
        addLine("ENDO SYS OS / MAKR PROC", x, 0);
        addSmallLine("RDOZ - 25889", x, 30);
        addSmallLine("ZODR - 48639", x, 50);
        addSmallLine("FEEA - 92651", x, 70);
        addSmallLine("DEAD - 02833", x, 90);
    }

    {
        var x = 0;
        var y = 130;
        addLine("FOO_MAR.TCX", x, y + 0, '\uf071');
        addSmallLine("analysis - 48%", x, y + 30);
        addSmallLine("actualizing - 99%", x, y + 50);
        addSmallLine("rentrance - 0.02%", x, y + 70);
    }

    {
        var x = w - 200 - 10;
        var y = 0;
        addLine("Core Extraction", x, y + 0, '\uf0e4');
        addSmallLine("pulverton - 143.888", x, y + 30);
        addSmallLine("minotaur - 105%", x, y + 50);
        addSmallLine("gravitation 26.8%", x, y + 70);
    }

    {
        var x = w - 200 - 10;
        var y = 120;
        addLine("FEED CR55X \\ Analysis", x, y + 0);
        addSmallLine("reconst - 48%", x, y + 30);
        addSmallLine("fargonite - 99%", x, y + 50);
        addSmallLine("sleestack - 0.02%", x, y + 70);

    }
    {
        var x = w - 200 - 10;
        var y = 250;
        addLine("$SHIP_CAM$.FXD", x, y + 0, '\uf06d');
        addSmallLine("fracturizing - 128%", x, y + 30);
        addSmallLine("detox - 43%", x, y + 50);
        addSmallLine("xantos 45% 8%", x, y + 70);
    }
    {
        var x = w - 200 - 10;
        var y = 350;
        addLine("XenoPhage", x, y + 0, '\uf126');
        addSmallLine("scent analysis - 128%", x, y + 30);
        addSmallLine("oxygenize - 43%", x, y + 50);
        addSmallLine("heliotrop **", x, y + 70);
    }

    return group;
}

function makeFooterSymbols(root) {
    for (var i = 0; i < 7; i++)  {
        var sun = gfx.createGroup().x(w / 2 - 300 + i * 100).y(h - 25).rz(30);

        //see http://fontawesome.io/icon/caret-up/
        sun.add(gfx.createText()
            .fontName('awesome').fontSize(80).text('\uf0d8')
            .x(-25).y(25).fill('#fcfbcf')
        );

        var start = Math.random() * 90 - 45;
        var len = Math.random() * 5000 + 5000;

        if (animated) {
            //rotate
            sun.rz.anim().from(start).to(start + 90).dur(len).loop(-1).autoreverse(true).start();
        }

        root.add(sun);
    }
}

function makeHeader(root) {
    var fontH = 70;

    root.add(gfx.createRect().fill('#ff0000').w(w).h(100).opacity(0.5));
    root.add(gfx.createText()
        .text('Awesomonium Levels')
        .fontSize(fontH)
        .fontName('mech')
        .x(20)
        .y(70)
        .fill('#fcfbcf')
    );
    root.add(createBar1(50, 100, 5, '#fcfbcf').x(400).y(75).rz(-90));
    /*
    root.add(gfx.createText()
        .text('Atomization')
        .fontSize(fontH)
        .fontName('mech')
        .x(w - 320)
        .y(70)
        .fill('#fcfbcf')
    );
    */

    //beaker symbol
    root.add(gfx.createText()
        .fontName('awesome').text('\uf0c3').fontSize(80)
        .x(w - 85).y(70).fill('#fcfbcf')
    );
}

function buildGlobe(group) {
    var cos = Math.cos;
    var sin = Math.sin;
    var PI = Math.PI;

    function latlon2xyz(lat,lon, rad) {
        var el = lat / 180.0 * PI;
        var az = lon / 180.0 * PI;
        var x = rad * cos(el) * sin(az);
        var y = rad * cos(el) * cos(az);
        var z = rad * sin(el);

        return [x, y, z];
    }

    function addCountry(nz) {
        //make the geometry
        for (var i = 0; i < nz.borders.length; i++) {
            var border = nz.borders[i];
            var points = [];
            var poly = gfx.createPolygon();

            for (var j = 0; j < border.length; j++) {
                var point = border[j];
                var pts = latlon2xyz(point.lat, point.lng, radius);

                points.push(pts[0]);
                points.push(pts[1]);
                points.push(pts[2]);
            }

            poly.fill('#80ff80');
            poly.geometry(points);
            poly.dimension(3);
            group.add(poly);
        }
    }

    for (var i = 0; i < data.countries.length; i++) {
        addCountry(data.countries[i]);
    }

    // NOTE: on Raspberry pi we can't just make a line.
    // A polygon needs at least two segments.
    function addLine(lat, lon, el, color) {
        var poly = gfx.createPolygon();
        var pt1 = latlon2xyz(lat, lon, radius);
        var pt2 = latlon2xyz(lat, lon, radius + el);
        var pt3 = latlon2xyz(lat, lon, radius);
        var points = pt1.concat(pt2).concat(pt3);

        poly.fill(color);
        poly.geometry(points);
        poly.dimension(3);
        group.add(poly);
    }

    //add a line at portland
    cities.features.forEach(function (city) {
        var color = '#ff00ff';
        var hue = city.properties.city.length / 20;

        addLine(city.geometry.coordinates[1],
                city.geometry.coordinates[0],
                100 * hue,
                onecolor('red').hue(hue).hex());
    });

    // center
    group.x(w / 2).y(h / 2);

    //turn earth upright
    group.rx(90);
    group.ry(0);
    group.rz(0);

    // spin it forever
    if (animated) {
        //rotate the globe
        group.rz.anim().from(0).to(360).dur(60 * 1000).loop(-1).start();
    }
}

function createBar1(w, h, count, color) {
    var gr = gfx.createGroup();
    var rects = [];
    var barw = w / count;

    for (var i = 0; i < count; i++) {
        var rect = gfx.createRect()
            .x(i * barw).y(0)
            .w(barw - 5)
            .h(30)
            .fill(color);

        rects.push(rect);
        gr.add(rect);
    }

    function update() {
        rects.forEach(function (rect) {
            rect.h(20 + Math.random() * (h - 20));
        });
    }

    if (animated) {
        //resize bars (10x a second)
        setInterval(update, 100);
    }

    return gr;
}

function frand(min, max) {
    return Math.random() * (max - min) + min;
}
