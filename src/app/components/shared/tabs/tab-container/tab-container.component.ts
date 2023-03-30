import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.css']
})
export class TabContainerComponent {
  @Input('tabTitle') title: string | undefined;
  @Input() active = false;
}
