import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template:
    `
    <div class="flex justify-center w-full">
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>

    <footer class="fixed bottom-0 w-full">
      <div class="w-full flex justify-center">
        <a class="flex justify-center gap-2 items-center p-2 px-10" href="https://ng-journal.com">
            <img src="/ng-journal.png" width="50" height="50" alt="Ng Journal Logo"  /> <span class="text-md font-semibold">NG Journal</span>
        </a>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        place-items: center;
        min-width: 320px;
        min-height: 100vh;
      }
    `
  ],
})
export default class LayoutComponent {

}
