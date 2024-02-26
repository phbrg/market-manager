import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';

import useApi from '../../hooks/useApi'

import './Dashboard.css'

export const Dashboard = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const { data: productsGet, error: productsError, loading: productsLoading, fetchData: productsFetch } = useApi(`${import.meta.env.VITE_API_URL}/products`, 'GET');
  const { data: salesGet, error: salesError, loading: salesLoading, fetchData: salesFetch } = useApi(`${import.meta.env.VITE_API_URL}/sales`, 'GET');
  
  useEffect(() => {
    if(!user) userFetch();
    if(!products) productsFetch();
    if(!sales) salesFetch();
  }, []);

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null);
  const [sales, setSales] = useState(null);

  const handleShowProducts = () => {
    productsError ? setError(productsError) : setError(null);
    setSales(null);
    if(productsGet) setProducts(productsGet);
  }

  const handleShowSales = () => {
    salesError ? setError(salesError) : setError(null);
    setProducts(null);
    if(salesGet) setSales(salesGet);
  }

  useEffect(() => {
    if(userGet) setUser(userGet);
    if(userError) setError(userError);
  }, [userGet, userError])

  return (
    <section className='Dashboard'>
      {
        userLoading || productsLoading && <div className="loader"></div>
      }
      {
        user && <h1>Hello {user.name}, welcome!</h1>
      }
      {
        error && <p>{error}</p>
      }
      <Button text='View products' handle={handleShowProducts}/>
      <Button text='View sales' handle={handleShowSales}/>
      {
        products && products.map((product, key) => (
          <Card key={key} elements={[
            `ID: ${product.id}`,
            `${product.name}`,
            `$${product.price}`,
            `AMT. ${product.amount}`,
            `EXP. ${new Date(product.expiration).toLocaleDateString()}`,
          ]}
          edit={`/product/${product.id}`}
          />
        ))
      }
      {
        sales && sales.map((sale, key) => (
          <p key={key}>{sale}</p>
        ))
      }
    </section>
  )
}
