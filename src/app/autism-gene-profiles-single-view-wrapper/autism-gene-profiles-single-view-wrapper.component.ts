import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutismGeneProfilesService } from 'app/autism-gene-profiles-block/autism-gene-profiles.service';
import { AgpSingleViewConfig } from 'app/autism-gene-profiles-single-view/autism-gene-profile-single-view';
import { Observable } from 'rxjs';

@Component({
  selector: 'gpf-autism-gene-profiles-single-view-wrapper',
  templateUrl: './autism-gene-profiles-single-view-wrapper.component.html',
  styleUrls: ['./autism-gene-profiles-single-view-wrapper.component.css']
})
export class AutismGeneProfileSingleViewWrapperComponent implements OnInit, AfterViewInit {
  public $autismGeneToolConfig: Observable<AgpSingleViewConfig>;
  public geneSymbols = new Set<string>();

  public constructor(
    private autismGeneProfilesService: AutismGeneProfilesService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.$autismGeneToolConfig = this.autismGeneProfilesService.getConfig();
  }

  public ngAfterViewInit(): void {
    this.geneSymbols = new Set(
      this.route.snapshot.params.genes
        .split(',')
        .filter(p => p)
        .map(p => p.trim().toUpperCase())
    );
  }
}