

import React from 'react';

function FilterBar({ minBudget, setMinBudget, maxBudget, setMaxBudget }) {
  return (
    <div className="filter-container">
      <input
        type="number"
        placeholder="งบขั้นต่ำ (บาท)"
        value={minBudget}
        onChange={e => setMinBudget(e.target.value)}
      />
      <input
        type="number"
        placeholder="งบสูงสุด (บาท)"
        value={maxBudget}
        onChange={e => setMaxBudget(e.target.value)}
      />
      {/* ในอนาคตเราสามารถเพิ่มตัวกรองอื่นๆ ที่นี่ได้ เช่น เรียงตามคะแนน, ใหม่ล่าสุด */}
    </div>
  );
}

export default FilterBar;