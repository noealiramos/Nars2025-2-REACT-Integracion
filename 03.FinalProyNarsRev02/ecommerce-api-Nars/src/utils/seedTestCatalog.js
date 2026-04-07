import env from '../config/env.js';
import Category from '../models/category.js';
import Product from '../models/product.js';

const TEST_CATEGORY = {
  name: 'QA Test Category',
  description: 'Categoria semilla para pruebas E2E automatizadas',
};

const TEST_PRODUCTS = [
  {
    name: 'Anillo QA Plata',
    description: 'Producto semilla para flujo E2E de compra',
    price: 499,
    stock: 15,
    imagesUrl: ['https://placehold.co/800x600.png?text=QA+Ring'],
    material: 'Plata',
    design: 'Simple',
    stone: null,
  },
  {
    name: 'Collar QA Resina',
    description: 'Producto semilla alterno para pruebas funcionales',
    price: 649,
    stock: 10,
    imagesUrl: ['https://placehold.co/800x600.png?text=QA+Necklace'],
    material: 'Resina',
    design: 'Personalizado',
    stone: null,
  },
];

export async function seedTestCatalog() {
  if (env.NODE_ENV !== 'test') {
    return { seeded: false, reason: 'not-test-env' };
  }

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    return { seeded: false, reason: 'products-exist', count: existingProducts };
  }

  let category = await Category.findOne({ name: TEST_CATEGORY.name }).select('_id');

  if (!category) {
    category = await Category.create(TEST_CATEGORY);
  }

  const productsToInsert = TEST_PRODUCTS.map((product) => ({
    ...product,
    category: category._id,
  }));

  const insertedProducts = await Product.insertMany(productsToInsert);

  return {
    seeded: true,
    categoryId: String(category._id),
    products: insertedProducts.map((product) => String(product._id)),
  };
}

export default seedTestCatalog;
