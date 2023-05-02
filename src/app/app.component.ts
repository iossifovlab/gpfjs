import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../environments/environment';
import { BnNgIdleService } from 'bn-ng-idle';
import { UsersService } from './users/users.service';
import { switchMap } from 'rxjs/operators';
import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';
import { AgpTableConfig } from './autism-gene-profiles-table/autism-gene-profiles-table';
import { AgpTableService } from './autism-gene-profiles-table/autism-gene-profiles-table.service';
import { APP_BASE_HREF } from '@angular/common';
import * as streamSaver from 'streamsaver';

@Component({
  selector: 'gpf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'fromLeft',
      [
        transition(
          ':enter', [
            style({transform: 'translateX(-100%)'}),
            animate('250ms ease-in-out', style({transform: 'translateX(0)'}))
          ]
        ),
        transition(
          ':leave', [
            style({transform: 'translateX(0)'}),
            animate('250ms ease-in-out', style({transform: 'translateX(-100%)'})),
          ]
        )
      ]
    ),
    trigger(
      'fadeInOut',
      [
        transition(
          ':enter', [
            style({opacity: 0}),
            animate('250ms ease-in-out', style({opacity: 1}))
          ]
        ),
        transition(
          ':leave', [
            style({opacity: 1}),
            animate('250ms ease-in-out', style({opacity: 0})),
          ]
        )
      ]
    )
  ]
})
export class AppComponent implements OnInit {
  public showSidenav = false;
  public title = 'GPF: Genotypes and Phenotypes in Families';
  public imgPathPrefix = environment.imgPathPrefix;
  public agpConfig: AgpTableConfig;
  private sessionTimeoutInSeconds = 7 * 24 * 60 * 60; // 1 week

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    this.hideSidenav();
  }

  @HostListener('document:keydown.escape')
  public onEscapeButtonPress(): void {
    this.hideSidenav();
  }

  @HostListener('window:keydown.home')
  public scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  @HostListener('window:keydown.end')
  public scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }

  public constructor(
    private autismGeneProfilesService: AgpTableService,
    private bnIdle: BnNgIdleService,
    private usersService: UsersService,
    private ngbNavConfig: NgbNavConfig,
    @Inject(APP_BASE_HREF) private baseHref: string,
  ) {
    ngbNavConfig.animation = false;
    streamSaver.mitm = environment.basePath + baseHref + 'mitm';
  }

  public ngOnInit(): void {
    this.bnIdle.startWatching(this.sessionTimeoutInSeconds)
      .pipe(
        switchMap(() => this.usersService.logout()),
        switchMap(() => this.usersService.getUserInfo()),
      ).subscribe();

    this.autismGeneProfilesService.getConfig().subscribe(res => {
      this.agpConfig = res;
    });
  }

  public hideSidenav(): void {
    this.showSidenav = false;
  }

  public toggleSidenav(): void {
    this.showSidenav = !this.showSidenav;
  }
}
