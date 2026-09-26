const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ใส่ Ticketmaster API Key ของคุณที่นี่ หรือตั้งค่าใน Vercel Environment Variables
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY || 
"k2uAz1KC7ugsIt0qSedWtxwYWbVRofms";

// Endpoint สำหรับดึงข้อมูลคอนเสิร์ต
app.get('/api/events', async (req, res) => {
    try {
        const keyword = req.query.keyword || 'music';
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&classificationName=music&keyword=${encodeURIComponent(keyword)}&size=20`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data._embedded || !data._embedded.events) {
            return res.json({ events: [] });
        }

        // Clean & Format Data
        const formattedEvents = data._embedded.events.map(event => {
            const priceRanges = event.priceRanges ? event.priceRanges[0] : null;
            const venue = event._embedded && event._embedded.venues ? event._embedded.venues[0] : {};
            const attractions = event._embedded && event._embedded.attractions ? event._embedded.attractions.map(a => a.name) : [event.name];

            return {
                id: event.id,
                name: event.name,
                artists: attractions.join(', '),
                date: event.dates?.start?.localDate || 'TBA',
                time: event.dates?.start?.localTime || 'TBA',
                venue: venue.name || 'TBA',
                city: venue.city?.name || 'TBA',
                country: venue.country?.name || 'TBA',
                minPrice: priceRanges ? priceRanges.min : 1500,
                maxPrice: priceRanges ? priceRanges.max : 6500,
                currency: priceRanges ? priceRanges.currency : 'THB',
                imageUrl: event.images && event.images.length > 0 ? event.images[0].url : 'https://via.placeholder.com/300',
                ticketmasterUrl: event.url
            };
        });

        res.json({ events: formattedEvents });
    } catch (error) {
        console.error('Error fetching Ticketmaster API:', error);
        res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});