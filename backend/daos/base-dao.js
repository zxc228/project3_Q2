// base dao class with common database operations

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `${letter.toLowerCase()}`);
}

class BaseDAO {
  constructor(pool) {
    this.pool = pool;
  }


  // executing a database query with parameters
  async query(query, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // finding a single record by id
  async findById(table, id) {
    const query = `SELECT * FROM "${table}" WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.length ? result[0] : null;
  }

  // finding records by a specific field value
  async findByField(table, field, value) {
    const query = `SELECT * FROM "${table}" WHERE ${field} = $1`;
    return await this.query(query, [value]);
  }

  // getting all records from a table
  async findAll(table) {
    const query = `SELECT * FROM "${table}"`;
    return await this.query(query);
  }

  // creating a new record
  async create(table, data) {
    const fields = Object.keys(data).map(camelToSnake);;
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const fieldNames = fields.map(field => `"${field}"`).join(', ');
    
    const query = `
      INSERT INTO "${table}" (${fieldNames})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.query(query, values);
    return result[0];
  }

  // updating an existing record
  async update(table, id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    // constructing SET clause with placeholders
    const setClause = fields
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    
    const query = `
      UPDATE "${table}"
      SET ${setClause}
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await this.query(query, [...values, id]);
    return result[0];
  }

  // deleting a record by id
  async delete(table, id) {
    const query = `
      DELETE FROM "${table}"
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.query(query, [id]);
    return result[0];
  }
}

module.exports = BaseDAO;
