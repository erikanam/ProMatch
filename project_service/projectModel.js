const db = require('./db');

async function createProject(project) {
  const { name, description, skills_required } = project;
  const result = await db.query(
    'INSERT INTO projects (name, description, skills_required) VALUES ($1, $2, $3) RETURNING *',
    [name, description, skills_required]
  );
  return result.rows[0];
}

module.exports = { createProject };
