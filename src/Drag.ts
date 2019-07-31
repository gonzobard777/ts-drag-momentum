import {AnimationLoop} from "./AnimationLoop";

export class Drag {
  x = 0;
  y = 0;

  friction = 0.95;
  decelX = 0;
  decelY = 0;

  el: HTMLElement | null = document.getElementById('drag');

  dragging = false;

  bounds = {
    x: document.body.clientWidth,
    y: document.body.clientHeight
  };

  positions: IPosition[] = [];

  offsetX: number = 0;
  offsetY: number = 0;
  decelerating = false;
  startX: number = 0;
  startY: number = 0;

  moveTime: number;
  startTime: number;

  constructor(private loop: AnimationLoop) {
    this.start(undefined);
    this.el.addEventListener('mousedown', this.start.bind(this));
    document.addEventListener('mousemove', this.move.bind(this));
    document.addEventListener('mouseup', this.end.bind(this));
    this.end(undefined);
  }

  changeCurrentPosition(pos: IPosition) {
    this.x = pos.x - this.offsetX;
    this.y = pos.y - this.offsetY;
  }

  getPosition(e: Event| undefined): IPosition {
    if (e) {
      e.preventDefault();
    }
    const event: Touch | any = (e ? (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : e : {});
    const pos = {x: event.pageX, y: event.pageY, time: Date.now()};

    this.positions.push(pos);

    return pos;
  }

  move(e: Event) {
    if (this.dragging) {
      this.changeCurrentPosition(this.getPosition(e));
    }
  }

  start(e: Event): void {
    this.positions = [];
    this.dragging = true;
    this.decelerating = false;

    const pos = this.getPosition(e);
    this.startX = pos.x;
    this.startY = pos.y;

    if (this.el) {
      const rect = this.el.getBoundingClientRect();
      this.offsetX = this.startX - rect.left;
      this.offsetY = this.startY - rect.top;
    }

    this.changeCurrentPosition(pos);

    this.moveTime = this.startTime = Date.now();

    this.loop.add(this.update.bind(this));
  }

  end(e: Event) {
    if (this.dragging) {
      this.dragging = false;

      const pos = this.getPosition(e);

      const now = Date.now();
      let lastPos = this.positions.pop();
      let i = this.positions.length;
      while (i--) {
        if (now - this.positions[i].time > 150) {
          break;
        }
        lastPos = this.positions[i];
      }

      const xOffset = pos.x - lastPos.x;
      const yOffset = pos.y - lastPos.y;

      var timeOffset = (Date.now() - lastPos.time) / 12;

      this.decelX = (xOffset / timeOffset) || 0;
      this.decelY = (yOffset / timeOffset) || 0;
      this.decelerating = true;
    }
  }

  update(): void | boolean {
    if (this.el) {

      if (this.decelerating) {
        this.decelX *= this.friction;
        this.decelY *= this.friction;

        this.x += this.decelX;
        this.y += this.decelY;

        if (Math.abs(this.decelX) < 0.01) {
          this.decelX = 0;
        }
        if (Math.abs(this.decelY) < 0.01) {
          this.decelY = 0;
        }
        if (this.decelX === 0 && this.decelY === 0) {
          this.decelerating = false;
          return false;
        }
      }

      this.x = Math.max(0, Math.min(this.bounds.x, this.x));
      this.y = Math.max(0, Math.min(this.bounds.y, this.y));

      this.onUpdate(this.x, this.y);
    }
  }

  onUpdate(x, y) {
    this.el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  }
}

interface IPosition {
  x: number;
  y: number;
  time: number;
}
