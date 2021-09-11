import { song } from "./songs/song";

export function initAudio() {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var processor = context.createScriptProcessor(1024, 1, 1);
  processor.connect(context.destination);

  var handleSuccess = function (stream) {
    var input = context.createMediaStreamSource(stream);
    input.connect(processor);

    var receivedAudio = false;
    processor.onaudioprocess = function (e) {
      // This will be called multiple times per second.
      // The audio data will be in e.inputBuffer
      if (!receivedAudio) {
        receivedAudio = true;
        console.log("Received audio", e);
      }
    };
  };

  return navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
}

// Polyfill rIC if needed
if (!("requestIdleCallback" in window)) {
  window.requestIdleCallback = (callback) => {
    setTimeout(callback, 200);
  };
}

let currentNode = null;
let currentBuffer = null;

const renderSong = (song) =>
  new Promise((resolve) => requestIdleCallback(() => resolve(zzfxM(...song))));
const playSong = async (song) => {
  if (!currentBuffer) {
    currentBuffer = await renderSong(song);
  }
  currentNode = zzfxP(...currentBuffer);
  currentNode.loop = true;
  await zzfxX.resume();
};

export function playMusic() {
  zzfxV = 0.3;
  playSong(song);
}

export function playAudio(seq) {
  zzfx(...eval(`[${seq}]`))
}