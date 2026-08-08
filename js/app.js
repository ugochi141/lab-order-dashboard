/**
 * Lab Order Dashboard Frontend Application
 * Handles all frontend functionality including API communication, charts, and user interactions
 */

class LabOrderDashboard {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.charts = {};
        this.orders = [];
        this.filteredOrders = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadInitialData();
            this.setupEventListeners();
            this.initializeCharts();
            this.hideLoading();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showAlert('Error initializing dashboard', 'danger');
            this.hideLoading();
        }
    }

    // Data Loading Methods
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadOrders(),
                this.loadDashboardMetrics(),
                this.loadCriticalAlerts()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Use mock data if API fails
            this.loadMockData();
        }
    }

    async loadOrders() {
        // Static-demo mode: use generated mock data (no backend deployed)
        this.orders = this.generateMockOrders();
        this.filteredOrders = [...this.orders];
        this.updateOrdersTable();
        this.updateRecentOrdersTable();
    }

    async loadDashboardMetrics() {
        const metrics = this.calculateMetrics();
        this.updateMetrics(metrics);
    }

    async loadCriticalAlerts() {
        const criticalOrders = this.orders.filter(order => 
            order.priority === 'STAT' || order.test_name.includes('Troponin') || 
            order.test_name.includes('Cardiac')
        );
        this.updateCriticalAlerts(criticalOrders.slice(0, 5));
    }

    // Mock Data Generation
    generateMockOrders() {
        const orders = [];
        const patients = [
            'John Smith', 'Maria Garcia', 'David Johnson', 'Jennifer Williams',
            'Robert Brown', 'Lisa Davis', 'Michael Miller', 'Sarah Wilson',
            'Christopher Moore', 'Jessica Taylor', 'Matthew Anderson', 'Ashley Thomas'
        ];
        
        const tests = [
            'Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 
            'Comprehensive Metabolic Panel (CMP)', 'Lipid Panel',
            'Thyroid Function Tests', 'Liver Function Tests',
            'Cardiac Markers', 'Coagulation Studies', 'Urinalysis', 'Blood Culture'
        ];
        
        const departments = ['Emergency Department', 'ICU', 'Medical Ward', 'Surgical Ward', 'Outpatient'];
        const physicians = ['Dr. Johnson', 'Dr. Smith', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
        const statuses = ['received', 'processing', 'completed', 'reported'];
        const priorities = ['Routine', 'Urgent', 'STAT'];

        for (let i = 1; i <= 50; i++) {
            const orderDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Calculate TAT based on priority and status
            let tatHours = Math.random() * 24;
            if (priority === 'STAT') tatHours = Math.random() * 2;
            else if (priority === 'Urgent') tatHours = Math.random() * 6;
            
            orders.push({
                order_id: `ORD${String(i).padStart(8, '0')}`,
                patient_name: patients[Math.floor(Math.random() * patients.length)],
                patient_mrn: `MRN${String(100000 + i).padStart(6, '0')}`,
                age: Math.floor(Math.random() * 80) + 18,
                gender: Math.random() > 0.5 ? 'M' : 'F',
                test_name: tests[Math.floor(Math.random() * tests.length)],
                department: departments[Math.floor(Math.random() * departments.length)],
                priority: priority,
                status: status,
                order_date: orderDate.toISOString(),
                physician: physicians[Math.floor(Math.random() * physicians.length)],
                tat_hours: Math.round(tatHours * 10) / 10,
                specimen_type: Math.random() > 0.7 ? 'Urine' : 'Blood',
                critical: Math.random() < 0.1 // 10% critical
            });
        }
        
        return orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    }

    loadMockData() {
        this.orders = this.generateMockOrders();
        this.filteredOrders = [...this.orders];
    }

    // Metrics Calculation
    calculateMetrics() {
        const total = this.orders.length;
        const completed = this.orders.filter(o => o.status === 'completed' || o.status === 'reported').length;
        const pending = this.orders.filter(o => o.status === 'received' || o.status === 'processing').length;
        const critical = this.orders.filter(o => o.critical || o.priority === 'STAT').length;

        return { total, completed, pending, critical };
    }

    // UI Update Methods
    updateMetrics(metrics) {
        document.getElementById('totalOrders').textContent = metrics.total;
        document.getElementById('completedOrders').textContent = metrics.completed;
        document.getElementById('pendingOrders').textContent = metrics.pending;
        document.getElementById('criticalAlerts').textContent = metrics.critical;
    }

    updateRecentOrdersTable() {
        const tbody = document.getElementById('recentOrdersTable');
        const recentOrders = this.orders.slice(0, 8);
        
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.patient_name}</td>
                <td>${order.test_name.length > 25 ? order.test_name.substring(0, 25) + '...' : order.test_name}</td>
                <td><span class="status-badge priority-${order.priority.toLowerCase()}">${order.priority}</span></td>
                <td><span class="status-badge status-${order.status.replace(' ', '')}">${order.status}</span></td>
                <td>${new Date(order.order_date).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    updateOrdersTable() {
        const tbody = document.getElementById('ordersTable');
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageOrders = this.filteredOrders.slice(startIndex, endIndex);
        
        tbody.innerHTML = pageOrders.map(order => `
            <tr>
                <td>${order.order_id}</td>
                <td>
                    <strong>${order.patient_name}</strong><br>
                    <small>MRN: ${order.patient_mrn} | ${order.age}/${order.gender}</small>
                </td>
                <td>
                    <strong>${order.test_name}</strong><br>
                    <small>${order.department}</small>
                </td>
                <td><span class="status-badge priority-${order.priority.toLowerCase()}">${order.priority}</span></td>
                <td><span class="status-badge status-${order.status.replace(' ', '')}">${order.status}</span></td>
                <td>${order.tat_hours}h</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="dashboard.viewOrder('${order.order_id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="dashboard.printOrder('${order.order_id}')">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
        const pagination = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="dashboard.changePage(${this.currentPage - 1})">Previous</a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="dashboard.changePage(${i})">${i}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="dashboard.changePage(${this.currentPage + 1})">Next</a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    updateCriticalAlerts(alerts) {
        const container = document.getElementById('criticalAlertsSection');
        
        if (alerts.length === 0) {
            container.innerHTML = '<div class="alert alert-success">No critical alerts at this time.</div>';
            return;
        }
        
        container.innerHTML = alerts.map(alert => `
            <div class="critical-alert">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong><i class="fas fa-exclamation-triangle text-danger"></i> ${alert.test_name}</strong><br>
                        <strong>Patient:</strong> ${alert.patient_name} (${alert.patient_mrn})<br>
                        <strong>Department:</strong> ${alert.department} | <strong>Physician:</strong> ${alert.physician}<br>
                        <strong>Order Time:</strong> ${new Date(alert.order_date).toLocaleString()}
                    </div>
                    <div>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.acknowledgeAlert('${alert.order_id}')">
                            <i class="fas fa-check"></i> Acknowledge
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Chart Initialization
    initializeCharts() {
        this.initStatusChart();
        this.initDepartmentChart();
        this.initTATChart();
        this.initTrendChart();
    }

    initStatusChart() {
        const ctx = document.getElementById('statusChart').getContext('2d');
        const statusCounts = this.orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#17a2b8', '#ffc107', '#28a745', '#6f42c1', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initDepartmentChart() {
        const ctx = document.getElementById('departmentChart').getContext('2d');
        const deptCounts = this.orders.reduce((acc, order) => {
            acc[order.department] = (acc[order.department] || 0) + 1;
            return acc;
        }, {});

        this.charts.department = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(deptCounts),
                datasets: [{
                    label: 'Orders',
                    data: Object.values(deptCounts),
                    backgroundColor: '#0066cc'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initTATChart() {
        const ctx = document.getElementById('tatChart').getContext('2d');
        const tatData = this.orders.filter(o => o.tat_hours).map(o => o.tat_hours);
        
        // Create TAT ranges
        const ranges = { '0-2h': 0, '2-6h': 0, '6-12h': 0, '12-24h': 0, '>24h': 0 };
        tatData.forEach(tat => {
            if (tat <= 2) ranges['0-2h']++;
            else if (tat <= 6) ranges['2-6h']++;
            else if (tat <= 12) ranges['6-12h']++;
            else if (tat <= 24) ranges['12-24h']++;
            else ranges['>24h']++;
        });

        this.charts.tat = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    label: 'Number of Orders',
                    data: Object.values(ranges),
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // Generate daily data for last 30 days
        const days = [];
        const orderCounts = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString());
            
            // Count orders for this day
            const dayOrders = this.orders.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate.toDateString() === date.toDateString();
            }).length;
            
            orderCounts.push(dayOrders);
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Orders',
                    data: orderCounts,
                    borderColor: '#0066cc',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        display: false // Hide x-axis labels for cleaner look
                    }
                }
            }
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Form submission
        document.getElementById('newOrderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitNewOrder();
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    // User Action Methods
    async submitNewOrder() {
        const formData = new FormData(document.getElementById('newOrderForm'));
        const orderData = {
            patient_mrn: formData.get('patientMRN'),
            patient_name: formData.get('patientName'),
            test_name: formData.get('testType'),
            priority: formData.get('priority'),
            physician: formData.get('orderingPhysician'),
            department: formData.get('department'),
            clinical_indication: formData.get('clinicalIndication'),
            specimen_type: formData.get('specimenType'),
            collection_date: formData.get('collectionDate')
        };

        // Static-demo mode: push into in-memory orders array (no backend)
        const nextId = `ORD${String(this.orders.length + 1).padStart(8, '0')}`;
        this.orders.unshift({
            order_id: nextId,
            ...orderData,
            status: 'Pending',
            order_date: new Date().toISOString(),
        });
        this.filteredOrders = [...this.orders];
        this.updateOrdersTable();
        this.updateRecentOrdersTable();
        this.showAlert('Order created (demo mode)', 'success');
        document.getElementById('newOrderForm').reset();

        // Switch to orders tab
        const ordersTab = new bootstrap.Tab(document.getElementById('orders-tab'));
        ordersTab.show();
    }

    applyFilters() {
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const departmentFilter = document.getElementById('departmentFilter').value;
        const searchFilter = document.getElementById('searchPatient').value.toLowerCase();

        this.filteredOrders = this.orders.filter(order => {
            const matchesStatus = !statusFilter || order.status === statusFilter;
            const matchesPriority = !priorityFilter || order.priority === priorityFilter;
            const matchesDepartment = !departmentFilter || order.department === departmentFilter;
            const matchesSearch = !searchFilter || 
                order.patient_name.toLowerCase().includes(searchFilter) ||
                order.patient_mrn.toLowerCase().includes(searchFilter);
            
            return matchesStatus && matchesPriority && matchesDepartment && matchesSearch;
        });

        this.currentPage = 1;
        this.updateOrdersTable();
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateOrdersTable();
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.order_id === orderId);
        if (order) {
            alert(`Order Details:\n\nOrder ID: ${order.order_id}\nPatient: ${order.patient_name}\nTest: ${order.test_name}\nStatus: ${order.status}\nPriority: ${order.priority}`);
        }
    }

    printOrder(orderId) {
        this.showAlert('Print functionality would be implemented here', 'info');
    }

    acknowledgeAlert(orderId) {
        this.showAlert('Alert acknowledged', 'success');
        setTimeout(() => {
            this.loadCriticalAlerts();
        }, 1000);
    }

    exportOrders() {
        const csv = this.convertToCSV(this.filteredOrders);
        this.downloadCSV(csv, 'lab_orders.csv');
    }

    resetForm() {
        document.getElementById('newOrderForm').reset();
    }

    // Utility Methods
    async refreshData() {
        try {
            await this.loadOrders();
            await this.loadDashboardMetrics();
            this.updateCharts();
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }

    updateCharts() {
        // Update chart data
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        
        this.initializeCharts();
    }

    convertToCSV(data) {
        const headers = ['Order ID', 'Patient Name', 'MRN', 'Test Name', 'Department', 'Priority', 'Status', 'Order Date'];
        const rows = data.map(order => [
            order.order_id,
            order.patient_name,
            order.patient_mrn,
            order.test_name,
            order.department,
            order.priority,
            order.status,
            order.order_date
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    showAlert(message, type = 'info') {
        const alertsContainer = document.getElementById('alerts');
        const alertId = 'alert_' + Date.now();
        
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${alertId}">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertsContainer.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                alertElement.remove();
            }
        }, 5000);
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
}

// Global functions for event handlers
window.applyFilters = function() {
    dashboard.applyFilters();
};

window.exportOrders = function() {
    dashboard.exportOrders();
};

window.resetForm = function() {
    dashboard.resetForm();
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new LabOrderDashboard();
});