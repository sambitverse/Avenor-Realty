import { INITIAL_PROPERTIES } from '../../src/data/mockData.js';

let propertiesStore = [...INITIAL_PROPERTIES];

export const getProperties = async (req, res) => {
  const { search, purpose, category, city, maxPrice, bedrooms, tag } = req.query;
  let list = [...propertiesStore];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
  }
  if (purpose && purpose !== 'All') list = list.filter(p => p.purpose === purpose);
  if (category && category !== 'All') list = list.filter(p => p.category === category);
  if (city && city !== 'All') list = list.filter(p => p.city === city);
  if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice));
  if (bedrooms && bedrooms !== 'Any') list = list.filter(p => p.bedrooms >= parseInt(bedrooms));

  return res.status(200).json({ success: true, count: list.length, data: list });
};

export const getPropertyById = async (req, res) => {
  const { id } = req.params;
  const prop = propertiesStore.find(p => p.id === id || p._id === id);
  if (!prop) return res.status(404).json({ success: false, error: 'Property not found' });
  return res.status(200).json({ success: true, data: prop });
};

export const createProperty = async (req, res) => {
  const newProp = {
    id: `prop-${Date.now()}`,
    _id: `prop-${Date.now()}`,
    propertyStatus: 'Active',
    approvalStatus: 'Approved',
    ...req.body
  };
  propertiesStore.unshift(newProp);
  return res.status(201).json({ success: true, data: newProp });
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const index = propertiesStore.findIndex(p => p.id === id || p._id === id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Property not found' });
  
  propertiesStore[index] = { ...propertiesStore[index], ...req.body };
  return res.status(200).json({ success: true, data: propertiesStore[index] });
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  propertiesStore = propertiesStore.filter(p => p.id !== id && p._id !== id);
  return res.status(200).json({ success: true, id });
};
