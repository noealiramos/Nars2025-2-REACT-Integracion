import Category from "../models/category.js";
import { getPagination } from "../utils/pagination.js";

async function getCategories(req, res, next) {
  try {
    // default 10 por página
    const { page, limit, skip } = getPagination(req, 10);

    // Filtro opcional: ?parentCategory=<id>
    const filter = {};
    if (req.query.parentCategory) {
      filter.parentCategory = req.query.parentCategory;
    }

    // Ordenamiento opcional: ?sort=name|createdAt&order=asc|desc
    const sortField = req.query.sort || 'name';
    const sortOrder = (req.query.order || 'asc').toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [categories, totalResults] = await Promise.all([
      Category.find(filter)
        .populate("parentCategory")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Category.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return res.status(200).json({
      categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await Category.findById(req.params.id).populate("parentCategory");
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(category);
  } catch (error) { 
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description, parentCategory, imageURL } = req.body;
    const newCategory = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      imageURL: imageURL || null,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) { 
    return next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { name, description, parentCategory, imageURL } = req.body;
    const idCategory = req.params.id;

    const updatedCategory = await Category.findByIdAndUpdate(
      idCategory,
      { name, description, parentCategory, imageURL },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) { 
    return next(error); 
  }
}

async function deleteCategory(req, res, next) {
  try {
    const idCategory = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(idCategory);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    return res.status(200).json({ 
      status: 'success',
      message: 'Categoría eliminada correctamente', 
      data: deletedCategory
    });
  } catch (error) { 
    return next(error);
  }
}

async function searchCategory(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req, 10);

    const { q, parentCategory } = req.query;

    // Filtros
    const filters = {};
    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (parentCategory) {
      filters.parentCategory = parentCategory;
    }

    // Ordenamiento: ?sort=name|createdAt&order=asc|desc
    // Mantengo tu default previo (desc) cuando no se especifica
    const sortField = req.query.sort || 'name';
    const sortOrder = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;
    const sortOptions = { [sortField]: sortOrder };

    const [categories, totalResults] = await Promise.all([
      Category.find(filters)
        .populate("parentCategory")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Category.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return res.status(200).json({
      categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,     // (typo corregido)
      },
      searchTerm: q || null,
      parentCategory: parentCategory || null,
      sort: sortField,
      order: sortOrder === -1 ? 'desc' : 'asc'
    });
  } catch (error) { 
    return next(error); 
  }
}

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategory
};
