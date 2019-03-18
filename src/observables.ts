import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export const getClickObservable = (id: string) => fromEvent(document.getElementById(id) || window, 'click')

export const debounce = (source$: Observable<any>, time: number) => source$.pipe(debounceTime(time))

export const subscribeNext = (source$: Observable<any>, next: (value: any) => void) => source$.subscribe({ next })



