/**
 * Handles device orientation permission and state
 */
export class DeviceOrientationController {
  constructor() {
    this.permissionGranted = false;
    this.initialized = false;
    this.orientationData = {
      alpha: 0,
      beta: 0,
      gamma: 0,
    };

    // Set default permission for non-iOS devices
    if (!this.needsPermission()) {
      this.permissionGranted = true;
    }
  }

  /**
   * Check if the device needs explicit permission for orientation data
   * @returns {boolean} True if permission is needed (iOS devices)
   */
  needsPermission() {
    // iOS 13+ requires explicit permission
    return (
      // @ts-ignore - DeviceOrientationEvent.requestPermission is not recognized by TypeScript
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore - DeviceOrientationEvent.requestPermission is not recognized by TypeScript
      typeof DeviceOrientationEvent.requestPermission === "function"
    );
  }

  /**
   * Request permission to access device orientation
   * @returns {Promise<boolean>} Promise resolving to whether permission was granted
   */
  requestPermission() {
    // @ts-ignore - Promise usage warning
    return new Promise((resolve) => {
      if (this.needsPermission()) {
        // @ts-ignore - DeviceOrientationEvent.requestPermission is not recognized by TypeScript
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            this.permissionGranted = response === "granted";
            resolve(this.permissionGranted);
          })
          .catch((error) => {
            console.error(
              "Error requesting device orientation permission:",
              error
            );
            this.permissionGranted = false;
            resolve(false);
          });
      } else {
        // Permission not needed or already granted
        this.permissionGranted = true;
        resolve(true);
      }
    });
  }

  /**
   * Check if orientation permission is granted
   * @returns {boolean} True if permission is granted
   */
  isPermissionGranted() {
    return this.permissionGranted;
  }

  /**
   * Initialize event listeners for device orientation
   * @returns {boolean} True if initialized successfully, false if already initialized or no permission
   */
  init() {
    // Skip if already initialized or no permission
    if (this.initialized || !this.permissionGranted) {
      return false;
    }

    window.addEventListener(
      "deviceorientation",
      this.handleOrientation.bind(this)
    );
    this.initialized = true;
    return true;
  }

  /**
   * Handle device orientation event
   * @param {DeviceOrientationEvent} event - The orientation event
   */
  handleOrientation(event) {
    this.orientationData.alpha = event.alpha || 0;
    this.orientationData.beta = event.beta || 0;
    this.orientationData.gamma = event.gamma || 0;
  }

  /**
   * Get current orientation data
   * @returns {Object} Object containing alpha, beta, gamma values
   */
  getOrientationData() {
    return this.orientationData;
  }
}
