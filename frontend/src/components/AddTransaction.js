import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

function AddTransaction() {
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
            alert("Stock Updated Successfully!");
            navigate('/');
        })
        .catch(err => {
            if (err.response && err.response.status === 401) return;
            alert("Error updating stock");
        });
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow col-md-6 mx-auto">
                <h4 className="mb-4">Update Stock (In/Out)</h4>
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label htmlFor="productSelect" className="form-label">Select Product</label>
                        <select 
                            id="productSelect" 
                            name="product"     
                            className="form-select" 
                            value={data.product}
                            onChange={(e) => setData({...data, product: e.target.value})}
                            required
                        >
                            <option value="">-- Choose Product --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Current: {p.quantity})</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="typeSelect" className="form-label">Transaction Type</label>
                        <select 
                            id="typeSelect"           
                            name="transaction_type"   
                            className="form-select" 
                            value={data.transaction_type}
                            onChange={(e) => setData({...data, transaction_type: e.target.value})}
                            required
                        >
                            <option value="OUT">Stock Out (Usage)</option>
                            <option value="IN">Stock In (Restock)</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="quantityInput" className="form-label">Quantity</label>
                        <input 
                            type="number" 
                            id="quantityInput" 
                            name="quantity"    
                            className="form-control" 
                            placeholder="Enter Quantity" 
                            value={data.quantity === 0 ? '' : data.quantity}
                            onChange={(e) => setData({...data, quantity: e.target.value})} 
                            required
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="notesTextarea" className="form-label">Reason/Notes</label>
                        <textarea 
                            id="notesTextarea"
                            name="notes"       
                            className="form-control" 
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