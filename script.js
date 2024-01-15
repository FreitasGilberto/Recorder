const $button = document.querySelector("#recordButton");
const $pauseButton = document.querySelector("#pauseButton");
const $stopButton = document.querySelector("#stopButton");

let mediaStream;
let mediaRecorder;

$button.addEventListener("click", async () => {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 30 } },
    });

    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm;codecs=vp8,opus",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = "captura.webm";
        link.click();
      }
    };

    mediaRecorder.onstop = () => {
      mediaStream.getTracks().forEach((track) => track.stop());
    };

    $button.disabled = true;
    $pauseButton.disabled = false;
    $stopButton.disabled = false;

    mediaRecorder.start();
  } catch (error) {
    console.error("Error accessing screen:", error);
  }
});

$pauseButton.addEventListener("click", () => {
  if (mediaRecorder.state === "recording") {
    mediaRecorder.pause();
    $pauseButton.textContent = "⏯️ Reanudar";
  } else if (mediaRecorder.state === "paused") {
    mediaRecorder.resume();
    $pauseButton.textContent = "⏸️ Pausar";
  }
});

$stopButton.addEventListener("click", () => {
  if (mediaRecorder.state === "recording" || mediaRecorder.state === "paused") {
    mediaRecorder.stop();
    $button.disabled = false;
    $pauseButton.disabled = true;
    $stopButton.disabled = true;
    $pauseButton.textContent = "⏸️ Pausar";
  }
});
