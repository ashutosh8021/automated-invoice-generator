import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-file-invoice-dollar"></i> {{ companyInfo.companyName }}
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" aria-controls="navbarNav" 
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/invoices" routerLinkActive="active">
                <i class="fas fa-file-invoice"></i> Invoices
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                 data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-cog"></i> Settings
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" routerLink="/settings/company">
                    <i class="fas fa-building"></i> Company Settings
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  companyInfo = environment;
}
