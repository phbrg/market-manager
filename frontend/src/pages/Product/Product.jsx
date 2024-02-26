import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

import useApi from '../../hooks/useApi'

import './Product.css'
import { useEffect, useState } from 'react';

export const Product = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { id } = useParams();
  const { data: product, error: productError, loading: productLoading, fetchData: productFetch } = useApi(`${import.meta.env.VITE_API_URL}/products/id/${id}`, 'GET');

  const renderFetch = async () => {
    await productFetch();
  }

  useEffect(() => {
    renderFetch();
  }, []);

  useEffect(() => {
    if(productError) {
      window.location.href = '/error'
    }
  }, [productError])

  const { data: deleteProduct, error: deleteError, loading: deleteLoading, fetchData: deleteFetch } = useApi(`${import.meta.env.VITE_API_URL}/deleteproduct/${id}`, 'DELETE');
  const handleDeleteProduct = async (e) => {
    // modal confirmation
    await deleteFetch()
      .then(() => {
        window.location.href = '/'
      })
  }

  const [newProduct, setNewProduct] = useState({});
  const { data: updateProduct, error: updateError, loading: updateLoading, fetchData: updateFetch } = useApi(`${import.meta.env.VITE_API_URL}/editproduct/${id}`, 'PUT', newProduct);

  const handleOnChange = (e) => {
    setNewProduct({...newProduct, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateFetch();
    window.location.href = '/';
  }

  return (
    <section className='Product'>
      {
        productLoading || deleteLoading || updateLoading && <div className="loader"></div>
      }
      {
        product && 
        <form onSubmit={handleSubmit}>
          <p>{product.id}</p>
          <Input text='Name:' type='text' name='name' placeholder={product.name} handle={handleOnChange} />
          <Input text='Price:' type='number' name='price' placeholder={product.price} handle={handleOnChange} />
          <Input text='Amount:' type='number' name='amount' placeholder={product.amount} handle={handleOnChange} />
          <Input text='Expiration:' type='text' name='expiration' placeholder={product.expiration} handle={handleOnChange} />
          <Button text='edit product'/>
          <Button handle={handleDeleteProduct} text='delete product'/>
        </form>
      }
    </section>
  )
}
