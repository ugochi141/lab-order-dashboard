const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Enhanced mock data for lab orders
let labOrders = [
    {
        order_id: "ORD00000001",
        patient_name: "John Smith",
        patient_mrn: "MRN100001",
        age: 45,
        gender: "M",
        test_name: "Complete Blood Count (CBC)",
        department: "Emergency Department",
        priority: "STAT",
        status: "processing",
        order_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        physician: "Dr. Johnson",
        tat_hours: 1.5,
        specimen_type: "Blood",
        critical: true,
        clinical_indication: "Chest pain workup"
    },
    {
        order_id: "ORD00000002",
        patient_name: "Maria Garcia",
        patient_mrn: "MRN100002",
        age: 32,
        gender: "F",
        test_name: "Basic Metabolic Panel (BMP)",
        department: "ICU",
        priority: "Urgent",
        status: "completed",
        order_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        physician: "Dr. Smith",
        tat_hours: 3.2,
        specimen_type: "Blood",
        critical: false,
        clinical_indication: "Routine monitoring"
    },
    {
        order_id: "ORD00000003",
        patient_name: "David Johnson",
        patient_mrn: "MRN100003",
        age: 67,
        gender: "M",
        test_name: "Cardiac Markers",
        department: "Emergency Department",
        priority: "STAT",
        status: "reported",
        order_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        physician: "Dr. Williams",
        tat_hours: 0.8,
        specimen_type: "Blood",
        critical: true,
        clinical_indication: "Suspected MI"
    },
    {
        order_id: "ORD00000004",
        patient_name: "Jennifer Williams",
        patient_mrn: "MRN100004",
        age: 28,
        gender: "F",
        test_name: "Urinalysis",
        department: "Outpatient",
        priority: "Routine",
        status: "received",
        order_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        physician: "Dr. Brown",
        tat_hours: 2.0,
        specimen_type: "Urine",
        critical: false,
        clinical_indication: "UTI symptoms"
    },
    {
        order_id: "ORD00000005",
        patient_name: "Robert Brown",
        patient_mrn: "MRN100005",
        age: 55,
        gender: "M",
        test_name: "Liver Function Tests",
        department: "Medical Ward",
        priority: "Urgent",
        status: "processing",
        order_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        physician: "Dr. Davis",
        tat_hours: 4.5,
        specimen_type: "Blood",
        critical: false,
        clinical_indication: "Abnormal LFTs"
    }
];

// Generate additional mock orders
function generateAdditionalOrders() {
    const names = ['Lisa Davis', 'Michael Miller', 'Sarah Wilson', 'Christopher Moore', 'Jessica Taylor'];
    const tests = ['Thyroid Panel', 'Lipid Panel', 'Coagulation Studies', 'Blood Culture', 'CMP'];
    const depts = ['Medical Ward', 'Surgical Ward', 'ICU', 'Emergency Department', 'Outpatient'];
    const physicians = ['Dr. Anderson', 'Dr. Thomas', 'Dr. Jackson', 'Dr. White', 'Dr. Harris'];
    const priorities = ['Routine', 'Urgent', 'STAT'];
    const statuses = ['received', 'processing', 'completed', 'reported'];

    for (let i = 6; i <= 25; i++) {
        const orderDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        labOrders.push({
            order_id: `ORD${String(i).padStart(8, '0')}`,
            patient_name: names[Math.floor(Math.random() * names.length)],
            patient_mrn: `MRN${String(100000 + i).padStart(6, '0')}`,
            age: Math.floor(Math.random() * 80) + 18,
            gender: Math.random() > 0.5 ? 'M' : 'F',
            test_name: tests[Math.floor(Math.random() * tests.length)],
            department: depts[Math.floor(Math.random() * depts.length)],
            priority: priority,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            order_date: orderDate.toISOString(),
            physician: physicians[Math.floor(Math.random() * physicians.length)],
            tat_hours: Math.round((Math.random() * 24) * 10) / 10,
            specimen_type: Math.random() > 0.7 ? 'Urine' : 'Blood',
            critical: Math.random() < 0.1,
            clinical_indication: 'Standard workup'
        });
    }
}

generateAdditionalOrders();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// API Routes matching frontend expectations
app.get('/api/orders', (req, res) => {
    try {
        res.json(labOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/orders/:id', (req, res) => {
    try {
        const orderId = req.params.id;
        const order = labOrders.find(order => order.order_id === orderId);
        
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: "Lab order not found" });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const newOrderId = `ORD${String(labOrders.length + 1).padStart(8, '0')}`;
        
        const newOrder = {
            order_id: newOrderId,
            patient_name: req.body.patient_name || '',
            patient_mrn: req.body.patient_mrn || '',
            age: req.body.age || 0,
            gender: req.body.gender || 'U',
            test_name: req.body.test_name || '',
            department: req.body.department || 'Outpatient',
            priority: req.body.priority || 'Routine',
            status: 'received',
            order_date: new Date().toISOString(),
            physician: req.body.physician || 'Dr. Unknown',
            tat_hours: 0,
            specimen_type: req.body.specimen_type || 'Blood',
            critical: false,
            clinical_indication: req.body.clinical_indication || ''
        };
        
        labOrders.unshift(newOrder); // Add to beginning of array
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    try {
        const orderId = req.params.id;
        const orderIndex = labOrders.findIndex(order => order.order_id === orderId);
        
        if (orderIndex !== -1) {
            labOrders[orderIndex] = { ...labOrders[orderIndex], ...req.body };
            res.json(labOrders[orderIndex]);
        } else {
            res.status(404).json({ error: "Lab order not found" });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
    try {
        const orderId = req.params.id;
        const orderIndex = labOrders.findIndex(order => order.order_id === orderId);
        
        if (orderIndex !== -1) {
            const deletedOrder = labOrders.splice(orderIndex, 1)[0];
            res.json({ message: "Order deleted successfully", order: deletedOrder });
        } else {
            res.status(404).json({ error: "Lab order not found" });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get dashboard metrics
app.get('/api/metrics', (req, res) => {
    try {
        const total = labOrders.length;
        const completed = labOrders.filter(o => o.status === 'completed' || o.status === 'reported').length;
        const pending = labOrders.filter(o => o.status === 'received' || o.status === 'processing').length;
        const critical = labOrders.filter(o => o.critical || o.priority === 'STAT').length;

        res.json({ total, completed, pending, critical });
    } catch (error) {
        console.error('Error getting metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get critical alerts
app.get('/api/alerts', (req, res) => {
    try {
        const criticalOrders = labOrders.filter(order => 
            order.critical || order.priority === 'STAT' || 
            order.test_name.includes('Troponin') || order.test_name.includes('Cardiac')
        );
        res.json(criticalOrders);
    } catch (error) {
        console.error('Error getting alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Lab Order Dashboard Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}`);
    console.log(`🔌 API endpoints available at http://localhost:${PORT}/api/orders`);
});
