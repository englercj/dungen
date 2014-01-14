var helpers = {
    // useful utils
    randInt: function(low, high) {
        return ~~(Math.random() * (high - low)) + low;
    },

    randElm: function(array, start, end) {
        //ensure we have an array, and there are elements to check
        if(!array || !array.length)
            return null;

        //special case for 1 element
        if(array.length === 1)
            return array[0];

        //default for start
        if(!start || start < 0)
            start = start || 0;

        //default for end
        if(!end || end < 0)
            end = array.length - 1;

        return array[Helpers.randInt(start, end)];
    },

    // useful constants
    TILE_TYPES: {
        EMPTY: 0,
        WALL: 1,
        FLOOR: 2
    },

    DIRECTION: {
        NORTH: 'n',
        SOUTH: 's',
        EAST: 'e',
        WEST: 'w'
    },

    // common classes
    Room: function() {
        this.position = { x: 0, y: 0 };
        this.size = { x: 0, y: 0 };
        this.tiles = [];
        this.walls = []; //indexes for wall tiles
    }
};
