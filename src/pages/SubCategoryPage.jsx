

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import FilterBar from '../components/FilterBar'; 

function SubCategoryPage() {
  const { categoryName, subCategoryName } = useParams(); 

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const apiUrl = `import.meta.env.VITE_API_URL/api/services?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subCategoryName)}`;
    
    
    setLoading(true);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setFilteredServices(data); 
        setLoading(false);
      });
  }, [categoryName, subCategoryName]);

  
  useEffect(() => {
    const min = minBudget ? parseFloat(minBudget) : null;
    const max = maxBudget ? parseFloat(maxBudget) : null;

    if (min === null && max === null) {
      setFilteredServices(services); 
      return;
    }

    const filtered = services.filter(service => {
      if (min !== null && service.price < min) return false;
      if (max !== null && service.price > max) return false;
      return true;
    });
    setFilteredServices(filtered);
  }, [minBudget, maxBudget, services]);

  if (loading) return <div className="container"><p>กำลังโหลด...</p></div>;

  return (
    <div className="container">
      {/* Breadcrumb หรือเส้นทางบอกตำแหน่ง */}
      <div className="breadcrumb">
        <Link to="/">หน้าแรก</Link> / 
        <Link to={`/category/${categoryName}`}>{categoryName}</Link> / 
        <span>{subCategoryName}</span>
      </div>

      <h1>{subCategoryName}</h1>
      
      {/* แถบกรองราคา ที่เราย้ายมาไว้ที่นี่ */}
      <FilterBar
        minBudget={minBudget}
        setMinBudget={setMinBudget}
        maxBudget={maxBudget}
        setMaxBudget={setMaxBudget}
      />
      
      {filteredServices.length > 0 ? (
        <div className="card-grid">
          {filteredServices.map(service => (
            <Card key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p>ไม่พบงานในหมวดหมู่นี้</p>
      )}
    </div>
  );
}

export default SubCategoryPage;