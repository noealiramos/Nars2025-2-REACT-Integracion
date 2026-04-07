import { useMemo, useState } from "react";
import { Heading } from "../components/atoms/Heading";
import { TextInput } from "../components/atoms/TextInput";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { useAdminCategories } from "../hooks/useAdminCategories";
import "./AdminCategoriesPage.css";

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  imageURL: "",
  parentCategory: "",
};

const validateCategoryForm = (form) => {
  if (!form.name.trim()) return "El nombre es obligatorio.";
  if (!form.description.trim()) return "La descripción es obligatoria.";
  if (form.imageURL && !/^https?:\/\//i.test(form.imageURL.trim())) return "La imagen debe ser una URL válida.";
  return null;
};

export function AdminCategoriesPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const editing = Boolean(form.id);
  const { categories, isLoading, isError, refetch, saveCategory, deleteCategory, isSaving, isDeleting } = useAdminCategories();
  const parentOptions = useMemo(() => categories.filter((category) => (category._id || category.id) !== form.id), [categories, form.id]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
  };

  const handleEdit = (category) => {
    setForm({
      id: category._id || category.id,
      name: category.name || "",
      description: category.description || "",
      imageURL: category.imageURL || "",
      parentCategory: category.parentCategory?._id || category.parentCategory || "",
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (categoryId) => {
    setError("");
    setSuccess("");
    try {
      await deleteCategory(categoryId);
      if (form.id === categoryId) resetForm();
      setSuccess("Categoría eliminada correctamente.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No pudimos eliminar la categoría.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateCategoryForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageURL: form.imageURL.trim() || undefined,
      parentCategory: form.parentCategory || undefined,
    };

    try {
      await saveCategory({ id: editing ? form.id : null, payload });
      const message = editing ? "Categoría actualizada correctamente." : "Categoría creada correctamente.";
      setSuccess(message);
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No pudimos guardar la categoría.");
    }
  };

  return (
    <main className="page container admin-categories-page">
      <header className="admin-categories-page__hero">
        <Heading level={2}>Administración de categorías</Heading>
        <Text>CRUD mínimo visible para listar, crear, editar y eliminar categorías reales del backend.</Text>
      </header>

      {error && <p className="page__status page__status--error">{error}</p>}
      {success && <p className="page__status admin-categories-page__success">{success}</p>}

      <section className="admin-categories-page__layout">
        <form className="admin-categories-form" onSubmit={handleSubmit}>
          <Heading level={3}>{editing ? "Editar categoría" : "Crear categoría"}</Heading>
          <TextInput id="admin-category-name" name="name" label="Nombre" value={form.name} onChange={handleFieldChange} />
          <div className="admin-categories-form__textarea-group">
            <label htmlFor="admin-category-description" className="form-label">Descripción</label>
            <textarea id="admin-category-description" name="description" className="admin-categories-form__textarea" value={form.description} onChange={handleFieldChange} data-testid="admin-category-description" />
          </div>
          <TextInput id="admin-category-image" name="imageURL" label="Imagen (URL)" value={form.imageURL} onChange={handleFieldChange} />
          <div className="admin-categories-form__select-group">
            <label htmlFor="admin-category-parent" className="form-label">Categoría padre</label>
            <select id="admin-category-parent" name="parentCategory" className="form-input" value={form.parentCategory} onChange={handleFieldChange} data-testid="admin-category-parent">
              <option value="">Sin categoría padre</option>
              {parentOptions.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-categories-form__actions">
            <Button type="submit" disabled={isSaving} data-testid="admin-save-category">{isSaving ? "Guardando..." : editing ? "Guardar cambios" : "Crear categoría"}</Button>
            {editing && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar edición</Button>}
          </div>
        </form>

        <section className="admin-categories-list">
          <Heading level={3}>Categorías actuales</Heading>
          {isLoading ? (
            <section className="admin-categories-feedback admin-categories-feedback--loading" data-testid="admin-categories-loading">
              <p className="page__status">Cargando categorías...</p>
              <p className="admin-categories-feedback__text">Preparando el catálogo administrativo.</p>
            </section>
          ) : isError ? (
            <section className="admin-categories-feedback admin-categories-feedback--error" data-testid="admin-categories-error">
              <p className="page__status page__status--error">No pudimos cargar las categorías.</p>
              <Button type="button" variant="secondary" onClick={() => refetch()} data-testid="admin-categories-retry">Reintentar</Button>
            </section>
          ) : (
            <div className="admin-categories-list__items" data-testid="admin-categories-list">
              {categories.map((category) => {
                const categoryId = category._id || category.id;
                return (
                  <article className="admin-category-card" key={categoryId} data-testid={`admin-category-row-${categoryId}`}>
                    <div>
                      <strong>{category.name}</strong>
                      <p>{category.description}</p>
                      <small>Padre: {category.parentCategory?.name || "Ninguna"}</small>
                    </div>
                    <div className="admin-category-card__actions">
                      <Button type="button" variant="secondary" onClick={() => handleEdit(category)} data-testid={`admin-category-edit-${categoryId}`}>Editar</Button>
                      <Button type="button" variant="ghost" onClick={() => handleDelete(categoryId)} data-testid={`admin-category-delete-${categoryId}`} disabled={isDeleting}>Eliminar</Button>
                    </div>
                  </article>
                );
              })}
              {!categories.length && <p className="page__status">No hay categorías disponibles para administrar.</p>}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
