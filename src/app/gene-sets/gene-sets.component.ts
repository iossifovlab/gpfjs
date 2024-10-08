import { GeneSetsLocalState } from './gene-sets-local-state';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneSetsService } from './gene-sets.service';
import { GeneSetsCollection, GeneSet, GeneSetTypeNode, GeneSetType } from './gene-sets';
import { Subject, Observable, combineLatest, of } from 'rxjs';
import { ValidateNested } from 'class-validator';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { selectDatasetId } from 'app/datasets/datasets.state';
import { ComponentValidator } from 'app/common/component-validator';
import { selectGeneSets, setGeneSetsValues } from './gene-sets.state';
import { cloneDeep } from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatasetsTreeService } from 'app/datasets/datasets-tree.service';
import { DatasetHierarchy } from 'app/datasets/datasets';

@Component({
  selector: 'gpf-gene-sets',
  templateUrl: './gene-sets.component.html',
  styleUrls: ['./gene-sets.component.css']
})
export class GeneSetsComponent extends ComponentValidator implements OnInit {
  public geneSetsCollections: Array<GeneSetsCollection>;
  public geneSets: Array<GeneSet>;
  public searchQuery: string;
  public isLoading = true;
  public isDropdownOpen = false;
  @ViewChild('dropdownTrigger') private dropdownTrigger: MatAutocompleteTrigger;
  @ViewChild('searchSetsBox') private searchBox: ElementRef;
  public modal: NgbModalRef;
  @ViewChild('denovoModal') public denovoModal: ElementRef;
  public studiesList = new Set<string>();
  public selectedGeneType: GeneSetTypeNode;
  public expandedGeneTypes: GeneSetTypeNode[] = [];
  public denovoGeneSetTypes: GeneSetTypeNode[] = [];

  public geneSetsQueryChange$ = new Subject<[string, string, object]>();
  private geneSetsResult: Observable<GeneSet[]>;

  private selectedDatasetId: string;
  public downloadUrl: string;
  public geneSetsLoaded = 0;

  public imgPathPrefix = environment.imgPathPrefix;

  @ValidateNested()
  public geneSetsLocalState = new GeneSetsLocalState();

  // The template needs local component reference to use Object static methods
  public object = Object;

  public constructor(
    protected store: Store,
    private geneSetsService: GeneSetsService,
    public modalService: NgbModal,
    private datasetsTreeService: DatasetsTreeService,
  ) {
    super(store, 'geneSets', selectGeneSets);
  }

  public ngOnInit(): void {
    this.geneSetsLoaded = null;
    super.ngOnInit();


    combineLatest([
      this.datasetsTreeService.getDatasetHierarchy(),
      this.geneSetsService.getDenovoGeneSets(),
      this.store.select(selectDatasetId).pipe(take(1)),
    ]).pipe(
      switchMap(([hierarchies, denovoGeneSets, datasetIdState]) => {
        const datasetIdStateClone = cloneDeep(datasetIdState);
        this.selectedDatasetId = datasetIdStateClone;

        const denovoTypesHierarchy: GeneSetTypeNode[] = [];
        hierarchies.forEach(hierarchy => denovoTypesHierarchy.push(this.createDenovoGeneSetTypeHierarchy(hierarchy, denovoGeneSets)));
        return combineLatest([
          of(denovoTypesHierarchy),
          this.geneSetsService.getGeneSetsCollections(),
          this.store.select(selectGeneSets).pipe(take(1)),
          of(denovoGeneSets)
        ])
      })
    ).subscribe(([denovoGeneSetTypesHierarchy, geneSetsCollections, geneSetsState, denovoGeneSets]) => {
      let geneSetsCollectionsClone = cloneDeep(geneSetsCollections);
      const geneSetsStateClone = cloneDeep(geneSetsState);

      this.denovoGeneSetTypes = denovoGeneSetTypesHierarchy;

      if (this.denovoGeneSetTypes.length) {
        this.selectedGeneType = this.selectedGeneType || this.denovoGeneSetTypes[0];
        //  if (this.selectedGeneType && this.selectedGeneType.children.length) {
        //   this.expandedGeneTypes.push(this.selectedGeneType);
        // }
      }

      this.geneSetsCollections = geneSetsCollectionsClone;
      this.selectedGeneSetsCollection = geneSetsCollectionsClone[0];

      if (geneSetsStateClone.geneSet) {
        this.restoreState(geneSetsStateClone);
      } else {
        const type = denovoGeneSets.find(geneSet => geneSet.datasetId === this.selectedDatasetId);
        if(type) {
          this.setSelectedGeneType(type.datasetId, type.personSetCollections[0].personSetCollectionId, type.personSetCollections[0].personSetCollectionLegend[0].id, true)
        }
      }
      this.geneSetsLoaded = geneSetsCollectionsClone.length;
    });

    this.geneSetsResult = this.geneSetsQueryChange$.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      switchMap(term => {
        return this.geneSetsService.getGeneSets(term[0], term[1], term[2]);
      }),
      catchError(error => {
        console.warn(error);
        return of(null);
      })
    );

