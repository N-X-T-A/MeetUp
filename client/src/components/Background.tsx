import React, { useEffect, useRef } from 'react';
import '../../src/css/Background.css';

const MIN_SPEED = 1.5;
const MAX_SPEED = 2.5;

function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

class Blob {
  el: HTMLElement;
  size: number;
  initialX: number;
  initialY: number;
  vx: number;
  vy: number;
  x: number;
  y: number;

  constructor(el: HTMLElement) {
    this.el = el;
    const boundingRect = this.el.getBoundingClientRect();
    this.size = boundingRect.width;
    this.initialX = randomNumber(0, window.innerWidth - this.size);
    this.initialY = randomNumber(0, window.innerHeight - this.size);
    this.el.style.top = `${this.initialY}px`;
    this.el.style.left = `${this.initialX}px`;
    this.vx = randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
    this.vy = randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
    this.x = this.initialX;
    this.y = this.initialY;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size;
      this.vx *= -1;
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size;
      this.vy *= -1;
    }
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.y <= 0) {
      this.y = 0;
      this.vy *= -1;
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${this.y - this.initialY}px)`;
  }
}

export const Background: React.FC = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const blobs = blobRefs.current.map((blobEl) => {
      if (blobEl) return new Blob(blobEl);
      return null;
    }).filter(blob => blob !== null) as Blob[];

    const update = () => {
      requestAnimationFrame(update);
      blobs.forEach((blob) => {
        blob.update();
        blob.move();
      });
    };

    requestAnimationFrame(update);
  }, []);

  return (
    <div className="bouncing-blobs-container">
      <div className="bouncing-blobs-glass"></div>
      <div className="bouncing-blobs">
        <div className="bouncing-blob bouncing-blob--blue" ref={(el) => blobRefs.current[0] = el}></div>
        <div className="bouncing-blob bouncing-blob--blue" ref={(el) => blobRefs.current[1] = el}></div>
        <div className="bouncing-blob bouncing-blob--blue" ref={(el) => blobRefs.current[2] = el}></div>
        <div className="bouncing-blob bouncing-blob--white" ref={(el) => blobRefs.current[3] = el}></div>
        <div className="bouncing-blob bouncing-blob--purple" ref={(el) => blobRefs.current[4] = el}></div>
        <div className="bouncing-blob bouncing-blob--purple" ref={(el) => blobRefs.current[5] = el}></div>
        <div className="bouncing-blob bouncing-blob--pink" ref={(el) => blobRefs.current[6] = el}></div>
      </div>
    </div>
  );
};


