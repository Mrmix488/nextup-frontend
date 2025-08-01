
import React from 'react';

function SubCategoryFilter({ services, selectedSubCategory, onSelectSubCategory }) {
  
  if (!services || services.length < 2) {
    return null;
  }

  
  const subCategories = [...new Set(services.map(s => s.subcategory).filter(Boolean))]; 

  
  if (subCategories.length <= 1) {
    return null;
  }

  return (
    <div className="subcategory-filter-container">
      {/* เพิ่มปุ่ม "ทั้งหมด" สำหรับหมวดหมู่ย่อย */}
      <button
        onClick={() => onSelectSubCategory(null)} 
        className={!selectedSubCategory ? 'active' : ''}
      >
        ทั้งหมด
      </button>

      {subCategories.map(subCat => (
        <button
          key={subCat}
          onClick={() => onSelectSubCategory(subCat)}
          className={selectedSubCategory === subCat ? 'active' : ''}
        >
          {subCat}
        </button>
      ))}
    </div>
  );
}

export default SubCategoryFilter;