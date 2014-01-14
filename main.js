var options = {
        size: { x: 100, y: 80 },
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
            drawGridMap(grid);
        }
    },
    gui,
    canvas,
    ctx,
    time,
    scale = { x: 1, y: 1 };

options.colors[helpers.TILE_TYPE.EMPTY] = '#111';
options.colors[helpers.TILE_TYPE.FLOOR] = 'rgba(100, 100, 100, 0.5)';
options.colors[helpers.TILE_TYPE.WALL] = 'rgba(246, 203, 24, 0.8)';
options.colors.grid = 'rgba(255, 255, 255, 0.2)';

function init() {
    gui = new dat.GUI();
    canvas = document.getElementById('view');
    ctx = ctx = canvas.getContext('2d');
    time = document.getElementById('time');

    canvas.width = 512;
    canvas.height = 512;

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
    gui.add(options, 'algorithm', {
        'Room Maze': 'RoomMaze',
        'Simple': 'Simple'
    }).onChange(options.regenerate());
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
    for(i = 0; i < canvas.width; i += scale.x) {
        ctx.moveTo(0.5 + i, 0);
        ctx.lineTo(0.5 + i, canvas.height);
    }

    for(i = 0; i < canvas.height; i += scale.y) {
        ctx.moveTo(0, 0.5 + i);
        ctx.lineTo(canvas.width, 0.5 + i);
    }

    ctx.strokeStyle = options.colors.grid;
    ctx.stroke();
}

function drawGridMap(grid) {
    var xlen = grid.length,
        ylen = grid[0].length;

    for(var x = 0; x < xlen; ++x) {
        for(var y = 0; y < ylen; ++y) {
            var tile = grid[x][y];

            if(tile === helpers.TILE_TYPE.EMPTY)
                continue;

            if(tile === helpers.TILE_TYPE.FLOOR)
                ctx.fillStyle = options.colors[helpers.TILE_TYPE.FLOOR];
            else if(tile === helpers.TILE_TYPE.WALL)
                ctx.fillStyle = options.colors[helpers.TILE_TYPE.WALL];// '#424254';

            ctx.fillRect(x * scale.x, y * scale.y, scale.x, scale.y);
        }
    }
}

window.onload = init;