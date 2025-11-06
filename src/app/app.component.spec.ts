import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { routes } from './app.routes';
import { ReplaySubject } from 'rxjs';

class MockRouter {
  public events = new ReplaySubject<any>();
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: {} } }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should update isLoading$ based on router events', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router) as unknown as MockRouter;

    let isLoadingValues: boolean[] = [];
    app.isLoading$.subscribe(value => {
      isLoadingValues.push(value);
    });

    // Simulate NavigationStart
    router.events.next(new NavigationStart(1, '/home'));
    expect(isLoadingValues).toEqual([true]);

    // Simulate NavigationEnd
    router.events.next(new NavigationEnd(1, '/home', '/home'));
    expect(isLoadingValues).toEqual([true, false]);

    // Simulate another NavigationStart
    router.events.next(new NavigationStart(2, '/breeds'));
    expect(isLoadingValues).toEqual([true, false, true]);

    // Simulate NavigationError
    router.events.next(new NavigationError(2, '/breeds', 'error'));
    expect(isLoadingValues).toEqual([true, false, true, false]);

    done();
  });
});
