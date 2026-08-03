import titleBg from '../assets/images/backgrounds/title-bg.webp';
import endingBg from '../assets/images/backgrounds/ending-bg.webp';
import roomMain from '../assets/images/scenes/room-main.webp';
import roomPiano from '../assets/images/scenes/room-piano.webp';
import roomBookshelf from '../assets/images/scenes/room-bookshelf.webp';
import roomClock from '../assets/images/scenes/room-clock.webp';
import roomDesk from '../assets/images/scenes/room-desk.webp';
import roomMusicBox from '../assets/images/scenes/room-music-box.webp';
import roomDoor from '../assets/images/scenes/room-door.webp';
import roomDeskOpen from '../assets/images/states/room-desk-open.webp';
import roomMusicBoxActive from '../assets/images/states/room-music-box-active.webp';
import roomPianoOpen from '../assets/images/states/room-piano-open.webp';
import roomDoorOpen from '../assets/images/states/room-door-open.webp';
import itemSheetPiece01 from '../assets/images/items/item-sheet-piece-01.webp';
import itemSheetPiece02 from '../assets/images/items/item-sheet-piece-02.webp';
import itemSheetPiece03 from '../assets/images/items/item-sheet-piece-03.webp';
import itemWindingKey from '../assets/images/items/item-winding-key.webp';
import itemCompletedSheet from '../assets/images/items/item-completed-sheet.webp';
import itemDoorKey from '../assets/images/items/item-door-key.webp';
import puzzleSheetPiece01 from '../assets/images/puzzles/puzzle-sheet-piece-01.webp';
import puzzleSheetPiece02 from '../assets/images/puzzles/puzzle-sheet-piece-02.webp';
import puzzleSheetPiece03 from '../assets/images/puzzles/puzzle-sheet-piece-03.webp';
import puzzleSheetIncomplete from '../assets/images/puzzles/puzzle-sheet-incomplete.webp';
import puzzleSheetComplete from '../assets/images/puzzles/puzzle-sheet-complete.webp';
import puzzleClockFace from '../assets/images/puzzles/puzzle-clock-face.webp';
import puzzleMusicBoxClue from '../assets/images/puzzles/puzzle-music-box-clue.webp';

export const imageAssets = {
  title: {
    background: titleBg,
  },
  rooms: {
    main: roomMain,
    piano: roomPiano,
    bookshelf: roomBookshelf,
    clock: roomClock,
    desk: roomDesk,
    deskOpen: roomDeskOpen,
    musicBox: roomMusicBox,
    musicBoxActive: roomMusicBoxActive,
    door: roomDoor,
    doorOpen: roomDoorOpen,
    pianoOpen: roomPianoOpen,
  },
  items: {
    sheetPiece01: itemSheetPiece01,
    sheetPiece02: itemSheetPiece02,
    sheetPiece03: itemSheetPiece03,
    windingKey: itemWindingKey,
    completedSheet: itemCompletedSheet,
    doorKey: itemDoorKey,
  },
  puzzles: {
    sheetPiece01: puzzleSheetPiece01,
    sheetPiece02: puzzleSheetPiece02,
    sheetPiece03: puzzleSheetPiece03,
    incompleteSheet: puzzleSheetIncomplete,
    completeSheet: puzzleSheetComplete,
    clockFace: puzzleClockFace,
    musicBoxClue: puzzleMusicBoxClue,
  },
  ending: {
    background: endingBg,
  },
} as const;
