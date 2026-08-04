const bookingsStore = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json(bookingsStore);
  }

  if (req.method === 'POST') {
    const booking = {
      id: `bk-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    bookingsStore.unshift(booking);
    return res.status(201).json({ success: true, booking });
  }

  return res.status(405).end();
}
