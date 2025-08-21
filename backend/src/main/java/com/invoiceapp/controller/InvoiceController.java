package com.invoiceapp.controller;

import com.invoiceapp.entity.Invoice;
import com.invoiceapp.service.InvoiceService;
import com.invoiceapp.service.PdfService;
import com.invoiceapp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        List<Invoice> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Optional<Invoice> invoice = invoiceService.getInvoiceById(id);
        return invoice.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<Invoice> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        Optional<Invoice> invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        return invoice.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Invoice>> getInvoicesByClient(@PathVariable Long clientId) {
        List<Invoice> invoices = invoiceService.getInvoicesByClient(clientId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Invoice>> getInvoicesByStatus(@PathVariable Invoice.PaymentStatus status) {
        List<Invoice> invoices = invoiceService.getInvoicesByStatus(status);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Invoice>> getOverdueInvoices() {
        List<Invoice> invoices = invoiceService.getOverdueInvoices();
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Invoice>> getInvoicesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Invoice> invoices = invoiceService.getInvoicesByDateRange(startDate, endDate);
        return ResponseEntity.ok(invoices);
    }

    @PostMapping
    public ResponseEntity<?> createInvoice(@Valid @RequestBody Invoice invoice) {
        try {
            Invoice savedInvoice = invoiceService.createInvoice(invoice);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedInvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating invoice: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(@PathVariable Long id, @Valid @RequestBody Invoice invoiceDetails) {
        try {
            Invoice updatedInvoice = invoiceService.updateInvoice(id, invoiceDetails);
            return ResponseEntity.ok(updatedInvoice);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating invoice: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam Invoice.PaymentStatus status) {
        try {
            Invoice updatedInvoice = invoiceService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedInvoice);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating payment status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting invoice: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long id) {
        try {
            Optional<Invoice> invoiceOpt = invoiceService.getInvoiceById(id);
            if (invoiceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Invoice invoice = invoiceOpt.get();
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Invoice_" + invoice.getInvoiceNumber() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/send-email")
    public ResponseEntity<?> sendInvoiceEmail(@PathVariable Long id, 
                                            @RequestParam(required = false) String toEmail,
                                            @RequestParam(required = false) String subject,
                                            @RequestParam(required = false) String body) {
        try {
            Optional<Invoice> invoiceOpt = invoiceService.getInvoiceById(id);
            if (invoiceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Invoice invoice = invoiceOpt.get();
            String email = toEmail != null ? toEmail : invoice.getClient().getEmail();
            
            emailService.sendInvoiceEmail(invoice, email, subject, body);
            return ResponseEntity.ok().body("Invoice email sent successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending email: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/send-reminder")
    public ResponseEntity<?> sendPaymentReminder(@PathVariable Long id) {
        try {
            Optional<Invoice> invoiceOpt = invoiceService.getInvoiceById(id);
            if (invoiceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Invoice invoice = invoiceOpt.get();
            emailService.sendPaymentReminder(invoice);
            return ResponseEntity.ok().body("Payment reminder sent successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending reminder: " + e.getMessage());
        }
    }
}
