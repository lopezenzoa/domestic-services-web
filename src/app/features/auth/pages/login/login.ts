import { Component } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LottieComponent], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  options: AnimationOptions = {
    path: '/assets/animations/login-animation.json'
  };

  animation: any;

  onAnimate(anim: any) {
    this.animation = anim;
  }

  play() {
    this.animation?.play();
  }

  pause() {
    this.animation?.pause();
  }
}
