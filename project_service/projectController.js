const { createProject } = require('./projectModel');

async function handleCreateProject(req, res) {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

module.exports = { handleCreateProject };