    this.geneSetsResult.subscribe(geneSets => {
      this.geneSets = geneSets.sort((a, b) => a.name.localeCompare(b.name));
      this.store.select(selectGeneSets).pipe(take(1)).subscribe(geneSetsState => {
        const geneSetsStateClone = cloneDeep(geneSetsState);
        if (!geneSetsStateClone || !geneSetsStateClone.geneSet) {
          this.isLoading = false;
          return;
        }
        for (const geneSet of this.geneSets) {
          if (geneSet.name === geneSetsStateClone.geneSet.name) {
            this.geneSetsLocalState.geneSet = geneSet;
            this.isLoading = false;
          }
        }
      });
    });
  }

  private createDenovoGeneSetTypeHierarchy(hierarchy: DatasetHierarchy, denovoGeneSetsTypes: GeneSetType[]): GeneSetTypeNode {
    if (!hierarchy) {
      return null;
    }

    let children: GeneSetTypeNode[] = [];
    if (hierarchy.children) {
      children = hierarchy.children
        .map(child => this.createDenovoGeneSetTypeHierarchy(child, denovoGeneSetsTypes));
    }

    const newGeneSetTypeNode = new GeneSetTypeNode(
      hierarchy.id,
      hierarchy.name,
      denovoGeneSetsTypes.find(type => type.datasetId === hierarchy.id)?.personSetCollections || [],
      children
    );
  
    // if(hierarchy.id === this.selectedDatasetId) {
    //   this.selectedGeneType = newGeneSetTypeNode;
    // }
    return newGeneSetTypeNode;
  }

  private restoreState(state: {
    geneSetsTypes: GeneSetTypeNode[];
    geneSetsCollection: GeneSetsCollection;
    geneSet: GeneSet;
}): void {
    if (state.geneSet && state.geneSetsCollection) {
      for (const geneSetCollection of this.geneSetsCollections) {
        if (geneSetCollection.name === state.geneSetsCollection.name) {
          this.selectedGeneSetsCollection = geneSetCollection;
          if (state.geneSetsTypes) {
            this.restoreGeneTypes(state.geneSetsTypes, geneSetCollection);
          }
          // the gene set must be restored last, as that triggers the state update
          // otherwise, sharing a restored state won't work properly
          this.selectedGeneSet = state.geneSet;
          this.onSearch();
        }
      }
    } else {
      this.onSearch();
    }
  }

  private restoreGeneTypes(geneSetsTypes: GeneSetTypeNode[], geneSetCollection: GeneSetsCollection): void {
    this.studiesList.clear();
    let restoredGeneTypes:GeneSetTypeNode[] = [];
    geneSetCollection.types
      .forEach(geneType => {
        if(geneType.datasetId in geneSetsTypes) {
          restoredGeneTypes.push(geneType);
        }
        restoredGeneTypes.push(...this.restoreAll(geneType, geneSetsTypes));
      });
    if (restoredGeneTypes.length !== 0) {
      this.geneSetsLocalState.geneSetsTypes = Object.create(null);
      for (const geneType of restoredGeneTypes) {
        const datasetId = geneType.datasetId;
        geneType.personSetCollections.forEach(collection => {
          const personSetCollectionId = collection.personSetCollectionId;
          for (const personSet of collection.personSetCollectionLegend) {
            if (geneSetsTypes[datasetId][personSetCollectionId].indexOf(personSet.id) > -1) { 
              this.studiesList.add(`${datasetId}: ${personSetCollectionId}: ${personSet.id}`);
              this.setSelectedGeneType(datasetId, personSetCollectionId, personSet.id, true);
            }
          }
        })
      }
    }
  }

  private restoreAll(type: GeneSetTypeNode, geneSetsTypes: GeneSetTypeNode[]): GeneSetTypeNode[] {
    let restoredChildren = [];
    if(!(type.datasetId in geneSetsTypes) && !type.children) {
      return restoredChildren;
    }

    if(type.datasetId in geneSetsTypes) {
      restoredChildren.push(type);
    }

    if(type.children) {
      type.children.forEach(child => {
        restoredChildren = restoredChildren.concat(this.restoreAll(child, geneSetsTypes));
      });
    }
    return restoredChildren;
  }

  public reset(): void {
    this.searchQuery = '';
    this.selectedGeneSet = null;
    this.isDropdownOpen = true;
    this.onSearch();
  }

  public openCloseDropdown(): void {
    this.isDropdownOpen = !this.dropdownTrigger.panelOpen;
    if (!this.isDropdownOpen) {
      this.dropdownTrigger.closePanel();
    } else {
      this.dropdownTrigger.openPanel();
    }
  }

  public onKeyboardEvent(event: KeyboardEvent): void {
    if (!(event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight')) {
      this.onSearch();
    }
  }

  public onSearch(): void {
    if (!this.selectedGeneSetsCollection) {
      return;
    }

    if (this.geneSets) {
      this.geneSets = this.geneSets.filter(
        (value) => value.name.indexOf(this.searchQuery) >= 0 || value.desc.indexOf(this.searchQuery) >= 0
      );
    }

    this.isLoading = true;
    this.geneSetsQueryChange$.next(
      [this.selectedGeneSetsCollection.name, this.searchQuery, this.geneSetsLocalState.geneSetsTypes as GeneSetTypeNode[]]
    );
  }

  public onSelect(event: GeneSet): void {
    this.isDropdownOpen = false;
    (this.searchBox.nativeElement as HTMLElement).blur();
    this.selectedGeneSet = event;
    if (event === null) {
      this.onSearch();
    }
  }

  public openModal(): void {
    if (this.modalService.hasOpenModals()) {
      return;
    }
    this.modal = this.modalService.open(
      this.denovoModal,
      {animation: false, centered: true, windowClass: 'denovo-modal'}
    );
  }

  public toggleDatasetCollapse(selectedType: GeneSetTypeNode): void {
    if(!this.expandedGeneTypes.includes(selectedType)) {
      this.expandedGeneTypes.push(selectedType);
    } else {
      this.hideAll(selectedType)
    }
  }

  private hideAll(type: GeneSetTypeNode): void {
    if(!type.children.length) {
      return;
    }
    if(this.expandedGeneTypes.includes(type)) {
      this.expandedGeneTypes.splice(this.expandedGeneTypes.indexOf(type), 1);
      type.children.forEach(child => {
        this.hideAll(child);
      })
    }
  }

  public select(type: GeneSetTypeNode): void {
    this.selectedGeneType = type;
  }

  public removeFromList(study: string): void {
    const removedStudyInfo = study.split(': ');
    this.setSelectedGeneType(removedStudyInfo[0], removedStudyInfo[1], removedStudyInfo[2], false);
  }

  public isSelectedGeneType(datasetId: string, personSetCollectionId: string, geneType: string): boolean {
    return this.geneSetsLocalState.isSelected(datasetId, personSetCollectionId, geneType);
  }

  public setSelectedGeneType(datasetId: string, personSetCollectionId: string, geneType: string, value: boolean): void {
    this.selectedGeneSet = null;
    this.searchQuery = '';
    if (value) {
      this.studiesList.add(`${datasetId}: ${personSetCollectionId}: ${geneType}`);
      this.geneSetsLocalState.select(datasetId, personSetCollectionId, geneType);
    } else {
      this.studiesList.delete(`${datasetId}: ${personSetCollectionId}: ${geneType}`);
      this.geneSetsLocalState.deselect(datasetId, personSetCollectionId, geneType);
    }
  }

  public get selectedGeneSetsCollection(): GeneSetsCollection {
    return this.geneSetsLocalState.geneSetsCollection;
  }

  public set selectedGeneSetsCollection(selectedGeneSetsCollection: GeneSetsCollection) {
    this.geneSetsLocalState.geneSetsCollection = selectedGeneSetsCollection;
    this.geneSetsLocalState.geneSet = null;
    this.geneSetsLocalState.geneSetsTypes = Object.create(null);
    this.geneSets = [];
    this.searchQuery = '';

    if (selectedGeneSetsCollection.name === 'denovo' && this.selectedGeneType && this.selectedGeneType.personSetCollections.length) {
    if (selectedGeneSetsCollection?.types.length > 0) {
      const geneSetType = selectedGeneSetsCollection.types.find(
        genesetType => genesetType.datasetId === this.selectedDatasetId
      ) || selectedGeneSetsCollection.types[0];

      this.setSelectedGeneType(
        this.selectedGeneType.datasetId, this.selectedGeneType.personSetCollections[0].personSetCollectionId,
        this.selectedGeneType.personSetCollections[0].personSetCollectionLegend[0]?.id as string, true
      );
    }

    this.onSearch();
  }

  public get selectedGeneSet(): GeneSet {
    return this.geneSetsLocalState.geneSet;
  }

  public set selectedGeneSet(geneSet) {
    this.geneSetsLocalState.geneSet = geneSet;
    this.store.dispatch(setGeneSetsValues(this.geneSetsLocalState));
  }

  public getDownloadLink(): string {
    return this.geneSetsService.getGeneSetDownloadLink(this.selectedGeneSet);
  }
}
