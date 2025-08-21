# Automated Invoice Generator

A full-stack web application for generating and managing invoices for freelancers and small businesses.

## Features

- **Client Management**: Add, edit, and manage client information
- **Invoice Creation**: Create detailed invoices with itemized services
- **Tax Calculations**: Support for GST/tax calculations
- **Payment Tracking**: Track payment status and due dates
- **PDF Generation**: Generate downloadable invoice PDFs using iText
- **Email Integration**: Send invoices via email with PDF attachments

## Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Data JPA** for database operations
- **H2 Database** (in-memory for development)
- **iText7** for PDF generation
- **Spring Mail** for email functionality
- **Maven** for dependency management

### Frontend
- **Angular 20+** with TypeScript
- **Bootstrap** for responsive UI
- **Angular Reactive Forms** for form handling
- **HttpClient** for API communication

## Project Structure

```
automated-invoice/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/invoiceapp/
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── service/        # Business logic
│   │   └── controller/     # REST controllers
│   └── pom.xml
├── frontend/               # Angular application
│   ├── src/app/
│   │   ├── components/     # Angular components
│   │   ├── services/       # HTTP services
│   │   └── models/         # TypeScript interfaces
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- Maven 3.6+ (for backend)
- Angular CLI (installed via npm)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. The frontend will start on `http://localhost:4200`

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `GET /api/invoices/{id}/pdf` - Download invoice PDF

## Database Schema

### Client Entity
- id, name, email, phone, address, city, state, zipCode, country, gstNumber
- createdAt, updatedAt

### Invoice Entity
- id, invoiceNumber, invoiceDate, dueDate, subtotal, taxRate, taxAmount, total
- paymentStatus (PENDING, PAID, OVERDUE, CANCELLED)
- notes, terms

### InvoiceItem Entity
- id, description, quantity, unitPrice, total

## Development Status

- ✅ Backend API with Spring Boot
- ✅ Database entities and repositories
- ✅ PDF generation service
- ✅ Angular frontend structure
- ⏳ Frontend components implementation
- ⏳ API integration
- ⏳ Email service configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is for educational purposes.
