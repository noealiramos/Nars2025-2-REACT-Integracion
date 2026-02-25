import ShippingAddress from '../models/shippingAddress.js';
import { getPagination } from '../utils/pagination.js';

// Crear una nueva dirección de envío
const createShippingAddress = async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
      addressType,
    } = req.body;

    const user =
      req.user?.id || req.user?.userId; // más robusto con ambos formatos
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Si esta dirección se marca como default, desmarcar las demás
    if (isDefault === true) {
      await ShippingAddress.updateMany({ user }, { isDefault: false });
    }

    const newAddress = await ShippingAddress.create({
      user,
      name,
      address,
      city,
      state,
      postalCode,
      country: country || 'México',
      phone,
      isDefault: Boolean(isDefault),
      addressType: addressType || 'home',
    });

    return res.status(201).json({
      message: 'Shipping address created successfully',
      address: newAddress,
    });
  } catch (error) {
    return next(error);
  }
};

// Obtener todas las direcciones del usuario (paginado)
const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { page, limit, skip } = getPagination(req, 10);
    const filter = { user: userId };

    // default primero, luego más recientes (por _id desc para no depender de timestamps)
    const sort = { isDefault: -1, _id: -1 };

    const [addresses, totalResults] = await Promise.all([
      ShippingAddress.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ShippingAddress.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalResults / limit) || 1;

    return res.status(200).json({
      message: 'Addresses retrieved successfully',
      addresses,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Obtener una dirección específica (propiedad del usuario)
const getAddressById = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    }).lean();

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    return res.status(200).json({
      message: 'Address retrieved successfully',
      address,
    });
  } catch (error) {
    return next(error);
  }
};

// Obtener la dirección por defecto del usuario
const getDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const defaultAddress = await ShippingAddress.findOne({
      user: userId,
      isDefault: true,
    }).lean();

    if (!defaultAddress) {
      return res.status(404).json({ message: 'No default address found' });
    }

    return res.status(200).json({
      message: 'Default address retrieved successfully',
      address: defaultAddress,
    });
  } catch (error) {
    return next(error);
  }
};

// Actualizar una dirección (solo campos presentes)
const updateShippingAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const {
      name,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
      addressType,
    } = req.body;

    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const shippingAddress = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    });

    if (!shippingAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Si se marca default y antes no lo era, desmarcar otras
    if (isDefault === true && !shippingAddress.isDefault) {
      await ShippingAddress.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { isDefault: false }
      );
    }

    // Actualizar solo los campos presentes
    if (typeof name !== 'undefined') shippingAddress.name = name;
    if (typeof address !== 'undefined') shippingAddress.address = address;
    if (typeof city !== 'undefined') shippingAddress.city = city;
    if (typeof state !== 'undefined') shippingAddress.state = state;
    if (typeof postalCode !== 'undefined')
      shippingAddress.postalCode = postalCode;
    if (typeof country !== 'undefined')
      shippingAddress.country = country || shippingAddress.country;
    if (typeof phone !== 'undefined') shippingAddress.phone = phone;
    if (typeof addressType !== 'undefined')
      shippingAddress.addressType = addressType || shippingAddress.addressType;
    if (typeof isDefault !== 'undefined')
      shippingAddress.isDefault = Boolean(isDefault);

    await shippingAddress.save();

    return res.status(200).json({
      message: 'Address updated successfully',
      address: shippingAddress,
    });
  } catch (error) {
    return next(error);
  }
};

// Marcar dirección como default
const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Desmarcar todas como default
    await ShippingAddress.updateMany({ user: userId }, { isDefault: false });

    // Marcar la actual como default
    address.isDefault = true;
    await address.save();

    return res.status(200).json({
      message: 'Default address updated successfully',
      address,
    });
  } catch (error) {
    return next(error);
  }
};

// Eliminar una dirección
const deleteShippingAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const address = await ShippingAddress.findOne({
      _id: addressId,
      user: userId,
    }).lean();

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await ShippingAddress.findByIdAndDelete(addressId);

    return res.status(200).json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export {
  createShippingAddress,
  getUserAddresses,
  getAddressById,
  getDefaultAddress,
  updateShippingAddress,
  setDefaultAddress,
  deleteShippingAddress,
};
