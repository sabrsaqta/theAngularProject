import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {

  // subject хранит текущее состояние сети - онлайн: true, офлайн: false
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);
  //поток для подписки на изменение статуса сети
  isOnline$ = this.onlineStatus.asObservable();

  constructor() {
    //потоки из событий онлайн/офлайн
    const onlineEvent = fromEvent(window, 'online').pipe(map(() => true));
    const offlineEvent = fromEvent(window, 'offline').pipe(map(() => false));

    // объединяем их и подписываемся для обновления Subject
    merge(onlineEvent, offlineEvent).subscribe(isOnline => {
      this.onlineStatus.next(isOnline);
    });
  }

  get isOnline(): boolean {
    return this.onlineStatus.getValue();
  }
}