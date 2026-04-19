import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heading } from "../components/atoms/Heading";
import { TextInput } from "../components/atoms/TextInput";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { useUI } from "../contexts/UIContext";
import { productApi } from "../api/productApi";
import { categoryApi } from "../api/categoryApi";
import { uploadApi } from "../api/uploadApi";
import "./AdminProductsPage.css";

const MATERIALS = ["Plata", "Oro", "Latón", "Aluminio", "Resina"];
const DESIGNS = ["Simple", "Grabado en láser", "Con piedra mineral", "Personalizado"];
const STONES = ["", "Ópalo", "Cuarzo", "Ojo de tigre", "Obsidiana", "Amatista", "Ónix", "Jade", "Turquesa"];

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  material: MATERIALS[0],
  design: DESIGNS[0],
  stone: "",
  imageUrl: "",
};

const getImageUrl = (product) => Array.isArray(product.imagesUrl) ? product.imagesUrl[0] || "" : product.imagesUrl || product.image || "";

const toFormState = (product) => ({
  id: product._id || product.id,
  name: product.name || "",
  description: product.description || "",
  price: String(product.price ?? ""),
  stock: String(product.stock ?? ""),
  category: product.category?._id || product.category || "",
  material: product.material || MATERIALS[0],
  design: product.design || DESIGNS[0],
  stone: product.stone || "",
  imageUrl: getImageUrl(product),
});

const validateProductForm = (form) => {
  if (!form.name.trim()) return "El nombre es obligatorio.";
  if (!form.description.trim()) return "La descripción es obligatoria.";
  if (!form.category) return "Selecciona una categoría.";
  if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) return "Ingresa un precio válido.";
  if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) return "Ingresa un stock válido.";
  if (form.design === "Con piedra mineral" && !form.stone) return 'Selecciona una piedra para el diseño "Con piedra mineral".';
  return null;
};

