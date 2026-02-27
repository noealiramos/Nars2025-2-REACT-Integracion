import Product from '../models/product.js';
import Category from '../models/category.js';
import { getPagination } from '../utils/pagination.js';
import { MATERIALS, DESIGNS, STONES } from '../config/catalog.js';

function pickEnum(value, allowed, field) {
  if (value == null) return value;
  if (!allowed.includes(value)) {
    const err = new Error(`Valor no permitido para ${field}: "${value}". Permitidos: ${allowed.join(', ')}`);
    err.status = 400;
    throw err;
  }
  return value;
}

// GET /products  (con filtros ?q=&category=&material=&design=&stone=&sort=&order=&page=&limit=)
export async function getProducts(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);

    const { q, category, material, design, stone } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;          // se espera ObjectId válido
    if (material) filter.material = material;
    if (design)   filter.design = design;
    if (stone)    filter.stone = stone;

    const sortField = req.query.sort || 'name';
    const order = (req.query.order || 'asc').toLowerCase() === 'desc' ? -1 : 1;
    const sort = { [sortField]: order };

    const [items, total] = await Promise.all([
      Product.find(filter).populate('category').sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    // 👇 Nuevo bloque de paginación solicitado
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalResults: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };

    // 👇 Respuesta compatible + nuevo `pagination`
    return res.json({
      page,         // legado (compatibilidad)
      limit,        // legado (compatibilidad)
      total,        // legado (compatibilidad)
      items,        // legado (compatibilidad)
      pagination    // nuevo objeto con el formato requerido
    });
  } catch (error) {
    next(error);
  }
}


// GET /products/:id
export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Product.findById(id).populate('category').lean();
    if (!doc) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(doc);
  } catch (error) {
    next(error);
  }
}

// GET /products/category/:categoryId  (si tu ruta usa :id, también funciona)
export async function getProductByCategory(req, res, next) {
  try {
    const categoryId = req.params.categoryId || req.params.id;
    const { page, limit, skip } = getPagination(req, 10);

    const [items, total] = await Promise.all([
      Product.find({ category: categoryId }).populate('category').skip(skip).limit(limit).lean(),
      Product.countDocuments({ category: categoryId })
    ]);

    res.json({ page, limit, total, items });
  } catch (error) {
    next(error);
  }
}

// POST /products
export async function createProduct(req, res, next) {
  try {
    const {
      name, description, price, stock, imagesUrl = [],
      category, material, design, stone
    } = req.body;

    if (!name || !description || price == null || stock == null || !category || !material || !design) {
      return res.status(400).json({
        message: 'name, description, price, stock, category, material y design son requeridos'
      });
    }

    // Validar refs básicas
    const cat = await Category.findById(category).select('_id');
    if (!cat) return res.status(400).json({ message: 'Categoría no encontrada' });

    // Validaciones enum
    const vMaterial = pickEnum(material, MATERIALS, 'material');
    const vDesign   = pickEnum(design, DESIGNS, 'design');
    const vStone    = stone ? pickEnum(stone, STONES, 'stone') : null;

    // Regla: si design = Con piedra mineral → stone obligatorio
    if (vDesign === 'Con piedra mineral' && !vStone) {
      return res.status(400).json({ message: 'stone es obligatorio cuando design = "Con piedra mineral"' });
    }

    const created = await Product.create({
      name, description, price, stock, imagesUrl, category: cat._id,
      material: vMaterial, design: vDesign, stone: vStone
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

// PUT/PATCH /products/:id
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Cargar actual para validar regla de negocio combinada (design/stone)
    const current = await Product.findById(id).lean();
    if (!current) return res.status(404).json({ message: 'Producto no encontrado' });

    // Validar enums si vienen
    if (updates.material) updates.material = pickEnum(updates.material, MATERIALS, 'material');
    if (updates.design)   updates.design   = pickEnum(updates.design, DESIGNS, 'design');
    if (updates.stone)    updates.stone    = pickEnum(updates.stone, STONES, 'stone');

    // Resolver design/stone efectivos después del update
    const nextDesign = updates.design ?? current.design;
    const nextStone  = Object.prototype.hasOwnProperty.call(updates, 'stone')
      ? updates.stone
      : current.stone;

    if (nextDesign === 'Con piedra mineral' && !nextStone) {
      return res.status(400).json({ message: 'stone es obligatorio cuando design = "Con piedra mineral"' });
    }

    // Si actualizan category, validar que exista
    if (updates.category) {
      const cat = await Category.findById(updates.category).select('_id');
      if (!cat) return res.status(400).json({ message: 'Categoría no encontrada' });
    }

    const doc = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('category');

    res.json(doc);
  } catch (error) {
    next(error);
  }
}

// DELETE /products/:id
export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Product.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ status: 'ok', message: 'Producto eliminado', id: doc._id });
  } catch (error) {
    next(error);
  }
}

// GET /products/search?q=
export async function searchProducts(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);
    const { q } = req.query;
    if (!q) return res.json({ page, limit, total: 0, items: [] });

    const regex = { $regex: q, $options: 'i' };
    const filter = { $or: [{ name: regex }, { description: regex }] };

    const [items, total] = await Promise.all([
      Product.find(filter).populate('category').skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    res.json({ page, limit, total, items });
  } catch (error) {
    next(error);
  }
}
