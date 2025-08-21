package com.invoiceapp.service;

import com.invoiceapp.entity.Invoice;
import com.invoiceapp.entity.InvoiceItem;
import com.invoiceapp.entity.Client;
import com.invoiceapp.repository.InvoiceRepository;
import com.invoiceapp.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public Optional<Invoice> getInvoiceByNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber);
    }

    public List<Invoice> getInvoicesByClient(Long clientId) {
        return invoiceRepository.findByClientId(clientId);
    }

    public List<Invoice> getInvoicesByStatus(Invoice.PaymentStatus status) {
        return invoiceRepository.findByPaymentStatus(status);
    }

    public List<Invoice> getOverdueInvoices() {
        return invoiceRepository.findByDueDateBefore(LocalDate.now());
    }

    public List<Invoice> getInvoicesByDateRange(LocalDate startDate, LocalDate endDate) {
        return invoiceRepository.findByDateRange(startDate, endDate);
    }

    public Invoice createInvoice(Invoice invoice) {
        // Set client
        if (invoice.getClient() != null && invoice.getClient().getId() != null) {
            Client client = clientRepository.findById(invoice.getClient().getId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            invoice.setClient(client);
        }

        // Generate invoice number if not provided
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateInvoiceNumber());
        }

        // Set invoice reference for items
        if (invoice.getItems() != null) {
            for (InvoiceItem item : invoice.getItems()) {
                item.setInvoice(invoice);
                item.calculateTotal();
            }
        }

        // Calculate totals
        invoice.calculateTotals();

        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(Long id, Invoice invoiceDetails) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));

        // Update basic fields
        invoice.setInvoiceDate(invoiceDetails.getInvoiceDate());
        invoice.setDueDate(invoiceDetails.getDueDate());
        invoice.setTaxRate(invoiceDetails.getTaxRate());
        invoice.setNotes(invoiceDetails.getNotes());
        invoice.setTerms(invoiceDetails.getTerms());
        invoice.setPaymentStatus(invoiceDetails.getPaymentStatus());

        // Update client if provided
        if (invoiceDetails.getClient() != null && invoiceDetails.getClient().getId() != null) {
            Client client = clientRepository.findById(invoiceDetails.getClient().getId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            invoice.setClient(client);
        }

        // Update items
        if (invoiceDetails.getItems() != null) {
            // Clear existing items
            invoice.getItems().clear();
            
            // Add new items
            for (InvoiceItem item : invoiceDetails.getItems()) {
                item.setInvoice(invoice);
                item.calculateTotal();
                invoice.getItems().add(item);
            }
        }

        // Recalculate totals
        invoice.calculateTotals();

        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        invoiceRepository.delete(invoice);
    }

    public Invoice updatePaymentStatus(Long id, Invoice.PaymentStatus status) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        invoice.setPaymentStatus(status);
        return invoiceRepository.save(invoice);
    }

    private String generateInvoiceNumber() {
        Integer maxSequence = invoiceRepository.findMaxInvoiceSequence();
        int nextSequence = (maxSequence != null ? maxSequence : 0) + 1;
        return String.format("INV-%04d", nextSequence);
    }

    public boolean existsByInvoiceNumber(String invoiceNumber) {
        return invoiceRepository.existsByInvoiceNumber(invoiceNumber);
    }
}
