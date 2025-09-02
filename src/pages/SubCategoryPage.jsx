import React, { useState, useEffect, useMemo } from 'react'; // <-- เพิ่ม useMemo
import { useParams, Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Card from '../components/Card';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

function SubCategoryPage() {
  const { categoryName, subCategoryName } = useParams();

  const [allServices, setAllServices] = useState([]); // <-- เปลี่ยนชื่อเป็น allServices
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Logic ใหม่: ดึงข้อมูลจาก Firestore ---
  useEffect(() => {
    setLoading(true);
    const servicesRef = collection(db, "services");
    
    // สร้าง Query เพื่อดึงเฉพาะบริการที่ตรงกับ "ซอย" นี้ และ "อนุมัติแล้ว"
    const q = query(
      servicesRef,
      where("category", "==", categoryName),
      where("subcategory", "==", subCategoryName),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc") // <-- เพิ่มการเรียงลำดับ
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllServices(servicesData);
        setLoading(false); // <-- จุดที่ 1: หยุดโหลดเมื่อได้รับข้อมูล
      },
      (error) => {
        console.error("Error fetching services in subcategory:", error);
        setLoading(false); // <-- จุดที่ 2: หยุดโหลดเสมอแม้จะเกิด Error
      }
    );

    return () => unsubscribe(); // Cleanup
  }, [categoryName, subCategoryName]);

  // --- Logic การกรองราคา (ใช้ useMemo เพื่อประสิทธิภาพ) ---
  const filteredServices = useMemo(() => {
    const min = minBudget ? parseFloat(minBudget) : null;
    const max = maxBudget ? parseFloat(maxBudget) : null;

    if (min === null && max === null) {
      return allServices; // ถ้าไม่กรอง ให้แสดงทั้งหมด
    }
    
    return allServices.filter(service => {
      if (min !== null && service.price < min) return false;
      if (max !== null && service.price > max) return false;
      return true;
    });
  }, [minBudget, maxBudget, allServices]);


  if (loading) {
    return <div className="container"><p>กำลังโหลดบริการในหมวด "{subCategoryName}"...</p></div>;
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">หน้าแรก</Link> / 
        <Link to={`/category/${categoryName}`}>{categoryName}</Link> / 
        <span>{subCategoryName}</span>
      </div>

      <h1>{subCategoryName}</h1>
      <p>บริการทั้งหมดในหมวดหมู่นี้</p>
      
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