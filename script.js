// References to DOM elements
const lightOnButton = document.getElementById("light-on");
const lightOffButton = document.getElementById("light-off");
const importButton = document.getElementById("import-button");
const videoUpload = document.getElementById("video-upload");
const theaterVideo = document.getElementById("theater-video");
const overlay = document.getElementById("overlay");
const fullscreenButton = document.getElementById("fullscreen-button");
const videoCanvas = document.getElementById("video-canvas");
const videoContext = videoCanvas.getContext("2d");

// Light Control: Light On
lightOnButton.addEventListener("click", () => {
  overlay.style.opacity = "0";
});

// Light Control: Light Off
lightOffButton.addEventListener("click", () => {
  overlay.style.opacity = "1";
});

// When the "Import" button is clicked, trigger the file input
importButton.addEventListener("click", () => {
  videoUpload.click();
});

// Event listener for the file upload
videoUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    theaterVideo.src = fileURL;
    theaterVideo.play();
  }
});

// Fullscreen toggle button
fullscreenButton.addEventListener("click", () => {
  if (document.documentElement.requestFullscreen) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  } else if (document.documentElement.mozRequestFullScreen) {
    if (!document.mozFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else {
      document.mozCancelFullScreen();
    }
  } else if (document.documentElement.webkitRequestFullscreen) {
    if (!document.webkitFullscreenElement) {
      document.documentElement.webkitRequestFullscreen();
    } else {
      document.webkitExitFullscreen();
    }
  }
});

// Video state change handling
theaterVideo.addEventListener("play", () => {
  analyzeVideoBrightness();
});

// Function to analyze video brightness
function analyzeVideoBrightness() {
  if (theaterVideo.paused || theaterVideo.ended) {
    return;
  }

  // Draw the current video frame to the canvas
  videoCanvas.width = theaterVideo.videoWidth;
  videoCanvas.height = theaterVideo.videoHeight;
  videoContext.drawImage(
    theaterVideo,
    0,
    0,
    videoCanvas.width,
    videoCanvas.height
  );

  // Get pixel data from the canvas
  const imageData = videoContext.getImageData(
    0,
    0,
    videoCanvas.width,
    videoCanvas.height
  );
  const pixels = imageData.data;
  let totalBrightness = 0;

  // Calculate the average brightness
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;
  }
  const averageBrightness = totalBrightness / (pixels.length / 4);

  // Map the average brightness to a background brightness range
  const backgroundBrightness = averageBrightness / 255;

  // Apply the calculated background brightness
  document.body.style.backgroundColor = `rgba(0, 0, 0, ${backgroundBrightness})`;

  // Continue analyzing frames
  requestAnimationFrame(analyzeVideoBrightness);
}

