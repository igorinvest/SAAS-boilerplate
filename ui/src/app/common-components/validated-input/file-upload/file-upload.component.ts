import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';

@Component({
  selector: 'app-file-upload',
  imports: [ValidationErrorsComponent, ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FileUploadComponent),
        multi: true,
      },
    ],
})
export class FileUploadComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() label = '';
  @Input() fileTypes: string[];
  @Input() customErrorMessages: Record<string, string> = {};
  @Output() private fileEmiter : EventEmitter<File> = new EventEmitter();

  onFileDrop(files: any) {
    this.fileEmiter.emit(files[0])
  }

  onFileChange(event: any) {
    this.fileEmiter.emit(event.target.files[0])
  }
}
