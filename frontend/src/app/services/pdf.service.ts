import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  /**
   * Generate PDF from invoice data
   */
  async generateInvoicePDF(invoice: any): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE', pageWidth / 2, 25, { align: 'center' });
      
      // Invoice details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Invoice number and date
      pdf.text(`Invoice #: ${invoice.invoice_number}`, 20, 45);
      pdf.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 55);
      pdf.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 20, 65);
      pdf.text(`Status: ${invoice.payment_status?.toUpperCase()}`, 20, 75);
      
      // Customer details
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bill To:', 20, 95);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${invoice.customer_name}`, 20, 105);
      pdf.text(`${invoice.customer_email}`, 20, 115);
      pdf.text(`${invoice.customer_phone}`, 20, 125);
      
      if (invoice.customer_address) {
        pdf.text(`${invoice.customer_address}`, 20, 135);
      }
      
      // Items table header
      let yPosition = 155;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description', 20, yPosition);
      pdf.text('Qty', 120, yPosition);
      pdf.text('Unit Price', 140, yPosition);
      pdf.text('Total', 170, yPosition);
      
      // Line under header
      pdf.line(20, yPosition + 5, pageWidth - 20, yPosition + 5);
      
      // Items
      pdf.setFont('helvetica', 'normal');
      yPosition += 15;
      
      if (invoice.invoice_items && invoice.invoice_items.length > 0) {
        invoice.invoice_items.forEach((item: any) => {
          pdf.text(item.description, 20, yPosition);
          pdf.text(item.quantity.toString(), 120, yPosition);
          pdf.text(`₹${item.unit_price.toFixed(2)}`, 140, yPosition);
          pdf.text(`₹${(item.quantity * item.unit_price).toFixed(2)}`, 170, yPosition);
          yPosition += 10;
        });
      }
      
      // Totals
      yPosition += 10;
      pdf.line(120, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
      
      pdf.text(`Subtotal: ₹${invoice.subtotal?.toFixed(2) || '0.00'}`, 120, yPosition);
      yPosition += 10;
      pdf.text(`Tax (${invoice.tax_rate || 0}%): ₹${invoice.tax_amount?.toFixed(2) || '0.00'}`, 120, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: ₹${invoice.total?.toFixed(2) || '0.00'}`, 120, yPosition);
      
      // Footer
      if (yPosition < pageHeight - 50) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text('Thank you for your business!', pageWidth / 2, pageHeight - 30, { align: 'center' });
      }
      
      // Save the PDF
      const fileName = `invoice-${invoice.invoice_number || 'draft'}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Generate PDF from HTML element (alternative method)
   */
  async generatePDFFromElement(elementId: string, filename: string = 'invoice.pdf'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;
      
      const x = (pdfWidth - imgScaledWidth) / 2;
      const y = 10;
      
      pdf.addImage(imgData, 'PNG', x, y, imgScaledWidth, imgScaledHeight);
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF from element:', error);
      throw error;
    }
  }
}
