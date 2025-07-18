const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // This line allows parsing of JSON request bodies

// In-memory storage for lab orders
let labOrders = [
    { id: 1, patientId: "123", testType: "Blood Test" },
    { id: 2, patientId: "456", testType: "X-Ray" }
];

app.get('/', (req, res) => {
    res.send('Lab Order/Result Tracking Dashboard API');
});

// GET all lab orders
app.get('/api/lab-orders', (req, res) => {
    res.json(labOrders);
});

// GET a specific lab order by ID
app.get('/api/lab-orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const order = labOrders.find(order => order.id === id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: "Lab order not found" });
    }
});

// POST a new lab order
app.post('/api/lab-orders', (req, res) => {
    const newOrder = {
        id: labOrders.length + 1,
        ...req.body
    };
    labOrders.push(newOrder);
    res.status(201).json(newOrder);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
