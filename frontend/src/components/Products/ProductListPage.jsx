import React, { useState, useEffect } from 'react';
import ProductGrid from '../Products/ProductGrid';

const ProductListPage = ({ products, title }) => {
  const safeProducts = Array.isArray(products) ? products : [];

  const isSareeCategory = safeProducts.every(p => p.category?.toLowerCase() === 'sarees');
  const isDressesCategory = safeProducts.every(p => p.category?.toLowerCase() === 'dresses');
  const isKidswearCategory = safeProducts.every(p => p.category?.toLowerCase() === 'kidswear');

  const getUniqueValues = (arr, extractor) => {
    const map = new Map();
    arr.forEach(p => {
      const values = extractor(p);
      values.forEach(val => {
        const lower = val?.toLowerCase();
        if (lower && !map.has(lower)) {
          map.set(lower, val);
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  };

  const allColors = getUniqueValues(safeProducts, p => p.colors || []);
  const allSizes = isSareeCategory ? [] : getUniqueValues(safeProducts, p => p.sizes || []);
  const allCollections = getUniqueValues(safeProducts, p => [p.collections].filter(Boolean));
  const allMaterials = getUniqueValues(safeProducts, p => [p.material].filter(Boolean));
  const allWeaves = getUniqueValues(safeProducts, p => [p.ethnic_weave].filter(Boolean));
  const allStyles = isDressesCategory ? getUniqueValues(safeProducts, p => [p.styles].filter(Boolean)) : [];
  const allGenders = isKidswearCategory ? getUniqueValues(safeProducts, p => [p.gender].filter(Boolean)) : [];

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedWeaves, setSelectedWeaves] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState({
    color: false,
    size: false,
    sort: false,
    collection: false,
    material: false,
    weave: false,
    style: false,
    gender: false,
  });
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCollapse = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMultiSelect = (value, selectedValues, setSelectedValues) => {
    const lower = value.toLowerCase();
    if (selectedValues.includes(lower)) {
      setSelectedValues(selectedValues.filter(v => v !== lower));
    } else {
      setSelectedValues([...selectedValues, lower]);
    }
  };

  let filteredProducts = safeProducts.filter(product => {
    const colorMatch =
      selectedColors.length === 0 ||
      selectedColors.some(c => product.colors?.some(pc => c === pc.toLowerCase()));

    const sizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.some(s => product.sizes?.some(sz => s === sz.toLowerCase()));

    const collectionMatch =
      selectedCollections.length === 0 ||
      selectedCollections.includes(product.collections?.toLowerCase());

    const materialMatch =
      selectedMaterials.length === 0 ||
      selectedMaterials.includes(product.material?.toLowerCase());

    const weaveMatch =
      selectedWeaves.length === 0 ||
      selectedWeaves.includes(product.ethnic_weave?.toLowerCase());

    const styleMatch =
      selectedStyles.length === 0 ||
      selectedStyles.includes(product.styles?.toLowerCase());

    const genderMatch =
      selectedGenders.length === 0 ||
      selectedGenders.includes(product.gender?.toLowerCase());

    return colorMatch && sizeMatch && collectionMatch && materialMatch && weaveMatch && styleMatch && genderMatch;
  });

  if (sortOrder === 'lowToHigh') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'highToLow') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const filterSectionStyle = 'mb-6 border-b pb-3';
  const labelStyle = 'text-sm font-medium text-black';
  const checkboxStyle = 'mr-2 accent-black';

  const renderFilterSection = (label, key, options, selected, setter) => (
    <div className={filterSectionStyle}>
      <div
        onClick={() => toggleCollapse(key)}
        className="cursor-pointer flex justify-between items-center font-semibold mb-2"
      >
        <span className="text-base">{label}</span>
        <span>{collapsed[key] ? '+' : '-'}</span>
      </div>
      {!collapsed[key] && (
        <div className="flex flex-col gap-2 max-h-40 overflow-auto">
          {options.map(([lower, display]) => (
            <label key={lower} className={labelStyle}>
              <input
                type="checkbox"
                value={lower}
                checked={selected.includes(lower)}
                onChange={() => handleMultiSelect(display, selected, setter)}
                className={checkboxStyle}
              />
              {display}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const filterContent = (
    <div className="p-4 w-64 bg-white text-black shadow-md text-sm">
      {renderFilterSection('Color', 'color', allColors, selectedColors, setSelectedColors)}
      {!isSareeCategory && renderFilterSection('Size', 'size', allSizes, selectedSizes, setSelectedSizes)}
      {renderFilterSection('Collection', 'collection', allCollections, selectedCollections, setSelectedCollections)}
      {renderFilterSection('Materials', 'material', allMaterials, selectedMaterials, setSelectedMaterials)}
      {!isDressesCategory && !isKidswearCategory && renderFilterSection('Ethnic Weave', 'weave', allWeaves, selectedWeaves, setSelectedWeaves)}
      {isDressesCategory && renderFilterSection('Styles', 'style', allStyles, selectedStyles, setSelectedStyles)}
      {isKidswearCategory && renderFilterSection('Gender', 'gender', allGenders, selectedGenders, setSelectedGenders)}

      <div className={filterSectionStyle}>
        <div
          onClick={() => toggleCollapse('sort')}
          className="cursor-pointer flex justify-between items-center font-semibold mb-2"
        >
          <span className="text-base">Sort by Price</span>
          <span>{collapsed.sort ? '+' : '-'}</span>
        </div>
        {!collapsed.sort && (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">Select</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-24 px-2 sm:px-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

      {safeProducts.length === 0 && (
        <div className="text-center text-gray-500 my-10">No products found.</div>
      )}

      <div className="sm:hidden mb-4 flex justify-end">
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => setSidebarOpen(true)}
        >
          Filters
        </button>
      </div>

      <div className="flex">
        <div className={`hidden sm:block ${isSticky ? 'sticky top-20' : ''} mr-6`}>{filterContent}</div>

        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full z-50 animate-slideIn">
              <div className="flex flex-col h-full bg-white text-black w-64">
                <div className="flex justify-between items-center p-4 border-b">
                  <span className="font-bold text-lg">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-2xl">&times;</button>
                </div>
                {filterContent}
              </div>
            </div>
          </>
        )}

        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ProductListPage;
