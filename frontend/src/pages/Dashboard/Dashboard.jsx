import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner'

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

  const [showProducts, setShowProducts] = useState(null);
  const [showSales, setShowSales] = useState(null);

  const handleShowProducts = () => {
    productsError ? setError(productsError) : setError(null);
    setShowSales(null);
    if(products) setShowProducts(products);
  }

  const handleShowSales = () => {
    salesError ? setError(salesError) : setError(null);
    setShowProducts(null);
    if(sales) setShowSales(sales);
  }

  useEffect(() => {
    if(userGet) setUser(userGet);
    if(userError) setError(userError);
  }, [userGet, userError]);

  useEffect(() => {
    if(productsGet) {
      setProducts(productsGet);
      setShowProducts(productsGet);
    };
    if(salesGet) setSales(salesGet);
  }, [productsGet, salesGet]);

  const calculateTotalProducts = (sale) => {
    let total = 0;
    for(let product of sale.products) {
      total = total + product.amount;
    }
    return total;
  }

  return (
    <section className='Dashboard'>
      {
        userLoading || productsLoading || salesLoading && <div className="loader"></div>
      }
      <header>
        {
          user && <h1>Hello <span>{user.name}</span>, welcome!</h1>
        }
        {
          error && <p className="error">{error}</p>
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
          showProducts && products.map((product, key) => (
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
          showSales && sales.map((sale, key) => (
            <Card key={key} elements={[
              `ID: ${sale.id}`,
              `${calculateTotalProducts(sale)} Products`,
              `$${sale.total}`,
              `${new Date(sale.createdAt).toLocaleDateString()}`
            ]}
            link={`/sale/${sale.id}`} />
          ))
        }
      </div>
    </section>
  )
}
