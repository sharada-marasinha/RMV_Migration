package edu.rmv.repository.impl;

import edu.rmv.entity.RegistrationNumber;
import edu.rmv.util.NumberCategory;
import edu.rmv.util.NumberType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class RegistrationNumberDao {

    private final JdbcTemplate jdbcTemplate;

    public RegistrationNumberDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<RegistrationNumber> numberRowMapper = (rs, rowNum) -> {
        RegistrationNumber number = new RegistrationNumber();
        number.setId(rs.getLong("id"));
        number.setNumber(rs.getString("number"));
        number.setNumberType(NumberType.valueOf(rs.getString("number_type")));
        number.setCategory(NumberCategory.valueOf(rs.getString("category")));
        number.setPrice(rs.getBigDecimal("price"));
        number.setAvailable(rs.getBoolean("is_available"));
        number.setIsLocked(rs.getBoolean("is_locked"));
        number.setLockExpiresAt(rs.getTimestamp("lock_expires_at") != null ? rs.getTimestamp("lock_expires_at").toLocalDateTime() : null);
        number.setLockedByUserId(rs.getObject("locked_by_user_id", Long.class));
        number.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        number.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return number;
    };

    public RegistrationNumber save(RegistrationNumber number) {
        if (number.getId() == null) {
            return insert(number);
        } else {
            return update(number);
        }
    }

    private RegistrationNumber insert(RegistrationNumber number) {
        String sql = "INSERT INTO registration_numbers (number, number_type, category, price, is_available, " +
                "is_locked, lock_expires_at, locked_by_user_id, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, number.getNumber());
            ps.setString(2, number.getNumberType().name());
            ps.setString(3, number.getCategory().name());
            ps.setBigDecimal(4, number.getPrice());
            ps.setBoolean(5, number.getAvailable());
            ps.setBoolean(6, number.getIsLocked());
            ps.setTimestamp(7, number.getLockExpiresAt() != null ? java.sql.Timestamp.valueOf(number.getLockExpiresAt()) : null);
            ps.setObject(8, number.getLockedByUserId());
            ps.setTimestamp(9, java.sql.Timestamp.valueOf(number.getCreatedAt()));
            ps.setTimestamp(10, java.sql.Timestamp.valueOf(number.getUpdatedAt()));
            return ps;
        }, keyHolder);

        number.setId(keyHolder.getKey().longValue());
        return number;
    }

    private RegistrationNumber update(RegistrationNumber number) {
        String sql = "UPDATE registration_numbers SET number = ?, number_type = ?, category = ?, price = ?, " +
                "is_available = ?, is_locked = ?, lock_expires_at = ?, locked_by_user_id = ?, updated_at = ? " +
                "WHERE id = ?";

        jdbcTemplate.update(sql,
                number.getNumber(), number.getNumberType().name(), number.getCategory().name(), number.getPrice(),
                number.getAvailable(), number.getIsLocked(),
                number.getLockExpiresAt() != null ? java.sql.Timestamp.valueOf(number.getLockExpiresAt()) : null,
                number.getLockedByUserId(), java.sql.Timestamp.valueOf(number.getUpdatedAt()), number.getId());

        return number;
    }

    public Optional<RegistrationNumber> findByNumber(String number) {
        String sql = "SELECT * FROM registration_numbers WHERE number = ?";
        List<RegistrationNumber> numbers = jdbcTemplate.query(sql, numberRowMapper, number);
        return numbers.isEmpty() ? Optional.empty() : Optional.of(numbers.get(0));
    }

    public List<RegistrationNumber> findAvailableSpecialNumbers() {
        String sql = "SELECT * FROM registration_numbers WHERE number_type = 'SPECIAL' AND is_available = true " +
                "AND (is_locked = false OR (is_locked = true AND lock_expires_at < ?)) ORDER BY number";
        return jdbcTemplate.query(sql, numberRowMapper, java.sql.Timestamp.valueOf(LocalDateTime.now()));
    }

    public String getCurrentNumber() {
        String sql = "SELECT number FROM registration_numbers WHERE is_available = true " +
                "ORDER BY id DESC LIMIT 1";
        List<String> numbers = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("number"));
        return numbers.isEmpty() ? "ABC-0000" : numbers.get(0);
    }

    public String getCurrentNormalNumber() {
        String sql = "SELECT number FROM registration_numbers " +
                "WHERE number_type = 'NORMAL' AND category = 'NORMAL' AND is_available = true " +
                "ORDER BY id DESC LIMIT 1";

        List<String> numbers = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("number"));
        return numbers.isEmpty() ? "ABC-0000" : numbers.get(0);
    }

    public void releaseExpiredLocks() {
        String sql = "UPDATE registration_numbers SET is_locked = false, lock_expires_at = NULL, " +
                "locked_by_user_id = NULL, updated_at = ? WHERE is_locked = true AND lock_expires_at < ?";
        LocalDateTime now = LocalDateTime.now();
        jdbcTemplate.update(sql, java.sql.Timestamp.valueOf(now), java.sql.Timestamp.valueOf(now));
    }

    public boolean lockNumber(String number, Long userId) {
        String sql = "UPDATE registration_numbers SET is_locked = true, lock_expires_at = ?, " +
                "locked_by_user_id = ?, updated_at = ? WHERE number = ? AND is_available = true AND " +
                "(is_locked = false OR (is_locked = true AND lock_expires_at < ?))";

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expireTime = now.plusMinutes(30);

        int rowsAffected = jdbcTemplate.update(sql,
                java.sql.Timestamp.valueOf(expireTime),
                userId,
                java.sql.Timestamp.valueOf(now),
                number,
                java.sql.Timestamp.valueOf(now));

        return rowsAffected > 0;
    }

    public void markAsUsed(String number) {
        String sql = "UPDATE registration_numbers SET is_available = false, is_locked = false, " +
                "lock_expires_at = NULL, locked_by_user_id = NULL, updated_at = ? WHERE number = ?";
        jdbcTemplate.update(sql, java.sql.Timestamp.valueOf(LocalDateTime.now()), number);
    }
}
