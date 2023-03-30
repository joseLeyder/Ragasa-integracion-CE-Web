import { Component,
   ContentChildren,
  QueryList,
  AfterContentInit,
  Output,
  EventEmitter, } from '@angular/core';
import { TabContainerComponent } from '../tab-container/tab-container.component';

@Component({
  selector: 'app-tab-list',
  templateUrl: './tab-list.component.html',
  styleUrls: ['./tab-list.component.css']
})
export class TabListComponent implements AfterContentInit {
  @Output() reload: EventEmitter<string> = new EventEmitter<string>()
  reloadBand: boolean = false
  @ContentChildren(TabContainerComponent) tabs: QueryList<TabContainerComponent> | undefined;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs?.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs?.length === 0) {
      this.selectTab(this.tabs?.first);
    }
  }

  public selectTab(tab: any) {
    // deactivate all tabs
    this.tabs?.toArray().forEach((tab) => (tab.active = false));


    // activate the tab the user has clicked on.
    tab.active = true;

    console.log('Entre a onReload');
    this.reload.emit(tab.title);
  }
}
