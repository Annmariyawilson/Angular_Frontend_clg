import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-homeone-banner',
  templateUrl: './homeone-banner.component.html',
  styleUrls: ['./homeone-banner.component.scss']
})
export class HomeoneBannerComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor() { }

  ngOnInit(): void {

  }

  toggleVideo(): void {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

}
