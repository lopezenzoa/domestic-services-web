import { Component, inject, OnInit, signal } from '@angular/core';
import { CallService } from '../../services/call-service';
import { Router } from '@angular/router';
import { Call } from '../../models/Call';
import {  NgClass, DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-call-list',
  standalone:true,
  imports: [NgClass, DatePipe, NgIf],
  templateUrl: './call-list.html',
  styleUrl: './call-list.css',
})
export class CallList implements OnInit {
  calls = signal<Call[] | undefined>(undefined);
  service = inject(CallService);
  router = inject(Router);

  ngOnInit() {
    this.getMyCalls();
  }

  getMyCalls() {
    return this.service.getMyCalls().subscribe((calls) => {
      this.calls.set(calls);
    });
  }
}
