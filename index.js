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

function init() {
  var imageScaleFactor = 0.5;
  var outPutStride = 16;
  var flipHorizontal = false;
  const maxPoseDetections = 5;
  const scoreThreshold = 0.6;
  const nmsRadius = 20;
  canvas = document.getElementById('myCanvas');
  video = document.getElementById('video');
  ctx = canvas.getContext('2d');
  ctx.font = '10px Arial';
  canvas.height = video.height;
  canvas.width = video.width;

  video.addEventListener(
    'play',
    () => {
      var $this = this;
      posenet.load().then(function(net) {
        (function loop() {
          net
            .estimateMutiplePoses(
              video,
              imageScaleFactor,
              flipHorizontal,
              outPutStride,
              maxPoseDetections,
              scoreThreshold,
              nmsRadius
            )
            .then(function(pose) {
              console.log(pose);
              for (var index in pose) {
                var attr = pose[index]['keypoints'];
                for (var index2 in attr) {
                  var Obj = attr[index2];
                  if (Obj.score >= scoreThreshold) {
                    ctx.beginPath();
                    ctx.fillStyle = 'Red';
                    ctx.rect(Obj.position.x, Obj.position.y, 3, 3);
                    ctx.fillText(
                      Obj.part,
                      Obj.position.x + 10,
                      Obj.position.y
                    );
                    ctx.fillStyle = 'Yellow';
                    ctx.fill();
                  }
                }
              }
            });
          ctx.drawImage($this, 0, 0, canvas.width, canvas.height);
          setTimeout(loop, 1000 / 30);
        })();
      });
    },
    0
  );
}
