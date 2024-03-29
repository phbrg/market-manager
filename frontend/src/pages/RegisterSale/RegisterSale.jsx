import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner'

import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

import useApi from '../../hooks/useApi'

import './RegisterSale.css'

export const RegisterSale = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { data: userGet, error: userError, loading: userLoading, fetchData: userFetch } = useApi(`${import.meta.env.VITE_API_URL}/personal`, 'GET');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const { data: updateGet, error: updateError, loading: updateLoading, fetchData: updateFetch } = useApi(`${import.meta.env.VITE_API_URL}/registersale`, 'POST', products);

  useEffect(() => {
    if(!user) userFetch();
  }, []);

  useEffect(() => {
    if(userGet) setUser(userGet);
  }, [userGet]);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleAddProduct = () => {
    const id = document.querySelector('#product-id').value;
    const amount = document.querySelector('#product-amount').value;

    if(id.length == 0 || amount.length == 0) {
      toast(<p className='toast'>❗ Invalid product ID or/and product amount.</p>);
      return;
    }

    setProducts([...products, { id: parseFloat(id), amount: parseFloat(amount) } ]);
  }

  const handleRemoveProduct = (e) => {
    const removedProducts = [];
    for(let product of products) {
      if(product.id != e.target.value) {
        removedProducts.push(product);
      }
    }
    
    setProducts(removedProducts);
  }

  const handleRegisterSale = () => {
    if(products.length == 0 || products == []) {
      toast(<p className='toast'>❗ You need to add products to register a sale.</p>);
      return;
    }

    updateFetch();
  }

  useEffect(() => {
    if(updateGet) window.location.href = '/';
    if(updateError) toast(<p className='toast'>❗ {updateError}</p>);
  }, [updateGet, updateError])

  return (
    <section className='RegisterSale'>
      <h1 className='title'>Register Sale</h1>
      {
        userLoading || updateLoading && <div className="loader"></div>
      }
      <div>
        <ul>
          <li><h1>Products:</h1></li>
          {
            products && products.map((product, key) => (
              <li key={key}><span>ID: {product.id}</span> | <span>AMT. {product.amount}</span> | <Button btnStyle='delete' text='Remove product' value={product.id} handle={handleRemoveProduct} /></li>
            ))
          }
        </ul>
        <div className='form'>
          <form onSubmit={handleSubmit}>
            <Input text='Product ID:' type='number' name='products' placeholder='ID' id='product-id' />
            <Input text='Amount:' type='number' name='' placeholder='Amount' id='product-amount' />
            <Button btnStyle='form' text='Add product' handle={handleAddProduct} />
            <Button btnStyle='form' text='Register sale' handle={handleRegisterSale}/>
          </form>
        </div>
      </div>
    </section>
  )
}
