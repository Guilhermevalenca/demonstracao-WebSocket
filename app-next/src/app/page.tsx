'use client';

import { useState, useEffect, type FormEvent } from 'react';
import "./page.css";
import './chat.css';
import socket from '../plugins/socket';

interface IMessage {
  message: string;
  name: string;
}

export default function Home() {
  const [message, setMessage] = useState<IMessage>({
    message: '',
    name: ''
  });
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on('chat', (data: IMessage) => {
      if(data.message && data.name) {
        setAllMessages((prev) => [...prev, data]);
      }
    });
    socket.on('all-messages', (data: IMessage[]) => {
      setAllMessages(data);
    });
    socket.emit('all-messages');
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if(message.message && message.name) {
      socket.emit('chat', message);
      setMessage({
        ...message,
        message: '',
      });
    }
  }

  return (
      <>
        <main>
          <section>
            <div>
              <h1>Chat App in Next</h1>
            </div>
            <form onSubmit={submit}>
              <label>
                Name
                <input
                    type="text"
                    onChange={(e) => setMessage({...message, name: e.target.value})}
                />
              </label>
              <label>
                Message
                <input
                    type="text"
                    onChange={(e) => setMessage({...message, message: e.target.value})}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </section>
          { allMessages.length > 0 && (
              <section>
                <div className="messages">
                  <ul>
                    { allMessages.length > 0 && allMessages.map((message: IMessage, index: number) => (
                        <li key={index}>
                          <strong>{ message.name }: </strong>
                          <span>{ message.message }</span>
                        </li>
                    ))
                    }
                  </ul>
                </div>
              </section>
          )
          }
        </main>
      </>
  )
}
