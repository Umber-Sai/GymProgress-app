import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
      ]),
      transition(':enter', [
        style({ height: '0px', padding : 0, margin : 0,  opacity: '0' }),
        animate('300ms',
          keyframes([
            style({ height: '0px', padding : 0, margin : 0, opacity: '0' }),
            style({ height: '*', padding : '*', margin : '*', opacity: '0' }),
            style({ height: '*', opacity: '*' }),
          ])
        )
      ])
    ])
  ]
})
export class SetBlockComponent implements OnInit {

  @Input() labels : ExerciseSetType = {w : '', r : ''}
  @Input() values : ExerciseSetType | null = null;
  @Output() deleteSet : EventEmitter<boolean> = new EventEmitter<boolean>()
  positionX = 0;
  offsetX = 0;
  isMoove : boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

 

  onTouchStart(event: TouchEvent, target : HTMLElement) {
    if(!this.values) return
    const touch = event.touches[0];
    this.offsetX = touch.clientX - this.positionX;

    const initX = touch.clientX;
    const initY = touch.clientY;
    setTimeout(() => {
        target.addEventListener('touchmove', (event) => {
            const offsetY = event.touches[0].clientY - initY;
            const offsetX = event.touches[0].clientX - initX;
            const corner = Math.atan(Math.abs(offsetY) / Math.abs(offsetX)) * 180 / Math.PI;
            if (corner < 80) {
                event.preventDefault();
                (document.activeElement as HTMLElement).blur();
                this.isMoove = true;
            }
        }, { once: true })
    }, 0)
  }

  onTouchMove(event: TouchEvent, target : HTMLElement) {
    if(!this.isMoove || !this.values) return
    event.preventDefault(); 

    const touch = event.touches[0];
    this.positionX = touch.clientX - this.offsetX;

    if(this.positionX < -150) this.positionX = -150;
    if(this.positionX > 0) this.positionX = 0;

    target.style.transform = `translateX(${this.positionX}px)`;
  }

  onTouchEnd(event: TouchEvent, target : HTMLElement) {
    if( !this.values) return
    if(this.positionX < -100) {
      this.deleteSet.next(true);
    } 
    this.positionX = 0
    this.isMoove = false;
  }



}





