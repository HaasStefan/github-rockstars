import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {catchError, debounceTime, distinctUntilChanged, filter, map, of, Subject, switchMap, takeUntil} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {UserService, UserStats} from "../user/user.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `

    <div class="flex justify-center text-7xl sm:text-8xl mb-4">👩‍🎤</div>
    <h1 class="font-bold text-4xl sm:text-6xl">GitHub Rockstars</h1>

    <input
      type="text"
      class="mt-4 p-4 rounded-lg w-full"
      [ngClass]="{ 'border-2 border-red-500': input.invalid }"
      [formControl]="input"
      (keyup.enter)="searchManual(input.getRawValue())"
      placeholder="GitHub username"
    />

    <div class="flex gap-4 font-semibold justify-center text-xl sm:text-2xl p-4">
      <div class="flex gap-2">
        <div>⭐</div>
        Stars
      </div>
      <div class="flex gap-2">
        <div>🍴</div>
        Forks
      </div>
    </div>

  `,
  styles: [],
})
export default class IndexComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #userService = inject(UserService);
  readonly #destroyRef = inject(DestroyRef);
  input = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.#userService.bustCache();

    this.input.valueChanges.pipe(
      debounceTime(1800),
      distinctUntilChanged(),
      filter((userName) => userName.length > 0),
      switchMap((userName) => this.#userService.getStats(userName).pipe(
        map((stats) => ({userName, stats})),
        catchError((error) => of({userName, stats: null}))
      )),
      takeUntilDestroyed(this.#destroyRef),
    ).subscribe(this.#search.bind(this));
  }

  searchManual(userName: string): void {
    if (userName.length > 0) {
      this.#userService.getStats(userName).pipe(
        map((stats) => ({userName, stats})),
        catchError((error) => of({userName, stats: null})),
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe(this.#search.bind(this));
    }
  }

  #search({stats, userName }: {stats: UserStats | null, userName: string}): void {
    if (!stats) {
      this.input.setErrors({notFound: true});
      return;
    } else if (this.input.hasError('notFound')) {
      this.input.setErrors(null);
    }

    this.#router.navigate(['./user', userName]);
  }
}
