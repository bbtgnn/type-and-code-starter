/**
 * Sets up device orientation event capture
 * @callback orientationCallback
 * @param {number} beta - Front to back motion in degrees
 * @param {number} gamma - Left to right motion in degrees
 * @param {number} alpha - Rotation around z-axis in degrees
 */

/**
 * Sets up device orientation event capture
 * @param {orientationCallback} onOrientationChange - Callback function handling orientation changes
 */
function setupOrientationCapture(onOrientationChange) {
  /**
   * Handles device orientation events
   * @param {DeviceOrientationEvent} event - The device orientation event object
   */
  function handleOrientationEvent(event) {
    const rotateDegrees = event.alpha; // alpha: rotation around z-axis
    const leftToRight = event.gamma; // gamma: left to right
    const frontToBack = event.beta; // beta: front back motion
    onOrientationChange(frontToBack, leftToRight, rotateDegrees);
  }

  try {
    // Handle iOS 13+ devices.
    // @ts-ignore
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      // @ts-ignore
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientationEvent
            );
          } else {
            console.error("Request to access the orientation was rejected");
          }
        })
        .catch(console.error);
    }
    // Handle regular non iOS 13+ devices.
    else {
      window.addEventListener("deviceorientation", handleOrientationEvent);
    }
  } catch (error) {
    console.error("Error setting up orientation capture:", error);
  }
}
