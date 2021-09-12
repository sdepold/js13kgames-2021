import { getCanvas, keyPressed } from "kontra";

let lastEvent = new Date();
let touchPositionX = null;

export function initDeviceControl() {
  document.addEventListener("touchstart", (e) => {
    touchPositionX = e.touches[0].clientX;
  });
  document.addEventListener("touchmove", (e) => {
    touchPositionX = e.touches[0].clientX;
  });
  document.addEventListener("touchend", () => {
    touchPositionX = null;
  });
}

export function isLeftTouch() {
  return (
    keyPressed("left") ||
    (touchPositionX && touchPositionX < getCanvas().width / 2)
  );
}

export function isRightTouch() {
  return (
    keyPressed("right") ||
    (touchPositionX && touchPositionX > getCanvas().width / 2)
  );
}
