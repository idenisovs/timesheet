import { EventEmitter, Injectable } from '@angular/core';
import { Actions } from './Actions';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  on = new EventEmitter<Actions>();

  constructor() { }
}
