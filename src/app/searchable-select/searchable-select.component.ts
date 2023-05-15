import {
  Component, Input, Output, EventEmitter, ViewChild, ContentChild,
  AfterViewInit, OnChanges, ElementRef, NgZone, HostListener
} from '@angular/core';
import { SearchableSelectTemplateDirective } from './searchable-select-template.directive';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gpf-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.css']
})
export class SearchableSelectComponent implements AfterViewInit, OnChanges {
  @Input() public data: Array<any>;
  @Input() public caption: string;
  @Input() public isInGeneBrowser = false;
  @Input() public showLoadingSpinner: boolean;
  @Input() private hideDropdown: boolean;
  @Output() private search = new EventEmitter();
  @Output() private selectItem = new EventEmitter();
  @Output() public focusEvent = new EventEmitter();
  @ViewChild(NgbDropdown) private dropdown: NgbDropdown;
  @ViewChild('searchBox') private searchBox: ElementRef;
  @ContentChild(SearchableSelectTemplateDirective) public template: SearchableSelectTemplateDirective;

  @HostListener('document:click', ['$event'])
  public clickout(event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdown.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  public clearSearch($event): void {
    if ($event.key === 'Escape' || $event.key === 'Esc') {
      // eslint-disable-next-line
      $event.preventDefault();
      (this.searchBox.nativeElement as HTMLInputElement).value = '';
      this.search.emit('');
      if (this.dropdown.isOpen() === true) {
        this.dropdown.close();
      }
    }
  }

  public onEnterPress(): void {
    if (this.isInGeneBrowser) {
      this.onSelect(this.searchBox.nativeElement.value);
      this.dropdown.close();
    }
  }

  public constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private eRef: ElementRef
  ) {}

  public ngOnChanges(): void {
    if (this.hideDropdown) {
      this.dropdown.close();
    }
  }

  public ngAfterViewInit(): void {
    // temporary solution, fix along side issue GPF-1102
    if (!(this.isInGeneBrowser && this.route.snapshot.params.gene)) {
      this.focusSearchBox();
    }

    this.dropdown.autoClose = 'inside';
  }

  public searchBoxChange(searchFieldValue): void {
    this.search.emit(searchFieldValue);
  }

  public onFocus(event): void {
    this.searchBoxChange('');
    event.stopPropagation();

    this.ngZone.run(() => {
      if (!this.dropdown.isOpen()) {
        this.dropdown.open();
      }
    });
    setTimeout(() => {
      this.searchBox.nativeElement.focus();
    });
    this.onSelect(null);
    this.focusEvent.emit();
  }

  public onSelect(value): void {
    this.selectItem.emit(value);
  }

  private async waitForSearchBoxToLoad(): Promise<void> {
    return new Promise<void>(resolve => {
      const timer = setInterval(() => {
        if (this.searchBox !== undefined) {
          resolve();
          clearInterval(timer);
        }
      }, 200);
    });
  }

  private focusSearchBox(): void {
    this.waitForSearchBoxToLoad().then(() => {
      this.searchBox.nativeElement.focus();
    });
  }
}
