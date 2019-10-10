import { Injectable, NgZone, Inject } from "@angular/core";
import { fromEvent, BehaviorSubject, combineLatest } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter
} from "rxjs/operators";
import { ViewportConfig } from "../interfaces/viewport-config";
import { ViewportType } from "../interfaces/viewport-type";

@Injectable()
export class ViewportSizeService {
  currentViewportType$ = new BehaviorSubject<ViewportType>(
    this.defineViewportType(window.innerWidth)
  );

  constructor(
    private zone: NgZone,
    @Inject("viewportConfig")
    private vpConfig: ViewportConfig
  ) {
    this.defineViewportSize();
  }

  private defineViewportSize(): void {
    this.zone.runOutsideAngular(() => {
      const currentViewportType = fromEvent(window, "resize").pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((event: Event) => this.defineViewportType(event.target.innerWidth))
      );
      const initialViewportType = this.currentViewportType$;

      combineLatest([initialViewportType, currentViewportType])
        .pipe(
          filter(([initial, current]) => {
            return initial !== current;
          })
        )
        .subscribe(([initial, current]) => {
          this.currentViewportType$.next(current);
        });
    });
  }

  private defineViewportType(width: number): ViewportType {
    if (width < this.vpConfig.medium) {
      return ViewportType.SMALL;
    } else if (this.vpConfig.medium <= width && width < this.vpConfig.large) {
      return ViewportType.MEDIUM;
    } else if (this.vpConfig.large < width) {
      return ViewportType.LARGE;
    }
  }
}
