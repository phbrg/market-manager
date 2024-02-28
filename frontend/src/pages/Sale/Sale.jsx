import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner'

import { Button } from '../../components/Button/Button';

import useApi from '../../hooks/useApi'

import './Sale.css'
import { useEffect, useState } from 'react';

export const Sale = () => {
  const token = Cookies.get('token') || null;
  if (!token) {
    window.location.href = '/login';
  }

  const { id } = useParams();
  const { data: saleGet, error: saleError, loading: saleLoading, fetchData: saleFetch } = useApi(`${import.meta.env.VITE_API_URL}/sales/id/${id}`, 'GET');
  const { data: productsGet, error: productsError, loading: productsLoading, fetchData: productsFetch } = useApi(`${import.meta.env.VITE_API_URL}/products`, 'GET');

  const [sale, setSale] = useState(null);
  const [products, setProducts] = useState(null);
  useEffect(() => {
    if(!sale) saleFetch();
    if(!products) productsFetch();
  }, []);

  useEffect(() => {
    if(saleGet) setSale(saleGet);
    if(productsGet) setProducts(productsGet);
  }, [saleGet, productsGet])

  useEffect(() => {
    if(saleError) window.location.href = '/error';
    if(productsError) toast(`❗ ${productsError}`);
  }, [saleError, productsError])

  const { data: deleteSale, error: deleteError, loading: deleteLoading, fetchData: deleteFetch } = useApi(`${import.meta.env.VITE_API_URL}/deletesale/${id}`, 'DELETE');

  const handleDeleteSale = async (e) => {
    // modal confirmation
    await deleteFetch()
  }
  
  const saleWithProductName = [];
  if(sale && products) {
    sale.products.forEach((product) => {
      products.forEach((obj) => {
        let productWithName = {
          id: obj.id,
          name: obj.name,
          amount: product.amount
        }

        if (obj.id == product.id) {
          saleWithProductName.push(productWithName);
        }
      });
    });
  }

  useEffect(() => {
    if(deleteSale) window.location.href = '/';
    if(deleteError) toast(`❗ ${deleteError}`);
  }, [deleteSale, deleteError])

  return (
    <section className='Sale'>
      {
        saleLoading || deleteLoading && <div className="loader"></div>
      }
      {
        sale && <div>
          <p>Sale ID: {sale.id}</p>
          <ul>
            <h1>Products:</h1>
            {
              saleWithProductName.length >= 1 && saleWithProductName.map((product, key) => (
                <li key={key}><p>ID: {product.id}</p> | <p>{product.name}</p> | <p>AMT. {product.amount}</p></li>
              ))
            }
          </ul>
          <p>${sale.total}</p>
          <Button handle={handleDeleteSale} text='delete sale'/>
        </div>
      }
    </section>
  )
}
