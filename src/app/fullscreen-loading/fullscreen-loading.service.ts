// Loosely based on https://github.com/oxycoder/ng2-loading-animate

import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FullscreenLoadingService {
  @Output()
  public loadingStateChange: BehaviorSubject<string> = new BehaviorSubject<string>('stop');

  public setLoadingStart(): void {
    this.loadingStateChange.next('loading');
  }

  public setLoadingStop(): void {
    this.loadingStateChange.next('stop');
  }

  public setLoadingBreak(): void {
    this.loadingStateChange.next('break');
  }
}
