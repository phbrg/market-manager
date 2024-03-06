import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner'
import { NavLink } from 'react-router-dom';

import { Card } from '../../components/Card/Card';

import useApi from '../../hooks/useApi';

import './Employees.css'

export const Employees = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const [user, setUser] = useState(null);
  const { data: employeesGet, error: employeesError, loading: employeesLoading, fetchData: employeesFetch } = useApi(`${import.meta.env.VITE_API_URL}/admin/users`, 'GET');
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    if(!user) userFetch();
    if(!employees) employeesFetch();
  }, [])

  useEffect(() => {
    if(userGet && user == null) setUser(userGet);
    if(employeesGet && employees == null) setEmployees(employeesGet);
    if(userGet) {
      if(userGet.role == 'BOSS' || userGet.role == 'MANAGER') {
      } else {
        window.location.href = '/error'
      }
    }
  }, [userGet, employeesGet]);

  useEffect(() => {
    if(employeesError) toast(<p className='toast'>❗ {employeesError}</p>);
  }, [employeesError])

  return (
    <section className='Employees'>
      {
        employeesLoading || userLoading && <div className="loader"></div>
      }
      <h1 className='title'>Employees</h1>
      <div className='button-parent'>
        <NavLink className='button success' to='/registeruser'>Register user</NavLink>
      </div>
      <div className='elements'>
        {
          employees && employees.map((employee, key) => (
            <Card key={key} elements={[
              `ID: ${employee.id}`,
              employee.name,
              `Login: ${employee.login}`,
              `Role: ${employee.role}`
            ]} link={`/user/${employee.id}`}/>
          ))
        }
      </div>
    </section>
  )
}
