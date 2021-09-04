import { pub } from "./pubsub";

let lastEvent = new Date();

export function initDeviceControl() {
  return new Promise((resolve) => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      // (optional) Do something before API request prompt.
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          // (optional) Do something after API prompt dismissed.
          if (response == "granted") {
            window.addEventListener("devicemotion", (event) => {
              handleOrientationEvent(event.accelerationIncludingGravity);
            });
          }
        }, console.error)
        .then(
          () => resolve(true),
          () => resolve(false)
        );
    } else {
      resolve(false);
    }
  });
}

function handleOrientationEvent(acceleration) {
  const now = new Date();

  if (+now - lastEvent >= 100) {
    lastEvent = now;
    pub("device:tilt", acceleration);
  }
}
