package com.invoiceapp.service;

import com.invoiceapp.entity.Invoice;
import com.invoiceapp.entity.InvoiceItem;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateInvoicePdf(Invoice invoice) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("INVOICE")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setBold());

            document.add(new Paragraph("\n"));

            // Invoice details
            Table headerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}));
            headerTable.setWidth(UnitValue.createPercentValue(100));

            // Company info (left side)
            Cell companyCell = new Cell();
            companyCell.add(new Paragraph("Your Company Name").setBold());
            companyCell.add(new Paragraph("123 Business Street"));
            companyCell.add(new Paragraph("City, State 12345"));
            companyCell.add(new Paragraph("Phone: (555) 123-4567"));
            companyCell.add(new Paragraph("Email: info@company.com"));
            headerTable.addCell(companyCell);

            // Invoice info (right side)
            Cell invoiceInfoCell = new Cell();
            invoiceInfoCell.add(new Paragraph("Invoice #: " + invoice.getInvoiceNumber()).setBold());
            invoiceInfoCell.add(new Paragraph("Invoice Date: " + 
                    invoice.getInvoiceDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))));
            invoiceInfoCell.add(new Paragraph("Due Date: " + 
                    invoice.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))));
            invoiceInfoCell.add(new Paragraph("Status: " + invoice.getPaymentStatus().toString()));
            headerTable.addCell(invoiceInfoCell);

            document.add(headerTable);
            document.add(new Paragraph("\n"));

            // Bill to
            document.add(new Paragraph("Bill To:").setBold());
            document.add(new Paragraph(invoice.getClient().getName()));
            if (invoice.getClient().getAddress() != null) {
                document.add(new Paragraph(invoice.getClient().getAddress()));
            }
            if (invoice.getClient().getCity() != null) {
                String cityLine = invoice.getClient().getCity();
                if (invoice.getClient().getState() != null) {
                    cityLine += ", " + invoice.getClient().getState();
                }
                if (invoice.getClient().getZipCode() != null) {
                    cityLine += " " + invoice.getClient().getZipCode();
                }
                document.add(new Paragraph(cityLine));
            }
            document.add(new Paragraph("Email: " + invoice.getClient().getEmail()));

            document.add(new Paragraph("\n"));

            // Items table
            Table itemsTable = new Table(UnitValue.createPercentArray(new float[]{50, 15, 15, 20}));
            itemsTable.setWidth(UnitValue.createPercentValue(100));

            // Table headers
            itemsTable.addHeaderCell(new Cell().add(new Paragraph("Description").setBold()));
            itemsTable.addHeaderCell(new Cell().add(new Paragraph("Quantity").setBold()).setTextAlignment(TextAlignment.RIGHT));
            itemsTable.addHeaderCell(new Cell().add(new Paragraph("Unit Price").setBold()).setTextAlignment(TextAlignment.RIGHT));
            itemsTable.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()).setTextAlignment(TextAlignment.RIGHT));

            // Add items
            for (InvoiceItem item : invoice.getItems()) {
                itemsTable.addCell(new Cell().add(new Paragraph(item.getDescription())));
                itemsTable.addCell(new Cell().add(new Paragraph(item.getQuantity().toString())).setTextAlignment(TextAlignment.RIGHT));
                itemsTable.addCell(new Cell().add(new Paragraph("$" + item.getUnitPrice().toString())).setTextAlignment(TextAlignment.RIGHT));
                itemsTable.addCell(new Cell().add(new Paragraph("$" + item.getTotal().toString())).setTextAlignment(TextAlignment.RIGHT));
            }

            document.add(itemsTable);
            document.add(new Paragraph("\n"));

            // Totals
            Table totalsTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}));
            totalsTable.setWidth(UnitValue.createPercentValue(100));

            totalsTable.addCell(new Cell().add(new Paragraph("Subtotal:")).setTextAlignment(TextAlignment.RIGHT));
            totalsTable.addCell(new Cell().add(new Paragraph("$" + invoice.getSubtotal().toString())).setTextAlignment(TextAlignment.RIGHT));

            if (invoice.getTaxRate().compareTo(BigDecimal.ZERO) > 0) {
                totalsTable.addCell(new Cell().add(new Paragraph("Tax (" + invoice.getTaxRate() + "%):")).setTextAlignment(TextAlignment.RIGHT));
                totalsTable.addCell(new Cell().add(new Paragraph("$" + invoice.getTaxAmount().toString())).setTextAlignment(TextAlignment.RIGHT));
            }

            totalsTable.addCell(new Cell().add(new Paragraph("Total:").setBold()).setTextAlignment(TextAlignment.RIGHT));
            totalsTable.addCell(new Cell().add(new Paragraph("$" + invoice.getTotal().toString()).setBold()).setTextAlignment(TextAlignment.RIGHT));

            document.add(totalsTable);

            // Notes and terms
            if (invoice.getNotes() != null && !invoice.getNotes().isEmpty()) {
                document.add(new Paragraph("\n"));
                document.add(new Paragraph("Notes:").setBold());
                document.add(new Paragraph(invoice.getNotes()));
            }

            if (invoice.getTerms() != null && !invoice.getTerms().isEmpty()) {
                document.add(new Paragraph("\n"));
                document.add(new Paragraph("Terms:").setBold());
                document.add(new Paragraph(invoice.getTerms()));
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }
}
