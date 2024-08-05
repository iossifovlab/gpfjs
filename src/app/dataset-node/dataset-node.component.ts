import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { DatasetNode } from './dataset-node';
import { Store as Store1 } from '@ngrx/store';
import { expandedDatasetsReducer, selectExpandedDatasets, setExpandedDatasets } from './dataset-node.state';
import { DatasetModel, selectDatasetId } from 'app/datasets/datasets.state';
import { DatasetsService } from 'app/datasets/datasets.service';
import { StatefulComponentNgRx } from 'app/common/stateful-component_ngrx';

@Component({
  selector: 'gpf-dataset-node',
  templateUrl: './dataset-node.component.html',
  styleUrls: ['./dataset-node.component.css']
})
export class DatasetNodeComponent extends StatefulComponentNgRx implements OnInit, AfterContentChecked {
  @Input() public datasetNode: DatasetNode;
  @Output() public setExpandabilityEvent = new EventEmitter<boolean>();
  public selectedDatasetId: string;
  public isExpanded = false;
  public closeChildrenSubject: Subject<void> = new Subject<void>();
  @Input() public closeObservable: Observable<void> = new Observable<void>();
  public closeChildrenSubscription: Subscription;

  public constructor(
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    protected store1: Store1,
    private datasetService: DatasetsService
  ) {
    super(store1, 'datasetNode', selectExpandedDatasets);
  }

  public ngOnInit(): void {
    // this.store.selectOnce((state: { datasetState: DatasetModel}) => state.datasetState).subscribe(state => {
    //   this.selectedDatasetId = state.selectedDatasetId;
    //   if (this.datasetNode.dataset.id === this.selectedDatasetId) {
    //     this.setExpandability();
    //   }
    // });

    this.store1.select(selectDatasetId).subscribe(datasetId => {
      this.selectedDatasetId = datasetId;
      if (this.datasetNode.dataset.id === this.selectedDatasetId) {
        this.setExpandability();
      }
    });


    // this.store.selectOnce(
    //   (state: { datasetNodeState: DatasetNodeModel}) => state.datasetNodeState)
    //   .subscribe(state => {
    //     if (state.expandedDatasets.includes(this.datasetNode.dataset.id)) {
    //       this.isExpanded = true;
    //     }
    //   });

    this.store1.select(selectExpandedDatasets).subscribe((expandedDatasets: string[]) => {
      if (expandedDatasets.includes(this.datasetNode.dataset.id)) {
        this.isExpanded = true;
      }
    });

    this.closeChildrenSubscription = this.closeObservable.subscribe(() => {
      this.isExpanded = false;
      this.removeFromState(this.datasetNode.dataset.id);
      this.emitEventToChild();
    });
  }

  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public setExpandability(): void {
    this.setExpandabilityEvent.emit(true);
  }

  public emitEventToChild(): void {
    this.closeChildrenSubject.next();
  }

  public select(openInNewTab = false): void {
    if (this.datasetNode !== undefined && this.datasetNode.dataset !== undefined) {
      const url = `/datasets/${this.datasetNode.dataset.id}`;

      if (!openInNewTab) {
        this.router.navigate([url]);
      } else {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.location.assign(url);
        }
      }
    }
  }

  private addToState(nodeId: string): void {
    // this.store.selectOnce(
    //   (state: { datasetNodeState: DatasetNodeModel}) => state.datasetNodeState)
    //   .subscribe(state => {
    //     if (!state.expandedDatasets.includes(nodeId)) {
    //       state.expandedDatasets.push(nodeId);
    //       this.store.dispatch(new SetExpandedDatasets(state.expandedDatasets));
    //     }
    //   });

    this.store1.select(selectExpandedDatasets).subscribe((expandedDatasets: string[]) => {
      if (!expandedDatasets.includes(nodeId)) {
        expandedDatasets.push(nodeId);
        this.store1.dispatch(setExpandedDatasets({expandedDatasets: expandedDatasets}))
      }
    });
  }

  private removeFromState(nodeId: string): void {
    // this.store.selectOnce(
    //   (state: { datasetNodeState: DatasetNodeModel}) => state.datasetNodeState)
    //   .subscribe(state => {
    //     if (state.expandedDatasets.includes(nodeId)) {
    //       const index = state.expandedDatasets.indexOf(nodeId, 0);
    //       state.expandedDatasets.splice(index, 1);
    //       this.store.dispatch(new SetExpandedDatasets(state.expandedDatasets));
    //     }
    //   });

    this.store1.select(selectExpandedDatasets).subscribe((expandedDatasets: string[]) => {
      if (expandedDatasets.includes(nodeId)) {
        const index = expandedDatasets.indexOf(nodeId, 0);
        expandedDatasets.splice(index, 1);
        this.store1.dispatch(setExpandedDatasets({expandedDatasets: expandedDatasets}))
      }
    });
  }

  private updateState(nodeId: string): void {
    // this.store.selectOnce(
    //   (state: { datasetNodeState: DatasetNodeModel}) => state.datasetNodeState)
    //   .subscribe(state => {
    //     if (state.expandedDatasets.includes(nodeId)) {
    //       const index = state.expandedDatasets.indexOf(nodeId, 0);
    //       state.expandedDatasets.splice(index, 1);
    //     } else {
    //       state.expandedDatasets.push(nodeId);
    //     }
    //     this.store.dispatch(new SetExpandedDatasets(state.expandedDatasets));
    //   });

    this.store1.select(selectExpandedDatasets).subscribe((expandedDatasets: string[]) => {
      if (expandedDatasets.includes(nodeId)) {
        const index = expandedDatasets.indexOf(nodeId, 0);
        expandedDatasets.splice(index, 1);
      } else {
        expandedDatasets.push(nodeId);
      }
      this.store1.dispatch(setExpandedDatasets({expandedDatasets: expandedDatasets}))
    });
  }

  public setIsExpanded(): void {
    this.isExpanded = true;
    this.addToState(this.datasetNode.dataset.id);
    this.setExpandability();
  }

  public toggleDatasetCollapse(selectedNodeId: string): void {
    this.updateState(selectedNodeId);
    this.isExpanded = !this.isExpanded;
    if (!this.isExpanded) {
      this.emitEventToChild();
    }
  }
}
