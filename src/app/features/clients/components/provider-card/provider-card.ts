import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-provider-card', 
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./provider-card.html",
  styleUrl: "./provider-card.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderCardComponent {

  @Input() provider: any;
}