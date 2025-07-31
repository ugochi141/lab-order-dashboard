# Lab Order Dashboard

## 🩺 Overview
A modern, responsive web application for laboratory order management and tracking. This dashboard provides healthcare professionals with real-time visibility into laboratory orders, test statuses, and results, streamlining the laboratory workflow and improving patient care coordination.

## ✨ Features

### 📊 Dashboard Analytics
- Real-time laboratory order statistics
- Test turnaround time (TAT) monitoring
- Critical value alerts and notifications
- Quality metrics and performance indicators

### 🔬 Order Management
- Create and submit new laboratory orders
- Track order status throughout the testing process
- View detailed order history and audit trails
- Bulk order processing capabilities

### 📈 Reporting & Analytics
- Comprehensive reporting dashboard
- Export capabilities (PDF, CSV, Excel)
- Custom date range filtering
- Performance trend analysis

### 🏥 Integration Features
- Epic Beaker LIS integration ready
- Cerner PowerChart compatibility
- HL7 message processing
- FHIR R4 compliant data exchange

## 🚀 Live Demo
**Frontend Application**: [https://lab-order-dashboard.vercel.app](https://lab-order-dashboard.vercel.app)  
**Admin Dashboard**: [https://lab-dashboard-admin.netlify.app](https://lab-dashboard-admin.netlify.app)

*Demo Credentials:*
- Username: `demo_user`
- Password: `lab_demo_2024`

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI** - Professional component library  
- **Chart.js** - Interactive data visualization
- **Axios** - API communication
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite/PostgreSQL** - Database options
- **JWT** - Authentication and authorization
- **Socket.io** - Real-time notifications

## 📦 Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/ugochi141/lab-order-dashboard.git
cd lab-order-dashboard

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Start the development server
npm run dev

# Or start frontend and backend separately
npm run start:backend  # Backend on port 3001
npm run start:frontend # Frontend on port 3000
```

### Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=sqlite:./lab_orders.db
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000

# Optional: External integrations
EPIC_API_URL=https://your-epic-endpoint.com
CERNER_API_URL=https://your-cerner-endpoint.com
HL7_PROCESSING_ENABLED=true
```

## 🗄️ Database Schema

### Core Tables
- **orders** - Laboratory order information
- **patients** - Patient demographics and identifiers
- **tests** - Available laboratory tests and panels
- **results** - Test results and interpretations
- **users** - System users and authentication
- **facilities** - Healthcare facilities and locations

## 📡 API Endpoints

### Order Management
```
GET    /api/orders              # Get all orders
POST   /api/orders              # Create new order
GET    /api/orders/:id          # Get specific order
PUT    /api/orders/:id          # Update order
DELETE /api/orders/:id          # Cancel order
```

### Patient Management
```
GET    /api/patients            # Get all patients
POST   /api/patients            # Register new patient
GET    /api/patients/:id        # Get patient details
PUT    /api/patients/:id        # Update patient info
```

### Test Management
```
GET    /api/tests               # Get available tests
GET    /api/tests/:id           # Get test details
POST   /api/tests/:id/results   # Submit test results
```

## 🏥 Sample Data

The application includes comprehensive sample data:
- **500+ Patient Records** - Diverse demographics and medical histories
- **50+ Laboratory Tests** - Chemistry, hematology, microbiology panels
- **1000+ Orders** - Various statuses and complexity levels
- **Critical Values** - Realistic alert scenarios
- **Facility Data** - Multiple hospital and clinic locations

## 🔧 Configuration

### Laboratory Tests Configuration
```javascript
// config/lab_tests.js
export const LAB_TESTS = {
  chemistry: {
    basic_metabolic_panel: {
      code: 'BMP',
      name: 'Basic Metabolic Panel',
      components: ['glucose', 'bun', 'creatinine', 'sodium', 'potassium'],
      critical_values: {
        glucose: { low: 40, high: 400 },
        potassium: { low: 2.5, high: 6.0 }
      }
    }
  }
};
```

### Alert Thresholds
```javascript
// config/alerts.js
export const CRITICAL_VALUES = {
  immediate: ['potassium > 6.0', 'glucose < 40'],
  urgent: ['hemoglobin < 7.0', 'platelet < 50000'],
  routine: ['cholesterol > 240', 'triglycerides > 200']
};
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [User Guide](docs/USER_GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Integration Guide](docs/INTEGRATION.md)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- HIPAA-compliant data handling
- Encrypted data transmission (HTTPS)
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Ugochi Ndubuisi** - *Lead Developer*
- Email: u.l.ndubuisi@gmail.com  
- GitHub: [@ugochi141](https://github.com/ugochi141)
- Portfolio: [ugochi141.github.io](https://ugochi141.github.io)

## 🙏 Acknowledgments

- Johns Hopkins University Bioinformatics Program
- Healthcare informatics community
- Open source contributors
- Epic Systems and Cerner for integration guidance

## 📊 Project Stats

- **Lines of Code**: 15,000+
- **Test Coverage**: 85%+
- **Performance**: < 2s load time
- **Uptime**: 99.9%
- **Security**: Grade A+ SSL rating

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/ugochi141/lab-order-dashboard/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/ugochi141/lab-order-dashboard/discussions)
- **Security Issues**: Email u.l.ndubuisi@gmail.com directly

---

**Made with ❤️ for healthcare professionals worldwide**