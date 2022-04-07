import styles from '../styles/Home.module.css';
import moment from 'moment';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import { signIn, useSession } from 'next-auth/react';

export enum Form {
    Initial,
    Loading,
    Success,
    Error
  }
  
  export type FormState = {
    message?: string;
    state: Form;
  };

function LeaveMessage({ message }) {
    return (
      <div className={styles.messages}>
        <b>{message.body}</b>
          <p>
          {message.created_by} |&nbsp;
           {( moment(message.updated_at).format('LL hh:mm'))}
           </p>
        </div>
    );
  }

  export default function Message({ fallbackData }) {
    const [form, setForm] = useState<FormState>({ state: Form.Initial });
    const input = useRef(null);
    const { data: entries } = useSWR('/api/guestbook', fetcher, {
      fallbackData
    });
      
    const { data: session } = useSession();

const leaveMessage = async (e) => {
    e.preventDefault();
    setForm({ state: Form.Loading });
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: input.current.value
        })
      });

      const response = await res.json();
      setForm({ state: Form.Success, message: response });
      input.current.value = '';
    } catch (err) {
      setForm({ state: Form.Error, message: err.message });
    }
    return
  }
  input.current.vale = '';
    setForm({state: Form.Success})


return (
    <div className={styles.container}>
        <h1></h1>
    </div>
    )
}