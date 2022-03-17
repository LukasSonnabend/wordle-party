import { reactive, readonly } from "vue";

const state = reactive({
  playerName: localStorage.getItem("playerName") || "",
  roomNumber: localStorage.getItem("roomNumber") || "",
  game: null,
  playerScore: 0,
});

export default {
  state: readonly(state),
  actions: {
    // addFnacResult(item) {
    //   state.fnacResults.push(item);
    // },
    setPlayerName(name) {
      state.playerName = name.name;
      localStorage.setItem("playerName", name.name);
    },
    setRoomId(roomId) {
      state.roomNumber = roomId.id;
      localStorage.setItem("roomNumber", roomId.id);
    }
  }
};