export class AnimationLoop {
  animations: Function[] = [];
  animating = true;
  frame;

  constructor() {
    this.add(null);
    this.animate(); // for init requestAnimationFrame loop
  }

  animate() {
    if (this.frame) {
      return;
    }
    if (this.animating) {
      this.frame = requestAnimationFrame(this.animate.bind(this));
    }
    let i = this.animations.length;
    while (i--) {
      if (!this.animations[i]
        || this.animations[i]() === false
      ) {
        this.animations.splice(i, 1);
      }
    }
    this.frame = null;
    this.animations = [this.animations[this.animations.length-1]];
  }

  add(animateFn: Function) {
    this.animations.push(animateFn);
  }

  // start() {
  //   this.animating = true;
  //   this.animate();
  // }
  //
  // stop() {
  //   this.animating = false;
  // }
}
