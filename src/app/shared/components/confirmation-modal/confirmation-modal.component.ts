import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() open = false;
  @Input() title;
  @Input() text = '';
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onOpenChanged(status: boolean) {
    this.openChange.emit(status);
  }

  onConfirmed() {
    this.confirm.emit();
    this.onOpenChanged(false);
  }

  onCanceled() {
    this.cancel.emit();
    this.onOpenChanged(false);
  }

}
