import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-img-intro',
  templateUrl: './img-intro.component.html',
  styleUrls: ['./img-intro.component.css']
})
export class ImgIntroComponent implements OnInit {
  @Input() src = 'https://images.pexels.com/photos/162140/duckling-birds-yellow-fluffy-162140.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500';
  @Input() title = '[Title]';
  @Input() subTitle = '[subTitle]';

  constructor() { }

  ngOnInit() {
  }

}
