import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                  <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/clients" routerLinkActive="active">
                  <i class="fas fa-users"></i> Clients
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/invoices" routerLinkActive="active">
                  <i class="fas fa-file-invoice"></i> Invoices
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Invoice Generator';
}
