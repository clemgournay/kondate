import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // Icons
  faBars = faBars;

}
