// Based on: http://breinygames.blogspot.com/2011/07/random-map-generation.html

var SimpleRoomMaze = srm = {
    generate: function(gridSize, minRoomSize, maxRoomSize, maxRooms) {
        // 1) Create the grid
        var grid = [];
        for(var x = 0; x < gridSize.x; ++x) {
            this.grid[x] = [];
            for(var y = 0; y < gridSize.y; ++y) {
                this.grid[x][y] = helpers.TILE_TYPE.EMPTY;
            }
        }

        // 2) Create a random sized room in the middle of the grid
        // 3) Add the new room to a list of all created rooms.
        var rooms = [srm.generateRoom(minRoomSize, maxRoomSize)];
        srm.placeRoom(
            grid,
            rooms[0],
            (gridSize.x / 2) - (rooms[0].size.x / 2),
            (gridSize.y / 2) - (rooms[0].size.y / 2)
        );

        var area = gridSize.x * gridSize.y,
            roomPos = { x: 0, y: 0 };

        for(var i = 0; i < area; ++i) {
            if(maxRooms && rooms.length === maxRooms)
                break;

            // 4) Pick a random room from the list of all created rooms.
            // 5) Pick a random wall tile from the selected room.
            var branchPos = srm.getBranchPosition(grid, rooms),
                direction = branchPos.dir;

            // 6) Generate a new random sized room.
            var room = srm.generateRoom(minRoomSize, maxRoomSize);

            roomPos.x = 0;
            roomPos.y = 0;

            switch(direction) {
                case helpers.DIRECTION.NORTH:
                    roomPos.x = branchPos.x - (room.size.x / 2);
                    roomPos.y = branchPos.y - room.size.y;
                    break;

                case helpers.DIRECTION.SOUTH:
                    roomPos.x = branchPos.x - (room.size.x / 2);
                    roomPos.y = branchPos.y + 1;
                    break;

                case helpers.DIRECTION.EAST:
                    roomPos.x = branchPos.x + 1;
                    roomPos.y = branchPos.y - (room.size.y / 2);
                    break;

                case helpers.DIRECTION.WEST:
                    roomPos.x = branchPos.x - room.size.x;
                    roomPos.y = branchPos.y - (room.size.y / 2);
                    break;
            }

            // 7) See if there is space for the new room next to the selected wall tile of the selected room.
            // 8) If yes, continue. If no, go back to step 4.
            if(srm.isSpaceForRoom(grid, gridSize, room)) {
                // 9) Dig out the new room to add it to part of the dungeon, and add it to list of completed rooms.
                rooms.push(room);
                srm.placeRoom(grid, room, roomPos.x, roomPos.y);
                // 10) Turn the wall tile picked in step 5 into a door way to make our new room accessible.
                srm.connectRooms(branchPos, direction);
            }

            // 11) Go back to step 4 until the dungeon is complete.
        }

        // 12) Add the up and down staircases inside random rooms of the dungeon.
        // 13) Finally, add some monsters, items, and gold in random areas of the dungeon.

        return grid;
    },
    generateRoom: function(minSize, maxSize) {
        var room = new helpers.Room(),
            sx = room.size.x = helpers.randInt(minSize.x, maxSize.x),
            sy = room.size.y = helpers.randInt(minSize.y, maxSize.y),
            tiles = room.tiles,
            walls = room.walls,
            col,
            wall;

        for(var x = 0; x < sx; ++x) {
            tiles[x].push(col = []);
            for(var y = 0; y < sy; ++y) {
                if(x === 0 || x === sx - 1 || y === 0 || y === sy - 1) {
                    col.push(helpers.TILE_TYPE.WALL);

                    //store position of normal walls (not corners)
                    if(y !== 0 && y !== sy - 1) {
                        if(x === 0) {
                            walls.push({ x: x, y: y, dir: helpers.DIRECTION.WEST });
                        } else if(x === sx - 1) {
                            walls.push({ x: x, y: y, dir: helpers.DIRECTION.EAST });
                        }
                    } else if(x !== 0 && x !== sx - 1) {
                        if(y === 0) {
                            walls.push({ x: x, y: y, dir: helpers.DIRECTION.NORTH });
                        } else if(y === sy - 1) {
                            walls.push({ x: x, y: y, dir: helpers.DIRECTION.SOUTH });
                        }
                    }
                } else {
                    col.push(helpers.TILE_TYPE.FLOOR);
                }
            }
        }

        return room;
    },
    placeRoom: function(grid, room, px, py) {
        room.position.x = px;
        room.position.y = py;

        var tx = 0,
            ty = 0;

        //copy the tiles from this room into the grid
        for(var x = px; x < (px + room.size.x); ++x) {
            for(var y = py; y < (py + room.size.y); ++y) {
                grid[x][y] = room.tiles[tx][ty];
                ty++;
            }
            tx++;
            ty = 0;
        }
    },
    getBranchPosition: function(grid, rooms) {
        var room = helpers.randElm(rooms),
            wall = helpers.randomElm(room.walls);

        return { x: wall.x + room.position.x, y: wall.y + room.position.y, dir: wall.dir };
    },
    isSpaceForRoom: function(grid, gridSize, room) {
        var mx = room.position.x + room.size.x,
            my = room.position.y + room.size.y;

        //check x size
        if(room.position.x < 0 || mx > gridSize.x)
            return false;

        //check y size
        if(room.position.y < 0 || my > gridSize.y)
            return false;

        //check if any tiles of this room intersect another room
        for(var x = room.position.x; x < mx; ++x) {
            for(var y = room.position.y; y < my; ++y) {
                if(grid[x][y] !== helpers.TILE_TYPE.EMPTY) {
                    return false;
                }
            }
        }

        return true;
    },
    connectRooms: function(grid, branchPos) {
        grid[branchPos.x][branchPos.y] = helpers.TILE_TYPE.FLOOR;

        switch(branchPos.dir) {
            case helpers.DIRECTION.NORTH:
                grid[branchPos.x][branchPos.y - 1] = helpers.TILE_TYPE.FLOOR;
                break;

            case helpers.DIRECTION.SOUTH:
                grid[branchPos.x][branchPos.y + 1] = helpers.TILE_TYPE.FLOOR;
                break;

            case helpers.DIRECTION.EAST:
                grid[branchPos.x + 1][branchPos.y] = helpers.TILE_TYPE.FLOOR;
                break;

            case helpers.DIRECTION.WEST:
                grid[branchPos.x - 1][branchPos.y] = helpers.TILE_TYPE.FLOOR;
                break;
        }
    }
};