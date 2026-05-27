import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import Swal from 'sweetalert2';

function AddTransaction({ isDarkMode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    
    const selectedProduct = location.state?.product;

    const [data, setData] = useState({
        product: selectedProduct ? selectedProduct.id : '', 
        transaction_type: 'OUT',
        quantity: 0,
        notes: ''
    });

    useEffect(() => {
        API.get('products/')
            .then(res => {
                setProducts(res.data.results || []); 
            })
            .catch(err => {
                if (err.response && err.response.status === 401) return;
                console.error("Error fetching products", err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        API.post('transactions/', data)
          .then(() => {
            Swal.fire({
                title: 'Success!',
                text: 'Stock Updated Successfully.',
                icon: 'success',
                theme: isDarkMode ? 'dark' : 'light', 
                confirmButtonColor: '#198754'
            }).then(() => {
                navigate('/');
            });
        })
        .catch(err => {
            if (err.response && err.response.status === 401) return;
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update stock. Please try again.',
                icon: 'error',
                theme: isDarkMode ? 'dark' : 'light',
                confirmButtonColor: '#d33'
            });
            console.error("Error updating stock", err);
        });
    };
    const currentProductObj = products.find(p => p.id.toString() === data.product.toString());
    const unitToDisplay = currentProductObj ? (currentProductObj.unit || 'PCS') : '-';
    return (
        <div className="container mt-4">
            <div className={`card p-4 shadow col-md-6 mx-auto ${isDarkMode ? 'bg-secondary text-white' : ''}`}>
                <h4 className="mb-4">Update Stock (In/Out)</h4>
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label htmlFor="productSelect" className="form-label">Select Product</label>
                        <select 
                            id="productSelect" 
                            name="product"     
                            className={`form-select ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                            value={data.product}
                            onChange={(e) => setData({...data, product: e.target.value})}
                            required
                        >
                            <option value="">-- Choose Product --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Current: {p.quantity} {p.unit || 'PCS'})</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="typeSelect" className="form-label">Transaction Type</label>
                        <select 
                            id="typeSelect"           
                            name="transaction_type"   
                            className={`form-select ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                            value={data.transaction_type}
                            onChange={(e) => setData({...data, transaction_type: e.target.value})}
                            required
                        >
                            <option value="OUT">Stock Out (Usage)</option>
                            <option value="IN">Stock In (Restock)</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">Quantity & Unit</label>
                        <div className="input-group">
                            <input 
                                type="number" 
                                id="quantityInput" 
                                name="quantity"    
                                className={`form-select ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                                placeholder="Enter Quantity" 
                                value={data.quantity === 0 ? '' : data.quantity}
                                onChange={(e) => setData({...data, quantity: e.target.value})} 
                                required
                            />
                            <span className="input-group-text bg-secondary text-white" style={{ minWidth: '80px', justifyContent: 'center' }}>
                                {unitToDisplay}
                            </span>
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="notesTextarea" className="form-label">Reason/Notes</label>
                        <textarea 
                            id="notesTextarea"
                            name="notes"       
                            className={`form-select ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                            placeholder="Optional notes..." 
                            value={data.notes}
                            onChange={(e) => setData({...data, notes: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
                        <button type="submit" className="btn btn-danger">Confirm Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTransaction;