import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {SearchResult} from './search-result.model';
import {YouTubeSearchService} from './youtube-search.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-search-box',
  template: `<input type="text" class="form-control" placeholder="Search youtube" autofocus>`
})
export class SearchBoxComponent implements OnInit {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  ngOnInit(): void {
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .filter((text: string) => text.length > 1)
      .debounceTime(250)
      .do(() => this.loading.next(true))
      .map((query: string) => this.youtube.search(query))
      .switch()
      .subscribe(
        (results: SearchResult[]) => {
          this.loading.next(false);
          this.results.next(results);
        },
        (err: any) => {
          console.log(err);
          this.loading.next(false);
        },
        () => {
          this.loading.next(false);
        }
      );
  }

  constructor(private youtube: YouTubeSearchService, private el: ElementRef) {
  }
}

