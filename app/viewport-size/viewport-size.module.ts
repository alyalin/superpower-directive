import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewportSizeDirective } from "./directive/viewport-size.directive";
import { ViewportSizeService } from "./service/viewport-size.service";
import { ViewportConfig } from "./interfaces/viewport-config";

@NgModule({
  imports: [CommonModule],
  declarations: [ViewportSizeDirective],
  exports: [ViewportSizeDirective],
  providers: [ViewportSizeService]
})
export class ViewportSizeModule {
  static forRoot(config: ViewportConfig): ModuleWithProviders {
    return {
      ngModule: ViewportSizeModule,
      providers: [
        {
          provide: "viewportConfig",
          useValue: config
        }
      ]
    };
  }
}
