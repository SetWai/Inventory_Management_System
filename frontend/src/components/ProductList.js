import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterCat, setFilterCat] = useState("");
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts(`products/?search=${searchTerm}`);
  }, [searchTerm]); 

  useEffect(() => {
    API.get('categories/')
      .then(res => setCategories(res.data))
      .catch(err => {
        if (err.response && err.response.status === 401) return;
        console.error("Error fetching categories", err);
      });
  }, []);
  
  const fetchProducts = (url = `products/?search=${searchTerm}`) => {
    setLoading(true);
    API.get(url)
      .then(res => {
        setProducts(res.data.results || []); 
        setNextUrl(res.data.next);      
        setPrevUrl(res.data.previous);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        if (err.response && err.response.status === 401) return;
        console.error("Error fetching products", err);
      });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCat === "" || p.category.toString() === filterCat;
    return matchesCategory;
  });

  const deleteProduct = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      theme: 'auto',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        API.delete(`products/${id}/`)
          .then(() => {
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
            fetchProducts(`products/?search=${searchTerm}`);
          })
          .catch(err => {
            if (err.response && err.response.status === 401) return;
            Swal.fire('Error!', 'Failed to delete the product.', 'error');
            console.error("Error deleting product", err);
          });
      }
    });
  };

  return (
    <div className="container mt-2">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Inventory Items</h3>
          <div>
            <Link to="/add-category" className="btn btn-outline-success me-2">
              + Add Category
            </Link>
            <Link to="/add-product" className="btn btn-outline-success me-2">
              + Add Product
            </Link>
          </div>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-6">
            <label htmlFor="searchProduct" className="form-label visually-hidden">Search Products</label>
            <input 
              type="text" 
              id="searchProduct"     
              name="searchProduct"  
              className="form-control" 
              placeholder="Search by Name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="filterCategory" className="form-label visually-hidden">Filter by Category</label>
            <select 
              id="filterCategory"    
              name="filterCategory" 
              className="form-control form-select" 
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
             <button className="btn btn-secondary w-100" onClick={() => {setSearchTerm(""); setFilterCat("");}}>Reset</button>
          </div>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center my-5">
             <ClipLoader color="#0d6efd" size={50} />
          </div>
        ) : (
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><code>{p.sku}</code></td>
                    <td><span className="badge bg-info text-dark">{p.category_name}</span></td>
                    <td>{p.quantity} {p.unit ? p.unit : 'PCS'}</td>
                    <td>
                      {p.is_low_stock ? <span className="badge bg-danger">Low Stock</span> : <span className="badge bg-success">Okay</span>}
                    </td>
                    <td>
                      <div className="d-flex">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2" 
                          onClick={() => navigate('/add-transaction', { state: { product: p } })}
                          title="Update Stock"
                        >
                          Stock
                        </button>
                        <button 
                          className="btn btn-sm btn-warning me-2" 
                          onClick={() => navigate('/add-product', { state: { product: p } })}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => deleteProduct(p.id)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No products found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button 
            className="btn btn-outline-primary" 
            onClick={() => fetchProducts(prevUrl)} 
            disabled={!prevUrl}
          >
            &laquo; Previous
          </button>
          
          <button 
            className="btn btn-outline-primary" 
            onClick={() => fetchProducts(nextUrl)} 
            disabled={!nextUrl} 
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;