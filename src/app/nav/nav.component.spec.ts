import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkWithHref} from "@angular/router";
import {By} from "@angular/platform-browser";

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [ NavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to the home page', () => {
    let des = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

    let index = des.findIndex(de => de.properties['href'] === '/home');
    expect(index).toBeGreaterThan(-1);
  });
});
