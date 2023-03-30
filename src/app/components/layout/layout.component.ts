import { Component } from '@angular/core';
// import { AppAuthGuard } from 'src/app/guards';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})

export class LayoutComponent {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSerialize: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            "settings",
            this.domSerialize.bypassSecurityTrustResourceUrl("../../assets/svgicons/settings_black_24dp.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "arrowMenu",
            this.domSerialize.bypassSecurityTrustResourceUrl("../../assets/svgicons/keyboard_arrow_down_black_24dp.svg")
        );
    }
}