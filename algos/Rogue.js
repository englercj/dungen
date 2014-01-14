var Rogue = {
    generate: function (gridSize, minRoomSize, maxRoomSize, maxRooms) {
        //do size - 1 since algo puts rooms up against side, and we need to create walls there later
        var rogue = new ROT.Map.Rogue(gridSize.x - 1, gridSize.y - 1),
            map = [];

        //init map
        for(var x = 0; x < gridSize.x; ++x) {
            map[x] = [];
            for(var y = 0; y < gridSize.y; ++y) {
                map[x][y] = helpers.TILE_TYPE.EMPTY;
            }
        }

        //create map
        rogue.create(function(i, j, tile) {
            switch(tile) {
                case 1:
                    map[i+1][j+1] = helpers.TILE_TYPE.EMPTY;
                    break;

                case 0:
                    map[i+1][j+1] = helpers.TILE_TYPE.FLOOR;
                    break;
            }
        });

        //setup walls
        for(var x = 0; x < map.length; x++) {
            for(var y = 0; y < map[0].length; y++) {
                if (map[x][y] === helpers.TILE_TYPE.FLOOR) {
                    for(var xx = x - 1; xx <= x + 1 && xx > 0; xx++) {
                        for(var yy = y - 1; yy <= y + 1 && yy > 0; yy++) {
                            if(map[xx][yy] === helpers.TILE_TYPE.EMPTY)
                                map[xx][yy] = helpers.TILE_TYPE.WALL;// 2;
                        }
                    }
                }
            }
        }

        return map;
    }
};