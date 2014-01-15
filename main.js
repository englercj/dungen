var options = {
        size: { x: 50, y: 40 },
        minRoomSize: { x: 4, y: 4 },
        maxRoomSize: { x: 12, y: 12 },
        maxRooms: 50,
        showGrid: true,
        algorithm: 'RoomMaze',
        colors: {},
        regenerate: function() {
            var timeStart = Date.now(),
                grid = window[options.algorithm].generate(options.size, options.minRoomSize, options.maxRoomSize, options.maxRooms),
                timeEnd = Date.now();

            time.textContent = (timeEnd - timeStart);

            scale.x = ~~(canvas.width / options.size.x);
            scale.y = ~~(canvas.height / options.size.y);

            clear();
            if(options.showGrid) drawGridLines();
            if(grid) drawGridMap(grid);
        }
    },
    gui,
    canvas,
    ctx,
    time,
    scale = { x: 1, y: 1 },
    algorithms = {
        'Room Maze': 'RoomMaze',
        'Simple': 'Simple',
        'ROT.Digger': 'Digger',
        'ROT.Rogue': 'Rogue',
        'ROT.Uniform': 'Uniform'
    },
    tiles = {
        floor: { x: 112, y: 64 },
        wall: { x: 208, y: 48  },
        wall_n: { x: 208, y: 48  },
        wall_s: { x: 112, y: 128 },
        wall_e: { x: 224, y: 208 },
        wall_w: { x: 192, y: 142 },
        corner: { x: 192, y: 48  },
        corner_n: { x: 192, y: 48  },
        corner_s: { x: 128, y: 128 },
        corner_e: { x: 160, y: 128 },
        corner_w: { x: 96 , y: 128 },
        size: { x: 16, y: 16 }
    },
    texture = new Image();

texture.src = 'assets/cave_034-Tileset.png';

options.colors[helpers.TILE_TYPE.EMPTY] = '#111';
options.colors[helpers.TILE_TYPE.FLOOR] = 'rgba(100, 100, 100, 0.8)';
options.colors[helpers.TILE_TYPE.WALL] = 'rgba(246, 203, 24, 0.8)';
options.colors.grid = 'rgba(255, 255, 255, 0.2)';

function init() {
    gui = new dat.GUI();
    canvas = document.getElementById('view');
    ctx = ctx = canvas.getContext('2d');
    time = document.getElementById('time');

    canvas.width = tiles.size.x * options.size.x;
    canvas.height = tiles.size.y * options.size.y;

    initGui();
    options.regenerate();
}

function initGui() {
    var fsz = gui.addFolder('Size');
    fsz.add(options.size, 'x', 16, 256).step(1);
    fsz.add(options.size, 'y', 16, 256).step(1);

    var frsz = gui.addFolder('Min Room Size');
    frsz.add(options.minRoomSize, 'x', 3, 64).step(1);
    frsz.add(options.minRoomSize, 'y', 3, 64).step(1);

    var fmrsz = gui.addFolder('Max Room Size');
    fmrsz.add(options.maxRoomSize, 'x', 4, 64).step(1);
    fmrsz.add(options.maxRoomSize, 'y', 4, 64).step(1);

    gui.add(options, 'maxRooms', 0, 256).step(1);
    gui.add(options, 'showGrid').onChange(options.regenerate);
    gui.add(options, 'algorithm', algorithms).onChange(options.regenerate);
    gui.add(options, 'regenerate');
}

function clear() {
    ctx.fillStyle = options.colors[helpers.TILE_TYPE.EMPTY];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGridLines() {
    var i = 0;

    ctx.beginPath();

    //draw grid
    for(i = 0; i < canvas.width; i += tiles.size.x) {// scale.x) {
        ctx.moveTo(0.5 + i, 0);
        ctx.lineTo(0.5 + i, canvas.height);
    }

    for(i = 0; i < canvas.height; i += tiles.size.y) {// scale.y) {
        ctx.moveTo(0, 0.5 + i);
        ctx.lineTo(canvas.width, 0.5 + i);
    }

    ctx.strokeStyle = options.colors.grid;
    ctx.stroke();
}

function drawGridMap(grid) {
    var xlen = grid.length,
        ylen = grid[0].length;

    //draw dungeon grid
    for(var x = 0; x < xlen; ++x) {
        for(var y = 0; y < ylen; ++y) {
            var tile = grid[x][y];

            if(tile & helpers.TILE_TYPE.EMPTY)
                continue;

            if(tile & helpers.TILE_TYPE.FLOOR) {
                drawTile('floor', x, y);
                //ctx.fillStyle = options.colors[helpers.TILE_TYPE.FLOOR];
            }
            else if(tile & helpers.TILE_TYPE.WALL) {
                var type = tile & helpers.CORNER ? 'corner' : 'wall';

                if(tile & helpers.DIRECTION.NORTH)
                    type += '_n';
                else if(tile & helpers.DIRECTION.SOUTH)
                    type += '_s';
                else if(tile & helpers.DIRECTION.EAST)
                    type += '_e';
                else if(tile & helpers.DIRECTION.WEST)
                    type += '_w';

                drawTile(type, x, y);
                //ctx.fillStyle = options.colors[helpers.TILE_TYPE.WALL];// '#424254';
                //ctx.fillRect(x * tiles.size.x, y * tiles.size.y, tiles.size.x, tiles.size.y);
            }

            //ctx.fillRect(x * scale.x, y * scale.y, scale.x, scale.y);
        }
    }
}

function drawTile(type, x, y) {
    ctx.drawImage(
        texture,
        tiles[type].x,
        tiles[type].y,
        tiles.size.x,
        tiles.size.y,
        x * tiles.size.x,
        y * tiles.size.x,
        tiles.size.x,
        tiles.size.y
    );
}

window.onload = init;
