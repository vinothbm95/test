import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[elpisRmsStopProp]'
})
export class StopPropDirective {

  constructor() { }
  @HostListener("click", ["$event"])
  public onClick(event: any): void
  {
      event.stopPropagation();
  }

}
