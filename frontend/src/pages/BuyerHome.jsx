import { useState, useEffect } from 'react';
import { Funnel, Search } from 'lucide-react';
import Card from '../components/Card';
import { apiRequest, getItemByName } from '../api';

// <Funnel />
// <Search />
const BuyerHome = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enableFilter, setEnableFilter] = useState(false);
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/buyer/items', { method: 'GET' });
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    setError(null);
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const data = await getItemByName(searchTerm.trim());
        // backend returns a single item; normalize to array for grid
        setItems(data ? [data] : []);
      } catch (err) {
        console.error('Error searching items:', err);
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    } else {
      // empty search resets to full list
      try {
        setLoading(true);
        const data = await apiRequest('/api/buyer/items', { method: 'GET' });
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilter = async () => {
    setEnableFilter(!enableFilter);
    // Implement filter logic here if needed
    if (enableFilter) {
      setLoading(true);
      try {
        const params = new URLSearchParams();
          params.append('price', priceFilter);
          params.append('category', categoryFilter);
          params.append('type', typeFilter);
        const data = await apiRequest(`/api/buyer/items?${params}`, { method: 'GET' });
        console.log(`/api/buyer/items?${params}`);
        console.log(data);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error filtering items:', err);
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to full list when filter is disabled
      try {
        setLoading(true);
        const data = await apiRequest('/api/buyer/items', { method: 'GET' });
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message || 'Failed to load items');
      } finally {
        setLoading(false);
      }
    }
  }


  return (
    <div className="p-6">
      <div className="fixed left-0 top-0 h-screen w-80 z-50">
        {enableFilter && (
          <div className="bg-amber-50 p-4 rounded-lg h-full space-y-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="10">Below 10</option>
                  <option value="10-20">10 - 20</option>
                  <option value="20-50">20 - 50</option>
                  <option value="50-100">50 - 100</option>
                  <option value="100-250">100 - 250</option>
                  <option value="250">Above 250</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="NonVeg">Non Vegetarian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
            </div>
            <button
              className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              onClick={handleFilter}
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-4 mb-6">
        
        <input
          type="text"
          placeholder="Search items..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-white hover:text-amber-600 transition"
          onClick={handleSearch}
        >
          <Search strokeWidth={2.5} />
        </button>
        <button className="px-6 py-2 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition"
        onClick={() => setEnableFilter(!enableFilter)}>
          <Funnel strokeWidth={2.5} />
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-3 text-amber-600">Available Items</h1>
      {loading && <p className="text-gray-500">Loading items...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items.length === 0 && <p className="text-gray-500">No items available</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card
            key={item._id}
            title={item.name}
            description={item.description}
            image={item.image}
            price={item.price}
            category={item.category}
            type={item.type}
            availableQuantity={item.available}
          />
        ))}
      </div>
    </div>
  );
};

export default BuyerHome;