package com.invoiceapp.repository;

import com.invoiceapp.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByClientId(Long clientId);
    
    List<Invoice> findByPaymentStatus(Invoice.PaymentStatus paymentStatus);
    
    List<Invoice> findByDueDateBefore(LocalDate date);
    
    @Query("SELECT i FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT i FROM Invoice i WHERE i.client.id = :clientId AND i.paymentStatus = :status")
    List<Invoice> findByClientIdAndPaymentStatus(@Param("clientId") Long clientId, @Param("status") Invoice.PaymentStatus status);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(i.invoiceNumber, 5) AS int)), 0) FROM Invoice i WHERE i.invoiceNumber LIKE 'INV-%'")
    Integer findMaxInvoiceSequence();
}
