import {createApp, reactive, ref} from 'vue';

const STORAGE_KEY = 'rooms';

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


/**
 * Get the initial state of the rooms, looking first at localStorage, and
 * if not found there, generate a new fresh layout.
 *
 * @returns {any|*[]}
 */
const getRooms = () => {
    const savedRooms = localStorage.getItem(STORAGE_KEY);

    if (savedRooms) {
        return JSON.parse(savedRooms);
    }

    // Generate a new set of rooms
    const r = [];
    for (let x = 1; x <= 5; x++) {
        for (let y = 1; y <= 5; y++) {
            let color = 'black';
            let note = '';

            // Left and right edge except for center row, can be an exit
            if ((x === 1 || x === 5) && y !== 3) {
                note = '?';
            }

            // Top and bottom edge except for center column, can be an exit
            if ((y === 1 || y === 5) && x !== 3) {
                note = '?';
            }

            // Middle is special
            if (x === 3 && y === 3) {
                color = 'white';
                note = 'Central';
            }

            r.push({
                x, y, color, note,
            });
        }
    }

    return r;
}

createApp({
    setup() {
        const colors = ref(['green', 'yellow', 'red', 'blue', 'black', 'white']);

        const current_x = ref(null);
        const current_y = ref(null);
        const current_room = ref(null);
        const note_ref = ref();

        const rooms = reactive(getRooms());

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

        const resetGame = () => {
            localStorage.removeItem(STORAGE_KEY);
            window.location = window.location;
        };

        const saveRooms = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
        };

        editRoom(3, 3);

        const setCurrentColor = (color) => {
            current_room.value.color = color;
            note_ref.value.focus();
            saveRooms();
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

            saveRooms();
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

            saveRooms();
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
            resetGame,
            saveRooms,
            setCurrentColor,
            shiftColumn,
            shiftRow,
        }
    }
}).mount('#app');
