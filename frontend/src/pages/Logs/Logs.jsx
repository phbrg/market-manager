import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner'

import { Card } from '../../components/Card/Card';

import useApi from '../../hooks/useApi';

import './Logs.css'

export const Logs = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const [user, setUser] = useState(null);
  const { data: logsGet, error: logsError, loading: logsLoading, fetchData: logsFetch } = useApi(`${import.meta.env.VITE_API_URL}/admin/logs`, 'GET');
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    if(!user) userFetch();
    if(!logs) logsFetch();
  }, [])

  useEffect(() => {
    if(userGet && user == null) setUser(userGet);
    if(logsGet && logs == null) setLogs(logsGet);
    if(userGet) {
      if(userGet.role == 'BOSS' || userGet.role == 'MANAGER') {
      } else {
        window.location.href = '/error'
      }
    }
  }, [userGet, logsGet]);

  useEffect(() => {
    if(logsError) toast(`❗ ${logsError}`);
  }, [logsError])

  return (
    <section className='Logs'>
      <h1>Logs</h1>
      {
        logsLoading || userLoading && <div className="loader"></div>
      }
      <div className='elements'>
        {
          logs && logs.map((log, key) => (
            <Card key={key} elements={[
              `ID: ${log.id}`,
              `Category: ${log.category}`,
              log.message,
              `${new Date(log.createdAt).toLocaleDateString()}`
            ]}/>
          ))
        }
      </div>
    </section>
  )
}
