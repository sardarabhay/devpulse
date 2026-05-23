import type { Persona } from "../types/github";

interface Props {
  persona: Persona;
}

export const PersonaBadge = ({ persona }: Props) => {
  return (
    <div className="persona-badge">
      <div className="persona-indicator" />
      <div className="persona-text">
        <span className="persona-label">{persona.label}</span>
        <span className="persona-desc">{persona.description}</span>
      </div>
    </div>
  );
};