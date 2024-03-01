import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'

import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';

import useApi from '../../hooks/useApi'

import './Dashboard.css'
import { NavLink } from 'react-router-dom';

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
  }, [userGet, userError]);

  useEffect(() => {
    if(productsGet) setProducts(productsGet)
  }, [productsGet])

  const calculateTotalProducts = (sale) => {
    let total = 0;
    for(let product of sale.products) {
      total = total + product.amount;
    }
    return total;
  }

  useEffect(() => {
    if(error) toast(`❗ ${error}`)
    setError(null);
  }, [error])

  return (
    <section className='Dashboard'>
      {
        userLoading || productsLoading || salesLoading && <div className="loader"></div>
      }
      <header>
        {
          user && <h1>Hello <span>{user.name}</span>, welcome!</h1>
        }
        <div className='buttons'>
          <div>
            <Button btnStyle='default' text='View products' handle={handleShowProducts}/>
            <Button btnStyle='default' text='View sales' handle={handleShowSales}/>
          </div>
          <div>
            <NavLink className='button success' to='/registersale'>Register sale</NavLink>
            <NavLink className='button success' to='/registerproduct'>Register products</NavLink>
          </div>
        </div>
      </header>
      <div className='elements'>
        {
          products && products.map((product, key) => (
            <Card key={key} elements={[
              `ID: ${product.id}`,
              `${product.name}`,
              `$${product.price}`,
              `AMT. ${product.amount}`,
              `EXP. ${new Date(product.expiration).toLocaleDateString()}`,
            ]}
            link={`/product/${product.id}`}
            />
          ))
        }
        {
          sales && sales.map((sale, key) => (
            <Card key={key} elements={[
              `ID: ${sale.id}`,
              `${calculateTotalProducts(sale)} Products`,
              `$${sale.total}`
            ]}
            link={`/sale/${sale.id}`} />
          ))
        }
      </div>
    </section>
  )
}
