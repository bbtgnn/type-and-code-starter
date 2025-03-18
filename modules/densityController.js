/**
 * Handles text point density settings
 */
export class DensityController {
  constructor(initialDensity = 1, step = 0.1, min = 0.1, max = 3) {
    this.density = initialDensity;
    this.step = step;
    this.minDensity = min;
    this.maxDensity = max;
    this.defaultDensity = initialDensity;
  }

  /**
   * Get current density value
   * @returns {number} Current density value
   */
  getDensity() {
    return this.density / 10;
  }

  /**
   * Increase density by step amount
   * @returns {number} New density value
   */
  increaseDensity() {
    if (this.density < this.maxDensity) {
      this.density = Math.min(this.density + this.step, this.maxDensity);
    }
    return this.density;
  }

  /**
   * Decrease density by step amount
   * @returns {number} New density value
   */
  decreaseDensity() {
    if (this.density > this.minDensity) {
      this.density = Math.max(this.density - this.step, this.minDensity);
    }
    return this.density;
  }

  /**
   * Reset density to default value
   * @returns {number} Default density value
   */
  resetDensity() {
    this.density = this.defaultDensity;
    return this.density;
  }

  /**
   * Set density to a specific value
   * @param {number} value - New density value
   * @returns {number} New density value (clamped between min and max)
   */
  setDensity(value) {
    this.density = Math.max(this.minDensity, Math.min(value, this.maxDensity));
    return this.density;
  }
}
