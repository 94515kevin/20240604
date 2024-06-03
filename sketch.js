let video, detector;
let poses = [];
let horseImg;

function preload(){
  horseImg = loadImage("upload_bc549284c3544930bf04fef1eb154c5d.gif");
}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
    });
  }
  requestAnimationFrame(getPoses);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  init().then(() => {
    console.log("Detector initialized");
  });

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);

  // flip horizontal
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0);
  drawSkeleton();
  pop();
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];
    // eye
    const partL = pose.keypoints[1];
    const partR = pose.keypoints[2];
    
    if (partL.score > 0.1) {
      image(horseImg, partL.x - 25, partL.y - 25, 50, 50);
    }
    
    if (partR.score > 0.1) {
      image(horseImg, partR.x - 25, partR.y - 25, 50, 50);
    }
    
    // hand (left wrist)
    const partA = pose.keypoints[9];
    
    if (partA.score > 0.1) {
      push();
      textSize(40);
      text("412730300洪子翔", partA.x, partA.y - 100);
      pop();
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left knee
  14 right knee
  15 left foot
  16 right foot
*/
