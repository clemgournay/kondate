import { Directive, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Directive()
export class AbstractModalComponent {

  @Input('title') title: string = '';

  shown: boolean = false;
  opened: boolean = false;

  // Icons
  faTimes = faTimes;

  constructor() {

  }

  open() {
    this.shown = true;
    this.onOpen();
    setTimeout(() => {
      this.opened = true;
    }, 300)
  }

  onOpen() {}

  close() {
    this.opened = false;
    this.onClose();
    setTimeout(() => {
      this.shown = false;
    }, 300);
  }

  onClose() { }
}