export function AdminProductsPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { dispatch } = useUI();
  const queryClient = useQueryClient();
  const pageSize = 10;

  const editing = Boolean(form.id);

  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => productApi.getAll({ page, limit: pageSize }),
  });

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll({ limit: 100 }),
  });

  const products = Array.isArray(productsResponse?.products) ? productsResponse.products : productsResponse?.items || [];
  const pagination = productsResponse?.pagination || {
    currentPage: page,
    totalPages: 1,
    totalResults: products.length,
    hasNext: false,
    hasPrev: page > 1,
  };
  const categories = Array.isArray(categoriesResponse?.categories) ? categoriesResponse.categories : [];
  const loading = productsLoading || categoriesLoading;
  const loadFailed = productsError || categoriesError;

  const canSubmit = useMemo(() => categories.length > 0 && !saving, [categories.length, saving]);

  useEffect(() => {
    if (loading) {
      dispatch({ type: "START_LOADING" });
      return () => dispatch({ type: "STOP_LOADING" });
    }
    return undefined;
  }, [dispatch, loading]);

  useEffect(() => {
    if (loadFailed) {
      const nextError = "No pudimos cargar la administración de productos.";
      setError(nextError);
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "error", text: nextError } });
    }
  }, [dispatch, loadFailed]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setSuccess("");
    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "design" && value !== "Con piedra mineral" ? { stone: "" } : {}),
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSelectedImageFile(null);
    setSuccess("");
    setError("");
  };

  const handleEdit = (product) => {
    setForm(toFormState(product));
    setSelectedImageFile(null);
    setSuccess("");
    setError("");
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedImageFile(file);
    setError("");
    setSuccess("");
  };

  const handleUploadImage = async () => {
    if (!selectedImageFile) return;

    setUploadingImage(true);
    setError("");
    setSuccess("");

    try {
      const uploadedImage = await uploadApi.uploadProductImage(selectedImageFile);
      setForm((prev) => ({ ...prev, imageUrl: uploadedImage.imageUrl || "" }));
      setSelectedImageFile(null);
      setSuccess("Imagen subida correctamente. La URL ya quedó lista para guardar el producto.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No pudimos subir la imagen.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (productId) => {
    setError("");
    setSuccess("");

    try {
      await productApi.remove(productId);
      if (form.id === productId) resetForm();
      setSuccess("Producto eliminado correctamente.");
      dispatch({ type: "SHOW_MESSAGE", payload: { type: "success", text: "Producto eliminado correctamente." } });

      if (products.length === 1 && pagination.currentPage > 1) {
        setPage((currentPage) => Math.max(currentPage - 1, 1));
      } else {
        await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No pudimos eliminar el producto.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateProductForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      material: form.material,
      design: form.design,
      ...(form.design === "Con piedra mineral" && form.stone ? { stone: form.stone } : {}),
      imagesUrl: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
    };

    try {
      if (editing) {
        await productApi.update(form.id, payload);
      } else {
        await productApi.create(payload);
      }

      setSuccess(editing ? "Producto actualizado correctamente." : "Producto creado correctamente.");
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "success", text: editing ? "Producto actualizado correctamente." : "Producto creado correctamente." },
      });
      resetForm();
      if (!editing) {
        setPage(1);
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No pudimos guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page container admin-products-page">
      <header className="admin-products-page__hero">
        <Heading level={2}>Administración de productos</Heading>
        <Text>CRUD mínimo visible para listar, crear, editar y eliminar productos del catálogo.</Text>
      </header>

      {error && <p className="page__status page__status--error">{error}</p>}
      {success && <p className="page__status admin-products-page__success">{success}</p>}

      <section className="admin-products-page__layout">
        <form className="admin-products-form" onSubmit={handleSubmit}>
          <Heading level={3}>{editing ? "Editar producto" : "Crear producto"}</Heading>

          <TextInput id="admin-name" name="name" label="Nombre" value={form.name} onChange={handleFieldChange} />
          <div className="admin-products-form__textarea-group">
            <label htmlFor="admin-description" className="form-label">Descripción</label>
            <textarea id="admin-description" name="description" className="admin-products-form__textarea" value={form.description} onChange={handleFieldChange} data-testid="admin-product-description" />
          </div>
          <div className="admin-products-form__grid">
            <TextInput id="admin-price" name="price" label="Precio" type="number" min="0" step="0.01" value={form.price} onChange={handleFieldChange} />
            <TextInput id="admin-stock" name="stock" label="Stock" type="number" min="0" step="1" value={form.stock} onChange={handleFieldChange} />
          </div>
          <div className="admin-products-form__select-group">
            <label htmlFor="admin-category" className="form-label">Categoría</label>
            <select id="admin-category" name="category" className="form-input" value={form.category} onChange={handleFieldChange} data-testid="admin-product-category">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-products-form__grid">
            <div className="admin-products-form__select-group">
              <label htmlFor="admin-material" className="form-label">Material</label>
              <select id="admin-material" name="material" className="form-input" value={form.material} onChange={handleFieldChange} data-testid="admin-product-material">
                {MATERIALS.map((material) => <option key={material} value={material}>{material}</option>)}
              </select>
            </div>
            <div className="admin-products-form__select-group">
              <label htmlFor="admin-design" className="form-label">Diseño</label>
              <select id="admin-design" name="design" className="form-input" value={form.design} onChange={handleFieldChange} data-testid="admin-product-design">
                {DESIGNS.map((design) => <option key={design} value={design}>{design}</option>)}
              </select>
            </div>
          </div>
          {form.design === "Con piedra mineral" && (
            <div className="admin-products-form__select-group">
              <label htmlFor="admin-stone" className="form-label">Piedra</label>
              <select id="admin-stone" name="stone" className="form-input" value={form.stone} onChange={handleFieldChange} data-testid="admin-product-stone">
                {STONES.map((stone) => <option key={stone || "none"} value={stone}>{stone || "Selecciona una piedra"}</option>)}
              </select>
            </div>
          )}
          <TextInput id="admin-image" name="imageUrl" label="Imagen principal (URL)" value={form.imageUrl} onChange={handleFieldChange} />
          <div className="admin-products-form__upload-group">
            <label htmlFor="admin-image-file" className="form-label">Subir imagen</label>
            <input id="admin-image-file" type="file" accept="image/*" className="form-input" onChange={handleImageFileChange} data-testid="admin-product-file" />
            <div className="admin-products-form__upload-actions">
              <Button type="button" variant="secondary" onClick={handleUploadImage} disabled={!selectedImageFile || uploadingImage} data-testid="admin-upload-image">
                {uploadingImage ? "Subiendo..." : "Subir archivo"}
              </Button>
            </div>
          </div>

          <div className="admin-products-form__actions">
            <Button type="submit" disabled={!canSubmit} data-testid="admin-save-product">{saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}</Button>
            {editing && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar edición</Button>}
          </div>
        </form>

        <section className="admin-products-list">
          <Heading level={3}>Productos actuales</Heading>
          {loading ? (
            <p className="page__status">Cargando productos...</p>
          ) : (
            <>
              <div className="admin-products-list__items" data-testid="admin-products-list">
                {products.map((product) => {
                  const productId = product._id || product.id;
                  const imageUrl = getImageUrl(product);
                  return (
                    <article className="admin-product-card" key={productId} data-testid={`admin-product-row-${productId}`}>
                      <div className="admin-product-card__media" data-testid={`admin-product-image-wrap-${productId}`}>
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="admin-product-card__image" data-testid={`admin-product-image-${productId}`} />
                        ) : (
                          <div className="admin-product-card__image-fallback" data-testid={`admin-product-image-empty-${productId}`}>
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="admin-product-card__content">
                        <strong>{product.name}</strong>
                        <p>{product.description}</p>
                        <small>Stock: {product.stock} · Precio: ${Number(product.price || 0).toFixed(2)}</small>
                      </div>
                      <div className="admin-product-card__actions">
                        <Button type="button" variant="secondary" onClick={() => handleEdit(product)} data-testid={`admin-edit-${productId}`}>Editar</Button>
                        <Button type="button" variant="ghost" onClick={() => handleDelete(productId)} data-testid={`admin-delete-${productId}`}>Eliminar</Button>
                      </div>
                    </article>
                  );
                })}
                {!products.length && <p className="page__status">No hay productos disponibles para administrar.</p>}
              </div>

              {pagination.totalPages > 1 && (
                <div className="admin-products-pagination" data-testid="admin-products-pagination">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                    disabled={!pagination.hasPrev}
                    data-testid="admin-products-prev"
                  >
                    Anterior
                  </Button>
                  <span className="admin-products-pagination__text" data-testid="admin-products-pagination-text">
                    Pagina {pagination.currentPage} de {pagination.totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    disabled={!pagination.hasNext}
                    data-testid="admin-products-next"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}
