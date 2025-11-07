import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FacilitiesService } from '../../services/facilities-service';
import { Facilities } from '../../models/facilities.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-facilities-list',
  imports: [RouterLink],
  templateUrl: './facilities-list.html',
  styleUrl: './facilities-list.css'
})
export class FacilitiesList {
  service: FacilitiesService = inject(FacilitiesService);
  facilitiesList: WritableSignal<Facilities[]> = signal([]);

  constructor() {
    this.service.getAll().subscribe((res: Facilities[]) => {
      this.facilitiesList.set(res);
    });
  }
}
