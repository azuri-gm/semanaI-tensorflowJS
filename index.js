navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var video;
var webcamStream;
startWebcam();

function startWebcam() {
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      // constraints
      {
        video: true,
        audio: false
      },

      // successCallback
      function(localMediaStream) {
        video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        webcamStream = localMediaStream;
      },

      // errorCallback
      function(err) {
        console.log('The following error occured: ' + err);
      }
    );
  } else {
    console.log('getUserMedia not supported');
  }
}

var canvas, ctx;

function init() {}
