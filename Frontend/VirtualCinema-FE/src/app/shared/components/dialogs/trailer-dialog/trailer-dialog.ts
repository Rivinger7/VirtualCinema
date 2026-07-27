import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-trailer-dialog',
  imports: [],
  templateUrl: './trailer-dialog.html',
})
export class TrailerDialog {
  private readonly sanitizer = inject(DomSanitizer);

  readonly trailerKey = inject<string>(MAT_DIALOG_DATA);

  readonly safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube.com/embed/${this.trailerKey}?autoplay=1`,
  );
}
