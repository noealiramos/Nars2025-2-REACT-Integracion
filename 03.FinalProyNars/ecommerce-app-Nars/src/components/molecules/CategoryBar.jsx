import { NavLink } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import "./CategoryBar.css";

/**
 * CategoryBar Molecule
 * Sigue el patrón de Atomic Design como una Molecule.
 * Barra de navegación secundaria para filtrar por categorías.
 */
export function CategoryBar() {
    const { categories, loading } = useCategories();

    if (loading) {
        return (
            <div className="category-bar">
                <div className="container category-bar__inner">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="category-bar__item category-bar__item--skeleton" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="category-bar">
            <nav className="container category-bar__inner">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        "category-bar__item" + (isActive ? " category-bar__item--active" : "")
                    }
                    end
                >
                    Todo
                </NavLink>
                {categories.map((cat) => (
                    <NavLink
                        key={cat.id}
                        to={`/?category=${cat.id}`}
                        className={({ isActive }) =>
                            "category-bar__item" + (isActive ? " category-bar__item--active" : "")
                        }
                    >
                        {cat.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
