package com.invoiceapp.service;

import com.invoiceapp.entity.Invoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PdfService pdfService;

    @Value("${spring.mail.username:your-email@gmail.com}")
    private String fromEmail;

    public void sendInvoiceEmail(Invoice invoice, String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject != null ? subject : "Invoice " + invoice.getInvoiceNumber());

            String emailBody = body != null ? body : 
                "Dear " + invoice.getClient().getName() + ",\n\n" +
                "Please find attached invoice " + invoice.getInvoiceNumber() + " for your review.\n\n" +
                "Invoice Details:\n" +
                "Invoice Number: " + invoice.getInvoiceNumber() + "\n" +
                "Invoice Date: " + invoice.getInvoiceDate() + "\n" +
                "Due Date: " + invoice.getDueDate() + "\n" +
                "Total Amount: $" + invoice.getTotal() + "\n\n" +
                "Thank you for your business!\n\n" +
                "Best regards,\n" +
                "Your Company Name";

            helper.setText(emailBody);

            // Generate and attach PDF
            byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);
            helper.addAttachment("Invoice_" + invoice.getInvoiceNumber() + ".pdf", 
                    new ByteArrayResource(pdfBytes));

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public void sendPaymentReminder(Invoice invoice) {
        String subject = "Payment Reminder - Invoice " + invoice.getInvoiceNumber();
        String body = "Dear " + invoice.getClient().getName() + ",\n\n" +
                "This is a friendly reminder that invoice " + invoice.getInvoiceNumber() + 
                " is due on " + invoice.getDueDate() + ".\n\n" +
                "Total Amount Due: $" + invoice.getTotal() + "\n\n" +
                "Please process the payment at your earliest convenience.\n\n" +
                "Thank you,\n" +
                "Your Company Name";

        sendInvoiceEmail(invoice, invoice.getClient().getEmail(), subject, body);
    }
}
