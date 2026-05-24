import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const editData = location.state?.product;
  
  const [data, setData] = useState({
    name: editData ? editData.name : '',
    sku: editData ? editData.sku : '',
    category: editData ? editData.category : '',
    quantity: editData ? editData.quantity : '',
    unit: editData ? (editData.unit || 'PCS') : 'PCS'
  });

  useEffect(() => {
    API.get('categories/')
      .then(res => setCategories(res.data))
      .catch(err => {
        if (err.response && err.response.status === 401) return;
        console.error("Error fetching categories", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editData) {
      API.put(`products/${editData.id}/`, data)
        .then(() => {
          alert("Product Updated successfully!");
          navigate('/');
        })
        .catch(err => handleError(err));
    } else {
      API.post('products/', data)
        .then(res => {
          alert("Product added successfully!");
          navigate('/'); 
        })
        .catch(err => handleError(err));
    }
  };

  const handleError = (err) => {
    if (err.response && err.response.status === 400) {
      const errorData = err.response.data;
      if (errorData.sku) {
        alert(`Error: This SKU already exists! Please use a unique SKU.`);
      } else if (errorData.name) {
        alert(`Error: Product name issue - ${errorData.name[0]}`);
      } else {
        alert("Failed to save product. Please check your inputs.");
      }
    } else if (err.response && err.response.status === 401) {
      return; 
    } else {
      alert("Something went wrong on the server!");
    }
    console.error("Error saving product", err);
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm col-md-8 mx-auto">
        <h3 className="mb-4">{editData ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Product Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              autoComplete="off"
              className="form-control" 
              value={data.name} 
              onChange={(e) => setData({...data, name: e.target.value})}
              required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="sku" className="form-label">SKU</label>
            <input 
              type="text" 
              id="sku" 
              name="sku" 
              autoComplete="off"
              className="form-control" 
              value={data.sku} 
              onChange={(e) => setData({...data, sku: e.target.value})}
              required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select 
              id="category" 
              name="category" 
              className="form-select" 
              value={data.category} 
              onChange={(e) => setData({...data, category: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity & Unit</label>
            <div className="input-group">
              <input 
                type="number" 
                id="quantity"
                name="quantity"
                className="form-control" 
                placeholder="0" 
                value={data.quantity}
                onChange={(e) => setData({...data, quantity: e.target.value})} 
                required 
              />
              
              <select 
                className="form-select bg-light" 
                value={data.unit}
                onChange={(e) => setData({...data, unit: e.target.value})}
                style={{ maxWidth: '120px', cursor: 'pointer' }} 
              >
                <option value="PCS">PCS</option>
                <option value="KG">KG</option>
                <option value="L">Liter</option>
                <option value="BOX">Box</option>
                <option value="PACK">Pack</option>
              </select>

            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editData ? "Update Changes" : "Save Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;