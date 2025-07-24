import {Component, OnInit, signal} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import socket from '../plugins/socket';

interface IMessage {
  name: string;
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  message = new FormGroup({
    name: new FormControl(''),
    message: new FormControl(''),
  });
  readonly allMessages = signal<IMessage[]>([]);

  ngOnInit() {
    socket.on('chat', (data: IMessage) => {
      if(data.message && data.name) {
        this.allMessages.set([...this.allMessages(), data]);
      }
    });
    socket.on('all-messages', (data: IMessage[]) => {
      this.allMessages.set(data);
      console.log(data);
    });
    socket.emit('all-messages');
  }

  async submit() {
    if(this.message.value.message && this.message.value.name) {
      socket.emit('chat', this.message.value);
      this.message.value.message = '';
    }
  }
}
