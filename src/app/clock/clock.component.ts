import { Component, OnInit } from '@angular/core';
import { faPlay, faPause, faPlus, faMinus, faRedoAlt, } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.sass'],
})
export class ClockComponent implements OnInit {
  public sessionLength: number | any;
  public breakLength: any | any;
  public minutes: number | any;
  public seconds: number | any;
  public isRunnning: boolean | any;
  public isSession: boolean | any;
  public faPlay = faPlay;
  public faPause = faPause;
  public faPlus = faPlus;
  public faMinus = faMinus;
  public faRedoAlt = faRedoAlt;
  public intervalHandle: number | any;
  public audio: HTMLAudioElement | any;
  public isClear: boolean | any;
  public displayClasses: string = '';

  constructor() { }

  reset() {
    this.seconds = 0;
    this.minutes = 25;
    this.sessionLength = 25;
    this.breakLength = 5;
    this.isRunnning = false;
    this.isSession = true;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isClear = true;
    this.displayClasses = '';
    if (this.intervalHandle) {
      window.clearInterval(this.intervalHandle);
    }
  }

  ngOnInit() {
    this.audio = document.querySelector('#beep');
    this.reset();
  }

  updateMinutes(value: number) {
    if (this.isClear) {
      this.minutes = value;
    }
  }

  onBreakIncrease($event: any) {
    if (this.isRunnning) {
      return;
    }
    if (this.breakLength < 60) {
      this.breakLength = this.breakLength + 1;
      this.updateMinutes(this.breakLength);
    }
  }

  onBreakDecrease($event: any) {
    if (this.isRunnning) {
      return;
    }
    if (this.breakLength > 1) {
      this.breakLength = this.breakLength - 1;
      this.updateMinutes(this.breakLength);
    }
  }

  onSessionIncrease() {
    if (this.isRunnning) {
      return;
    }
    if (this.sessionLength < 60) {
      this.sessionLength = this.sessionLength + 1;
      this.updateMinutes(this.sessionLength);
    }
  }

  onSessionDecrease() {
    if (this.isRunnning) {
      return;
    }
    if (this.sessionLength > 1) {
      this.sessionLength = this.sessionLength - 1;
      this.updateMinutes(this.sessionLength);
    }
  }

  onStartClick() {
    this.isRunnning = !this.isRunnning;
    this.isClear = false;
    if (this.isRunnning) {
      console.debug('Starting');
      this.intervalHandle = window.setInterval(this.nextTick.bind(this), 1000);
    } else {
      console.debug('Pausing');
      window.clearInterval(this.intervalHandle);
    }
  }

  onReset() {
    this.reset();
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  stopSound() {
    this.audio.pause();
  }

  nextTick() {
    this.seconds = this.seconds - 1;
    if (this.minutes > 0 && this.seconds <= 0) {
      this.seconds = 59;
      this.minutes = this.minutes - 1;
    }

    if (this.minutes <= 1) {
      this.displayClasses = 'text-danger';
    }

    if (this.minutes === 0 && this.seconds === 0) {
      console.debug('--- Finished ---');
      window.clearInterval(this.intervalHandle);
      this.playSound();

      const tmpHandle = window.setInterval(() => {
        this.isSession = !this.isSession;
        if (!this.isSession) {
          this.minutes = this.breakLength;
        } else {
          this.minutes = this.sessionLength;
        }
        this.intervalHandle = window.setInterval(
          this.nextTick.bind(this),
          1000
        );
        window.clearInterval(tmpHandle);
      }, 1000);
    }
  }

  private formatValue(value: number) {
    return value.toString().padStart(2, '0');
  }

  get display() {
    return `${this.formatValue(this.minutes)}:${this.formatValue(
      this.seconds
    )}`;
  }
}
