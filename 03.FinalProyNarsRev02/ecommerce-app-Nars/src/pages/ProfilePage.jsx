import { useEffect, useMemo, useState } from "react";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import { TextInput } from "../components/atoms/TextInput";
import { Button } from "../components/atoms/Button";
import { getCurrentProfile, updateCurrentProfile } from "../services/userService";
import "./ProfilePage.css";

const PROFILE_FIELDS = [
  { label: "Correo electrónico", key: "email", fallback: "No disponible" },
  { label: "Rol", key: "role", fallback: "No disponible" },
  {
    label: "Estado de cuenta",
    render: (profile) => (profile.active === false ? "Inactiva" : "Activa"),
  },
];

const toProfileForm = (profile) => ({
  displayName: profile?.displayName || "",
  phone: profile?.phone || "",
});

const getProfileErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors[0]?.msg || responseData.errors[0]?.message || fallbackMessage;
  }

  return fallbackMessage;
};

const validateProfileForm = (form) => {
  if (!form.displayName.trim()) return "El nombre es obligatorio.";
  if (form.displayName.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
  if (form.phone && !/^\d{1,10}$/.test(form.phone.trim())) return "El teléfono debe contener hasta 10 dígitos.";
  return null;
};

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(() => toProfileForm(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    getCurrentProfile()
      .then((data) => {
        if (!mounted) return;
        setProfile(data);
        setForm(toProfileForm(data));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(getProfileErrorMessage(err, "No pudimos cargar tu perfil."));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hasChanges = useMemo(() => {
    if (!profile) return false;

    return (
      form.displayName !== (profile.displayName || "") ||
      form.phone !== (profile.phone || "")
    );
  }, [form, profile]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setError(null);
    setSuccess("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm(toProfileForm(profile));
    setError(null);
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess("");

    const nextForm = {
      displayName: form.displayName.trim(),
      phone: form.phone.trim(),
    };

    const validationError = validateProfileForm(nextForm);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await updateCurrentProfile({
        displayName: nextForm.displayName,
        phone: nextForm.phone || undefined,
      });

      setProfile(updatedProfile);
      setForm(toProfileForm(updatedProfile));
      setSuccess("Perfil actualizado correctamente.");
    } catch (requestError) {
      setError(getProfileErrorMessage(requestError, "No pudimos actualizar tu perfil."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="page container profile-page profile-page--status">
        <p className="page__status">Cargando perfil...</p>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="page container profile-page profile-page--status">
        <p className="page__status page__status--error">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page container profile-page profile-page--status">
        <p className="page__status">No encontramos datos de perfil.</p>
      </main>
    );
  }

  return (
    <main className="page container profile-page" data-testid="profile-page">
      <section className="profile-card">
        <header className="profile-card__header">
          <Heading level={2}>Mi perfil</Heading>
          <Text className="profile-card__hint">
            Consulta tu información y actualiza los datos.
          </Text>
        </header>

        <section className="profile-card__grid">
          <div className="profile-card__summary">
            <dl className="profile-card__details">
              <div className="profile-card__row">
                <dt>Nombre</dt>
                <dd>{profile.displayName || "No disponible"}</dd>
              </div>
              <div className="profile-card__row">
                <dt>Teléfono</dt>
                <dd>{profile.phone || "No registrado"}</dd>
              </div>
              {PROFILE_FIELDS.map((field) => {
                const value = field.render ? field.render(profile) : profile[field.key] || field.fallback;

                return (
                  <div className="profile-card__row" key={field.label}>
                    <dt>{field.label}</dt>
                    <dd>{value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <Heading level={3}>Editar perfil</Heading>

            <TextInput id="profile-displayName" name="displayName" label="Nombre" value={form.displayName} onChange={handleFieldChange} />
            <TextInput id="profile-phone" name="phone" label="Teléfono" value={form.phone} onChange={handleFieldChange} inputMode="numeric" maxLength={10} />
            <TextInput id="profile-email" label="Correo electrónico" value={profile.email || ""} disabled readOnly />

            {error && <p className="page__status page__status--error">{error}</p>}
            {success && <p className="page__status profile-form__success">{success}</p>}

            <div className="profile-form__actions">
              <Button type="submit" disabled={saving || !hasChanges} data-testid="profile-save-button">
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleReset} disabled={saving || !hasChanges}>
                Restablecer
              </Button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
