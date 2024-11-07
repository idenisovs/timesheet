import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {
  private colorMode = 'light';

  get ColorMode() {
    return this.colorMode;
  }

  constructor() { }

  public loadColorMode() {
    this.colorMode = localStorage.getItem('color-mode') ?? 'light';

    document.documentElement.setAttribute('data-bs-theme', this.colorMode);

    this.saveColorMode();
  }

  public toggleMode() {
    this.colorMode = this.colorMode === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-bs-theme', this.colorMode);

    this.saveColorMode();
  }

  private saveColorMode() {
    localStorage.setItem('color-mode', this.colorMode);
  }
}
