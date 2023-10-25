import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import {UserService, UserStats} from "./user.service";
import {filter, map, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="stats$ | async">
      <a
        class="flex flex-col sm:bg-neutral-700 sm:shadow-2xl sm:rounded-xl sm:flex-row gap-4 sm:gap-16 p-4 sm:p-8 sm:px-16"
        [href]="'https://github.com/' + (userName$ | async)"
      >
        <div>
          <img
            [src]="profileImage$ | async"
            alt="github profile image"
            class="rounded-full mx-auto w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
          />

          <h1 class="font-semibold text-3xl text-center mt-4">{{userName$ | async}}</h1>
        </div>

        <div class="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-6 justify-evenly p-2 px-4 sm:p-4 sm:px-8 ">

          <div class="text-2xl sm:text-4xl flex flex-col gap-1 mb-4" *ngIf="{level: level$ | async} as vm">
            <span class="">Level {{ vm.level }}</span>
            <div class="flex gap-3 text-xl sm:text-3xl flex-wrap">
              <span *ngFor="let item of [].constructor(vm.level)">
                🎸
              </span>
            </div>
          </div>

          <div class="text-2xl sm:text-4xl flex flex-col gap-4" *ngIf="stats$ | async as stats">
            <div>⭐ {{stats.stars | number}} </div>
            <div>🍴 {{stats.forks | number}} </div>
          </div>
        </div>
      </a>

      <div class="flex justify-center mt-12 sm:mt-24 mb-12 sm:mb-24">
        <button
          type="button"
          class="p-2 sm:p-4 px-4 sm:px-8 rounded-lg border-2 border-neutral-500 text-xl hover:bg-neutral-500 hover:text-neutral-100 transition-colors"
          routerLink="/"
        >
          Discover more GitHub rockstars 👩‍🎤
        </button>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export default class UserDetailsComponent {
  readonly #userService = inject(UserService);
  readonly #route = inject(ActivatedRoute);

  readonly userName$ = this.#route.paramMap.pipe(
    map((params) => params.get('userName')),
    filter((username): username is string => !!username)
  );

  readonly stats$ = this.userName$.pipe(
    switchMap((username) => this.#userService.getStats(username))
  );

  readonly profileImage$ = this.userName$.pipe(
    map((username) => this.#userService.getProfileImageUrl(username))
  );

  readonly level$ = this.stats$.pipe(
    filter((stats): stats is UserStats => !!stats),
    map((stats) => this.getLevel(stats.stars))
  );

  getLevel(stars: number): number {
    return stars ? Math.floor(Math.log10(stars)) + 1 : 0;
  }
}
