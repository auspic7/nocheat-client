import {playMelody, playNote} from "./freq"

let shouldStop = false;
let stopped = false;
var recordedChunks = [];
const downloadLink = document.getElementById('download');
const stopButton = document.getElementById('stop');

stopButton.addEventListener('click', function () {
    console.log("stop");
    shouldStop = true;
})

var socket = io("http://localhost:5000/");
socket.on('connect', function () {
    socket.emit('message', {
        data: "blabla"
    });
});

socket.on('play', function () {
    // create web audio api context
    playNote(19000, 5000);
})

navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
    .then(stream => {
        const recorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 128000,
            mimeType: 'audio/webm'
        })
        recorder.ondataavailable = function (e) {
            console.log(e.data)
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }

            if (shouldStop === true && stopped === false) {
                recorder.stop();
                stopped = true;
            }
        }
        recorder.onstop = function (e) {
            downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
            downloadLink.download = 'acetest.webm';
        }

        recorder.start(500);
        setInterval(() => {
            console.log(recorder)
        }, 5000);
    })