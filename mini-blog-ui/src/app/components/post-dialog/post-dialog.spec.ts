import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDialog } from './post-dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('PostDialog', () => {
  let component: PostDialog;
  let fixture: ComponentFixture<PostDialog>;

  const mockMatDialogRef = {
      close: jasmine.createSpy('close'),
      afterClosed: () => of(true) // Simulate a dialog closing with a value
    };

    const mockDialogData = {
      // Your specific data for the dialog
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDialog, MatDialogModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
