package edu.rmv.repository.impl;

import edu.rmv.entity.MotorbikeRegistration;
import edu.rmv.util.RegistrationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MotorbikeRegistrationDao {

    private final JdbcTemplate jdbcTemplate;


    private final RowMapper<MotorbikeRegistration> registrationRowMapper = (rs, rowNum) -> {
        MotorbikeRegistration registration = new MotorbikeRegistration();
        registration.setId(rs.getLong("id"));
        registration.setRegistrationNumber(rs.getString("registration_number"));
        registration.setOwnerName(rs.getString("owner_name"));
        registration.setOwnerAddress(rs.getString("owner_address"));
        registration.setOwnerEmail(rs.getString("owner_email"));
        registration.setMotorbikeMake(rs.getString("motorbike_make"));
        registration.setMotorbikeModel(rs.getString("motorbike_model"));
        registration.setChassisNumber(rs.getString("chassis_number"));
        registration.setEngineNumber(rs.getString("engine_number"));
        registration.setTotalAmount(rs.getBigDecimal("total_amount"));
        registration.setRegistrationType(rs.getString("registration_type"));
        registration.setRegistrationFee(rs.getBigDecimal("registration_fee"));
        registration.setDeliveryDate(rs.getDate("delivery_date") != null ? rs.getDate("delivery_date").toLocalDate() : null);
        registration.setInvoiceNumber(rs.getString("invoice_number"));
        registration.setInvoiceDate(rs.getDate("invoice_date") != null ? rs.getDate("invoice_date").toLocalDate() : null);
        registration.setDealerName(rs.getString("dealer_name"));
        registration.setDealerAddress(rs.getString("dealer_address"));
        registration.setBuyerName(rs.getString("buyer_name"));
        registration.setBuyerAddress(rs.getString("buyer_address"));
        registration.setPaymentReference(rs.getString("payment_reference"));
        registration.setPaymentDate(rs.getDate("payment_date") != null ? rs.getDate("payment_date").toLocalDate() : null);
        registration.setPaidBy(rs.getString("paid_by"));
        registration.setAmountPaid(rs.getBigDecimal("amount_paid"));
        registration.setPaymentPurpose(rs.getString("payment_purpose"));
        registration.setBankName(rs.getString("bank_name"));
        registration.setBankBranch(rs.getString("bank_branch"));
        registration.setStatus(RegistrationStatus.valueOf(rs.getString("status")));
        registration.setRegisteredByUserId(rs.getLong("registered_by_user_id"));
        registration.setRegisteredAt(rs.getTimestamp("registered_at") != null ? rs.getTimestamp("registered_at").toLocalDateTime() : null);
        registration.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        registration.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return registration;
    };

    public MotorbikeRegistration save(MotorbikeRegistration registration) {
        if (registration.getId() == null) {
            return insert(registration);
        } else {
            return update(registration);
        }
    }

    private MotorbikeRegistration insert(MotorbikeRegistration registration) {
        System.out.println(registration);
        String sql = "INSERT INTO motorbike_registrations (registration_number, owner_name, owner_address, owner_email, " +
                "motorbike_make, motorbike_model, chassis_number, engine_number, total_amount, registration_type, " +
                "registration_fee, delivery_date, invoice_number, invoice_date, dealer_name, dealer_address, " +
                "buyer_name, buyer_address, payment_reference, payment_date, paid_by, amount_paid, payment_purpose, " +
                "bank_name, bank_branch, status, registered_by_user_id, registered_at, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, registration.getRegistrationNumber());
            ps.setString(2, registration.getOwnerName());
            ps.setString(3, registration.getOwnerAddress());
            ps.setString(4, registration.getOwnerEmail());
            ps.setString(5, registration.getMotorbikeMake());
            ps.setString(6, registration.getMotorbikeModel());
            ps.setString(7, registration.getChassisNumber());
            ps.setString(8, registration.getEngineNumber());
            ps.setBigDecimal(9, registration.getTotalAmount());
            ps.setString(10, registration.getRegistrationType());
            ps.setBigDecimal(11, new BigDecimal("5000.00"));
            ps.setDate(12, registration.getDeliveryDate() != null ? java.sql.Date.valueOf(registration.getDeliveryDate()) : null);
            ps.setString(13, registration.getInvoiceNumber());
            ps.setDate(14, registration.getInvoiceDate() != null ? java.sql.Date.valueOf(registration.getInvoiceDate()) : null);
            ps.setString(15, registration.getDealerName());
            ps.setString(16, registration.getDealerAddress());
            ps.setString(17, registration.getBuyerName());
            ps.setString(18, registration.getBuyerAddress());
            ps.setString(19, registration.getPaymentReference());
            ps.setDate(20, registration.getPaymentDate() != null ? java.sql.Date.valueOf(registration.getPaymentDate()) : null);
            ps.setString(21, registration.getPaidBy());
            ps.setBigDecimal(22, registration.getAmountPaid());
            ps.setString(23, registration.getPaymentPurpose());
            ps.setString(24, registration.getBankName());
            ps.setString(25, registration.getBankBranch());
            ps.setString(26, registration.getStatus().name());
            ps.setLong(27, registration.getRegisteredByUserId());
            ps.setTimestamp(28, registration.getRegisteredAt() != null ? java.sql.Timestamp.valueOf(registration.getRegisteredAt()) : null);
            ps.setTimestamp(29, java.sql.Timestamp.valueOf(registration.getCreatedAt()));
            ps.setTimestamp(30, java.sql.Timestamp.valueOf(registration.getUpdatedAt()));
            return ps;
        }, keyHolder);

        registration.setId(keyHolder.getKey().longValue());
        return registration;
    }

    private MotorbikeRegistration update(MotorbikeRegistration registration) {
        String sql = "UPDATE motorbike_registrations SET registration_number = ?, owner_name = ?, owner_address = ?, " +
                "owner_email = ?, motorbike_make = ?, motorbike_model = ?, chassis_number = ?, engine_number = ?, " +
                "total_amount = ?, registration_type = ?, registration_fee = ?, delivery_date = ?, invoice_number = ?, " +
                "invoice_date = ?, dealer_name = ?, dealer_address = ?, buyer_name = ?, buyer_address = ?, " +
                "payment_reference = ?, payment_date = ?, paid_by = ?, amount_paid = ?, payment_purpose = ?, " +
                "bank_name = ?, bank_branch = ?, status = ?, updated_at = ? WHERE id = ?";

        jdbcTemplate.update(sql,
                registration.getRegistrationNumber(), registration.getOwnerName(), registration.getOwnerAddress(),
                registration.getOwnerEmail(), registration.getMotorbikeMake(), registration.getMotorbikeModel(),
                registration.getChassisNumber(), registration.getEngineNumber(), registration.getTotalAmount(),
                registration.getRegistrationType(), registration.getRegistrationFee(),
                registration.getDeliveryDate() != null ? java.sql.Date.valueOf(registration.getDeliveryDate()) : null,
                registration.getInvoiceNumber(),
                registration.getInvoiceDate() != null ? java.sql.Date.valueOf(registration.getInvoiceDate()) : null,
                registration.getDealerName(), registration.getDealerAddress(), registration.getBuyerName(),
                registration.getBuyerAddress(), registration.getPaymentReference(),
                registration.getPaymentDate() != null ? java.sql.Date.valueOf(registration.getPaymentDate()) : null,
                registration.getPaidBy(), registration.getAmountPaid(), registration.getPaymentPurpose(),
                registration.getBankName(), registration.getBankBranch(), registration.getStatus().name(),
                java.sql.Timestamp.valueOf(registration.getUpdatedAt()), registration.getId());

        return registration;
    }

    public Optional<MotorbikeRegistration> findById(Long id) {
        String sql = "SELECT * FROM motorbike_registrations WHERE id = ?";
        List<MotorbikeRegistration> registrations = jdbcTemplate.query(sql, registrationRowMapper, id);
        return registrations.isEmpty() ? Optional.empty() : Optional.of(registrations.get(0));
    }

    public List<MotorbikeRegistration> findByUserId(Long userId) {
        String sql = "SELECT * FROM motorbike_registrations WHERE registered_by_user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, registrationRowMapper, userId);
    }

    public List<MotorbikeRegistration> findAll() {
        String sql = "SELECT * FROM motorbike_registrations ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, registrationRowMapper);
    }

    public Optional<MotorbikeRegistration> findByRegistrationNumber(String registrationNumber) {
        String sql = "SELECT * FROM motorbike_registrations WHERE registration_number = ?";
        List<MotorbikeRegistration> registrations = jdbcTemplate.query(sql, registrationRowMapper, registrationNumber);
        return registrations.isEmpty() ? Optional.empty() : Optional.of(registrations.get(0));
    }
}