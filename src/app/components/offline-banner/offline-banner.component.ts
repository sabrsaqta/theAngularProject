import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectivityService } from '../../services/connectivity.service'; 

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline-banner.component.html',
  styleUrl: './offline-banner.component.css'
})
export class OfflineBannerComponent {
  constructor(public connectivityService: ConnectivityService) {}
}