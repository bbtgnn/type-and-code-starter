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
  try {
    window.addEventListener("deviceorientation", (event) => {
      const rotateDegrees = event.alpha; // alpha: rotation around z-axis
      const leftToRight = event.gamma; // gamma: left to right
      const frontToBack = event.beta; // beta: front back motion
      onOrientationChange(frontToBack, leftToRight, rotateDegrees);
    });
  } catch (error) {
    console.error("Error setting up orientation capture:", error);
  }
}
