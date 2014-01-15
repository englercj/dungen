// Based on: http://bigbadwofl.me/random-dungeon-generator/

var Simple = {
    map: null,
    map_size: 64,
    rooms: [],
    generate: function (gridSize, minRoomSize, maxRoomSize, maxRooms) {
        this.rooms.length = 0;
        this.map_size = gridSize.x;

        this.map = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }

        var room_count = Helpers.GetRandom(10, 20);
        var min_size = minRoomSize.x;
        var max_size = maxRoomSize.x;

        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.y = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.w = Helpers.GetRandom(min_size, max_size);
            room.h = Helpers.GetRandom(min_size, max_size);

            if (this.DoesCollide(room)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            this.rooms.push(room);
        }

        this.SquashRooms();

        for (i = 0; i < room_count; i++) {
            var roomA = this.rooms[i];
            var roomB = this.FindClosestRoom(roomA);

            pointA = {
                x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
                y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
                y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = helpers.TILE_TYPE.FLOOR;// 1;
            }
        }

        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = helpers.TILE_TYPE.FLOOR;// 1;
                }
            }
        }

        //scan for wall tiles
        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                //if this is a floor tile, scan around it for empty tiles to make into walls
                if (this.map[x][y] === helpers.TILE_TYPE.FLOOR) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            //if an empty tile exists touching a floor tile, make it a wall tile
                            if (this.map[xx][yy] === helpers.TILE_TYPE.EMPTY) {
                                this.map[xx][yy] = helpers.TILE_TYPE.WALL;// 2;
                            }
                        }
                    }
                }
            }
        }

        return this.map;
    },
    FindClosestRoom: function (room) {
        var mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        var closest = null;
        var closest_distance = 1000;
        for (var i = 0; i < this.rooms.length; i++) {
            var check = this.rooms[i];
            if (check == room) continue;
            var check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        return closest;
    },
    SquashRooms: function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < this.rooms.length; j++) {
                var room = this.rooms[j];
                while (true) {
                    var old_position = {
                        x: room.x,
                        y: room.y
                    };
                    if (room.x > 1) room.x--;
                    if (room.y > 1) room.y--;
                    if ((room.x == 1) && (room.y == 1)) break;
                    if (this.DoesCollide(room, j)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    },
    DoesCollide: function (room, ignore) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    }
}

var Renderer = {
    canvas: null,
    ctx: null,
    size: 512,
    scale: 0,
    Initialize: function () {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx = canvas.getContext('2d');
        this.scale = this.canvas.width / Dungeon.map_size;
    },
    Update: function () {
        for (var y = 0; y < Dungeon.map_size; y++) {
            for (var x = 0; x < Dungeon.map_size; x++) {
                var tile = Dungeon.map[x][y];
                if (tile == 0) this.ctx.fillStyle = '#351330';
                else if (tile == 1) this.ctx.fillStyle = '#64908A';
                else this.ctx.fillStyle = '#424254';
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }
    }
};

var Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    }
};

//Dungeon.Generate();
//Renderer.Initialize();
//Renderer.Update(Dungeon.map);