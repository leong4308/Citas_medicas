export const getAll = (req, res) => {
  res.json({ message: "Listar usuarios" });
};

export const getOne = (req, res) => {
  res.json({ message: `Usuario ${req.params.id}` });
};

export const create = (req, res) => {
  res.status(201).json({ message: "Crear usuario", data: req.body });
};

export const update = (req, res) => {
  res.json({ message: `Actualizar usuario ${req.params.id}`, data: req.body });
};

export const remove = (req, res) => {
  res.json({ message: `Eliminar usuario ${req.params.id}` });
};
