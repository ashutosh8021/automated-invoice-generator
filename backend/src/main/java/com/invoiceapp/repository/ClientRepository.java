package com.invoiceapp.repository;

import com.invoiceapp.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByEmail(String email);
    
    List<Client> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT c FROM Client c WHERE c.name LIKE %:searchTerm% OR c.email LIKE %:searchTerm%")
    List<Client> searchClients(@Param("searchTerm") String searchTerm);
    
    boolean existsByEmail(String email);
}
