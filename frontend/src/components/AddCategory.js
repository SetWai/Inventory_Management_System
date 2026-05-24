import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('categories/', { name, description })
      .then(() => {
        alert("Category Added Successfully!");
        navigate('/'); 
      })
      .catch(err => {
        if (err.response && err.response.status === 401) return;
        alert("Error adding category");
      });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 col-md-6 mx-auto">
        <h3 className="mb-4">Add New Category</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">Category Name</label>
            <input 
              type="text"
              id="categoryName"     
              name="categoryName"   
              autoComplete="off"   
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Flour, Dairy, Spices"
              required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="categoryDesc" className="form-label">Description (Optional)</label>
            <textarea 
              id="categoryDesc"     
              name="categoryDesc"   
              autoComplete="off"    
              className="form-control" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn btn-success">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;