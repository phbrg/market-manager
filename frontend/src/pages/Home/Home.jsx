import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import useApi from '../../hooks/useApi'

import './Home.css'

export const Home = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data: user, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const { data: products, error: productsError, loading, fetchData: productsFetch } = useApi(`${import.meta.env.VITE_API_URL}/products`, 'GET');

  const renderFetch = async () => {
    await userFetch();
    await productsFetch();
  }
  
  useEffect(() => {
    renderFetch();
  }, [])

  useEffect(() => {
    console.log(products, productsError);
  }, [products, productsError])

  return (
    <section>
      <a href="/addproduct">add product</a>
      {
        user && <h1>Welcome, {user.name}</h1>
      }
      {
        productsError && <p>{productsError}</p>
      }
      {
        products && products.map((product, key) => (
          <div className='product-card' key={key}>
            <p>ID: {product.id}</p>
            <p>{product.name}</p>
            <p>${product.price}</p>
            <p>AMT. {product.amount}</p>
            <p>EXP. {product.expiration}</p>
            <a href={`/product/${product.id}`}>Edit product</a>
          </div>
        ))
      }
    </section>
  )
}
