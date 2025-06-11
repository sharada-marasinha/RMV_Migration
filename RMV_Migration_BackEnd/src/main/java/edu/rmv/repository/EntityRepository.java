package edu.rmv.repository;

import java.util.List;
import java.util.Optional;

public interface EntityRepository<T> {
    void save(T entity);
    Optional<T> findById(Object id);
    List<T> findAll();
    void update(T entity);
    void delete(T entity);
}
