import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.scss'],
})
export class FeedBackComponent  implements OnInit {

  feedbacks = [
    {
      comentario: '¡Gran aplicación! Me encanta la interfaz.',
      fecha: new Date('2025-02-10'),
      valoracion: 5
    },
    {
      comentario: 'La funcionalidad es buena, pero podría mejorar el rendimiento.',
      fecha: new Date('2025-02-08'),
      valoracion: 4
    },
    {
      comentario: 'No me ha convencido mucho. Hay fallos en la navegación.',
      fecha: new Date('2025-02-06'),
      valoracion: 2
    }
  ];
  
  constructor() { }

  ngOnInit() {}

}
