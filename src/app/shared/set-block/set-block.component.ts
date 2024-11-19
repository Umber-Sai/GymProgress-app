import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ExerciseSetType } from 'src/app/type/exercise-history.type';

@Component({
  selector: 'set-block',
  templateUrl: './set-block.component.html',
  styleUrls: ['./set-block.component.scss'],
  animations: [
    trigger('setBehavior', [
      state('init', style({transform : 'translateX(0px)'})),
      state('float', style({})),
      transition('float => init', [
        animate('500ms 0s ease-out')
      ])
    ])
  ]
})
export class SetBlockComponent implements AfterViewInit {

  @Input() labels : ExerciseSetType = {w : '', r : ''}
  @Input() values : ExerciseSetType | null = null;
  @Output() deleteSet : EventEmitter<boolean> = new EventEmitter<boolean>()
  @ViewChild('set', { static: false }) setElement!: ElementRef;
  positionX = 0;
  offsetX = 0;
  isMoove : boolean = false;
  


  constructor() { }

  ngAfterViewInit(): void {
    // this.setElement.nativeElement.addEventListener('touchstart', this.onTouchMove.bind(this), { passive: false });
    this.setElement.nativeElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    // this.setElement.nativeElement.addEventListener('touchend', this.onTouchMove.bind(this));
  }


 

  onTouchStart(event: TouchEvent) {
    if(!this.values) return
    const touch = event.touches[0];
    this.offsetX = touch.clientX - this.positionX;

    const initX = touch.clientX;
    const initY = touch.clientY;
    setTimeout(() => {
        this.setElement.nativeElement.addEventListener('touchmove', (event : TouchEvent) => {
            const offsetY = event.touches[0].clientY - initY;
            const offsetX = event.touches[0].clientX - initX;
            const corner = Math.atan(Math.abs(offsetY) / Math.abs(offsetX)) * 180 / Math.PI;
            if (corner < 20) {
                event.preventDefault();
                (document.activeElement as HTMLElement).blur();
                this.isMoove = true;
            }
        }, { once: true, passive: false  })
    }, 0)
  }

  onTouchMove(event: TouchEvent) {
    if(!this.isMoove || !this.values) return
    event.preventDefault(); 

    const touch = event.touches[0];
    this.positionX = touch.clientX - this.offsetX;

    if(this.positionX < -150) this.positionX = -150;
    if(this.positionX > 0) this.positionX = 0;

    this.setElement.nativeElement.style.transform = `translateX(${this.positionX}px)`;
  }

  onTouchEnd() {
    if( !this.values) return
    if(this.positionX < -100) {
      this.deleteSet.next(true);
    } 
    this.positionX = 0
    this.isMoove = false;
  }



}





