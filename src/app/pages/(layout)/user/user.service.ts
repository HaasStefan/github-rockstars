import {inject, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";

export type UserStats = {
  stars: number,
  forks: number
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly #http = inject(HttpClient);
  readonly #statsBaseUrl = 'https://api.github-star-counter.workers.dev/user/';

  readonly #stats$$ = new BehaviorSubject<UserStats | null >(null);

  getProfileImageUrl(username: string) {
    return `https://avatars.githubusercontent.com/${username}`;
  }

  getStats(username: string) {
    return this.#stats$$.getValue() ?
      this.#stats$$.asObservable() :
      this.#http.get<UserStats>(this.#statsBaseUrl + username).pipe(
        tap((stats) => this.#stats$$.next(stats))
      );
  }

  bustCache(){
    this.#stats$$.next(null);
  }
}
