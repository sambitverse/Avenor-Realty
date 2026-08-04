import { INITIAL_PROPERTIES } from '../src/data/mockData.js';

let propertiesStore = [...INITIAL_PROPERTIES];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;

  if (method === 'GET') {
    const { id, purpose, category, city } = req.query || {};
    if (id) {
      const prop = propertiesStore.find(p => p.id === id);
      return prop ? res.status(200).json(prop) : res.status(404).json({ error: 'Property not found' });
    }
    let list = [...propertiesStore];
    if (purpose && purpose !== 'All') list = list.filter(p => p.purpose === purpose);
    if (category && category !== 'All') list = list.filter(p => p.category === category);
    if (city && city !== 'All') list = list.filter(p => p.city === city);
    return res.status(200).json(list);
  }

  if (method === 'POST') {
    const newProp = {
      id: `prop-${Date.now()}`,
      propertyStatus: 'Active',
      approvalStatus: 'Approved',
      ...req.body
    };
    propertiesStore.unshift(newProp);
    return res.status(201).json(newProp);
  }

  if (method === 'PUT') {
    const { id } = req.query || {};
    const index = propertiesStore.findIndex(p => p.id === id);
    if (index !== -1) {
      propertiesStore[index] = { ...propertiesStore[index], ...req.body };
      return res.status(200).json(propertiesStore[index]);
    }
    return res.status(404).json({ error: 'Property not found' });
  }

  if (method === 'DELETE') {
    const { id } = req.query || {};
    propertiesStore = propertiesStore.filter(p => p.id !== id);
    return res.status(200).json({ success: true, id });
  }

  return res.status(455).json({ error: 'Method not supported' });
}
