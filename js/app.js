import {createApp, reactive, ref} from 'vue';

const rotate = (n, direction) => {
    n = n + direction;

    if (n === 6) {
        return 1;
    }

    if (n === 0) {
        return 5;
    }

    return n;
}

createApp({
    setup() {
        const colors = ref(['green', 'yellow', 'red', 'blue', 'black', 'white']);

        const current_x = ref(null);
        const current_y = ref(null);
        const current_room = ref(null);
        const note_ref = ref();

        const r = [];
        for (let x = 1; x <= 5; x++) {
            for (let y = 1; y <= 5; y++) {
                r.push({
                    x, y, color: 'black', note: '?', cls: 'black',
                });
            }
        }

        const rooms = reactive(r);

        const getRoom = (x, y) => {
            return rooms.find((r) => ((r.x === x) && (r.y === y)))
        }

        const set = (col, row, color, note) => {
            const r = getRoom(col, row);
            r.color = color;
            r.note = note;
        };

        const editRoom = (col, row) => {
            current_x.value = col;
            current_y.value = row;
            current_room.value = getRoom(col, row);
            if (note_ref.value) {
                note_ref.value.focus();
            }
        };

        // Remove '?' from rooms that can't have the exit
        //
        for (let x = 2; x <= 4; x++) {
            for (let y = 2; y <= 4; y++) {
                set(x, y, 'black', '');
            }
        }

        // These can't have the exit either.
        //
        set(3, 1, 'black', '');
        set(1, 3, 'black', '');
        set(5, 3, 'black', '');
        set(3, 5, 'black', '');

        set(3, 3, 'white', 'Central');
        editRoom(3, 3);

        const setCurrentColor = (color) => {
            current_room.value.color = color;
            note_ref.value.focus();
        }

        const shiftColumn = (col, dir) => {
            if (col === 3) {
                // Can't shift column containing central room
                return;
            }

            rooms.forEach((room) => {
                if (room.x === col) {
                    room.y = rotate(room.y, dir);
                }
            });

            if (current_x.value === col) {
                current_y.value = rotate(current_y.value, dir);
            }

        }

        const shiftRow = (row, dir) => {
            if (row === 3) {
                // Can't shift row containing central room
                return;
            }

            rooms.forEach((room) => {
                if (room.y === row) {
                    room.x = rotate(room.x, dir);
                }
            });

            if (current_y.value === row) {
                current_x.value = rotate(current_x.value, dir);
            }
        }

        return {
            colors,
            current_x,
            current_y,
            current_room,
            note_ref,
            rooms,
            editRoom,
            getRoom,
            setCurrentColor,
            shiftColumn,
            shiftRow,
        }
    }
}).mount('#app');
