import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConectorService } from 'src/app/Services/conector.service';
import { SpinnerService } from 'src/app/Services/spinner.service';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent {
  public isSpinnerVisible = true;

  @Input()
  public backgroundColor = 'rgba(0, 115, 170, 0.69)';
  spinnerDowland:any;
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    public storage: StorageService,
    private conector:SpinnerService
  ) {
    this.router.events.subscribe(
    async  event => {
        this.spinnerDowland = await this.storage.getStorage("spinner")+"";
        if(this.spinnerDowland == ""){
          this.spinnerDowland=false;
        }
        console.log("spinner",this.spinnerDowland);
        if (!this.spinnerDowland) {
          this.isSpinnerVisible = false;//true
        } else {
         this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );
  
  }
  ngOnInit() {
    console.log('pasespinenr');
    // Cambiarmos el valor de la variable para que todos los componentes que estan subscritos detecten el cambio
    this.conector.loading$.subscribe(data => {
      this.isSpinnerVisible=data
    });  
  
  }
}
