import { useEffect, useState } from "react";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import { getCurrentProfile } from "../services/userService";
import "./ProfilePage.css";

const PROFILE_FIELDS = [
  { label: "Nombre", key: "displayName", fallback: "No disponible" },
  { label: "Correo electrónico", key: "email", fallback: "No disponible" },
  { label: "Rol", key: "role", fallback: "No disponible" },
  { label: "Teléfono", key: "phone", fallback: "No registrado" },
  {
    label: "Estado de cuenta",
    render: (profile) => (profile.active === false ? "Inactiva" : "Activa"),
  },
];

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    getCurrentProfile()
      .then((data) => {
        if (!mounted) return;
        setProfile(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.response?.data?.message || "No pudimos cargar tu perfil.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="page container profile-page profile-page--status">
        <p className="page__status">Cargando perfil...</p>
      </main>
    );
  }

  if (error) {
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
            Esta información se consume en tiempo real desde tu perfil en el backend.
          </Text>
        </header>

        <dl className="profile-card__details">
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
      </section>
    </main>
  );
}
