import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, search: string): any {
    if (!search || !text) return text;
    
    search.split(" ").map(s => {
      text = this.highlightOne(text, s);
    })
    return text;
    //return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  highlightOne(text: string, search: string) {
    // Escape special characters in search string
    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(escapedSearch, 'gi');
    
    const highlighted = text.replace(re, (match) => `<mark>${match}</mark>`);
    return highlighted;
  }
}