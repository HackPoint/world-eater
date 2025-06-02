import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoSearchComponent } from './todo-search.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Todo } from '../types';
import { of, skip } from 'rxjs';
import { Resource } from '../resource';

describe('TodoSearchComponent', () => {
  let component: TodoSearchComponent;
  let fixture: ComponentFixture<TodoSearchComponent>;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Hello' },
    { id: 2, title: 'Test' },
  ];

  const resourceMock = {
    getTodosByTitle: vi.fn((q: string) => {
      return of(mockTodos.filter((t) => t.title.includes(q)));
    }),
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [TodoSearchComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideProvider(Resource, { useValue: resourceMock })
      .compileComponents();

    fixture = TestBed.createComponent(TodoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debounce and call resource.getTodosByTitle', async () => {
    const results: Todo[] = [];
    component.$results.subscribe((res) => results.push(...res));

    component.searchControl.setValue('Test');

    // Advance time past debounce threshold
    await vi.runAllTimersAsync();

    // Flush Angular change detection & async pipeline
    await fixture.whenStable();

    // Final assertions
    expect(resourceMock.getTodosByTitle).toHaveBeenCalledWith('Test');
    expect(results).toEqual([{ id: 2, title: 'Test' }]);
  });

  it('should clear the result when input is empty', async () => {
    const results: Todo[][] = [];
    component.$results.subscribe((res) => results.push(res));

    component.searchControl.setValue('');
    await vi.runAllTimersAsync();

    await fixture.whenStable();

    expect(results.at(-1)).toEqual([]);
    expect(resourceMock.getTodosByTitle).not.toHaveBeenCalled();
  });

  it('should NOT emit after call `takeUntilDestroyed` after component is destroyed', async () => {
    const emitted: Todo[][] = [];
    component.$results.pipe(skip(1)).subscribe((r) => emitted.push(r));

    // trigger
    component.searchControl.setValue('Test');
    await vi.runAllTimersAsync();

    // destroy component
    fixture.destroy();

    // trigger after destroyed
    component.searchControl.setValue('Invoke');
    await vi.runAllTimersAsync();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual([{ id: 2, title: 'Test' }]);
    expect(resourceMock.getTodosByTitle).toHaveBeenCalledTimes(1);
  });
});
