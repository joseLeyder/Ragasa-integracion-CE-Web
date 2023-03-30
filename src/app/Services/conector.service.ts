import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConectorService {
  public spinner$ = new BehaviorSubject<boolean>(false);
  public title$ = new BehaviorSubject<string>("");

  constructor() { }
}
