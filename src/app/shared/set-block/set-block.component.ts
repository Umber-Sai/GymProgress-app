import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { ExerciseSetType } from 'src/app/type/exercise-history.type';

@Component({
  selector: 'set-block',
  templateUrl: './set-block.component.html',
  styleUrls: ['./set-block.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow',
        }),
      ),
      state(
        'closed',
        style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue',
        }),
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')]),
    ]),
    trigger('swipe', [
      transition(':increment', [
        animate('50ms', style({ transform: 'translateX({{x}}px)' }))
      ]),
      transition(':decrement', [
        animate('50ms', style({ transform: 'translateX({{x}}px)' }))
      ])
    ])
  ]
})
export class SetBlockComponent implements OnInit {

  @Input() labels : ExerciseSetType = {w : '', r : ''}
  @Input() values : ExerciseSetType | null = null;
  @Input() disabled : boolean = false;
  @Output() deleteSet : EventEmitter<boolean> = new EventEmitter<boolean>()
  positionX = 0;
  offsetX = 0;
  isMoove : boolean = false;


  // @HostBinding('@fadeOut') fadeOutAnimation = true;


  constructor() { }

  ngOnInit(): void {
  }

 

  onTouchStart(event: TouchEvent, target : HTMLElement) {
    if(this.disabled || !this.values) return
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
        }, { once: true, passive : false })
    }, 0)
  }

  onTouchMove(event: TouchEvent, target : HTMLElement) {
    if(!this.isMoove || this.disabled || !this.values) return
    event.preventDefault(); 

    const touch = event.touches[0];
    this.positionX = touch.clientX - this.offsetX;
    // Обновляем позицию элемента
    if(this.positionX < -150) this.positionX = -150;
    if(this.positionX > 0) this.positionX = 0;

    target.style.transform = `translateX(${this.positionX}px)`;
  }

  onTouchEnd(event: TouchEvent, target : HTMLElement) {
    if(this.disabled || !this.values) return
    console.log('Конечная позиция:', this.positionX);
    target.style.transition = 'all .5s'
    target.style.transform = `translateX(0px)`;
    if(this.positionX < -100) {
      this.deleteSet.next(true);
    } 
    setTimeout(() => {
      target.style.transition = 'none';
    }, 500)
    this.positionX = 0
    this.isMoove = false;
  }



}





