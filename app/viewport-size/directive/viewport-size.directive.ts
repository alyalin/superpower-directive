import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  EmbeddedViewRef
} from "@angular/core";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ViewportSizeService } from "../service/viewport-size.service";
import { ViewportType } from "../interfaces/viewport-type";

@Directive({
  selector: "[ifViewportSize]"
})
export class ViewportSizeDirective implements OnInit, OnDestroy {
  @Input("ifViewportSize") private viewportSize: ViewportType;

  private destroy$ = new ReplaySubject(1);

  private view: EmbeddedViewRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private vpSizeService: ViewportSizeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.view = templateRef.createEmbeddedView(null);
  }

  ngOnInit() {
    this.showContentByViewport();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showContentByViewport() {
    this.vpSizeService.currentViewportType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        if (type === this.viewportSize) {
          this.viewContainer.insert(this.view);
          this.cdRef.detectChanges();
        } else {
          this.viewContainer.detach();
        }
      });
  }
}
