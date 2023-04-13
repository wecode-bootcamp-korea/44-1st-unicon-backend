-- migrate:up
INSERT INTO
    order_status(id, status)
VALUES
     (1, 'PENDING_PAYMENT'),           
     (2, 'COMPLETED_PAYMENT');
     (3, 'DELIVERING');  
     (4, 'DELIVERY_COMPLETED');    
-- migrate:down

DELETE FROM
    order_status
WHERE id IN (1,2,3,4);