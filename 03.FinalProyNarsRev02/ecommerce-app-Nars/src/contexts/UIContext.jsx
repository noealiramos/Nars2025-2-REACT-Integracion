import { createContext, useContext, useMemo, useReducer } from "react";

const UIContext = createContext(null);

const initialState = {
  loadingCount: 0,
  message: null,
  messageType: "success",
  activeModal: null,
};

function uiReducer(state, action) {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loadingCount: state.loadingCount + 1 };
    case "STOP_LOADING":
      return { ...state, loadingCount: Math.max(0, state.loadingCount - 1) };
    case "SHOW_MESSAGE":
      return {
        ...state,
        message: action.payload?.text || "",
        messageType: action.payload?.type || "success",
      };
    case "CLEAR_MESSAGE":
      return { ...state, message: null };
    case "OPEN_MODAL":
      return { ...state, activeModal: action.payload || null };
    case "CLOSE_MODAL":
      return { ...state, activeModal: null };
    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function GlobalUIFeedback() {
  const { state, dispatch } = useUI();

  return (
    <>
      {state.loadingCount > 0 && (
        <div className="page container" data-testid="global-ui-loading">
          <p className="page__status">Cargando datos...</p>
        </div>
      )}

      {state.message && (
        <div className="page container" data-testid="global-ui-message">
          <p className={`page__status${state.messageType === "error" ? " page__status--error" : ""}`}>
            {state.message}
          </p>
          <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "CLEAR_MESSAGE" })}>
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }

  return context;
}
