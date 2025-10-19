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
    path: 'assets/animations/login-animations.json'
  }
  animations: any;

  onAnimate(anim:any){
    this.animations = anim;
  }
  play(){
    this.animations?.play();
  }
  pause(){
    this.animations?.pause();
  }
}

