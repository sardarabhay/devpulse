import type { Persona } from "../types/github";

interface Props {
  persona: Persona;
}

export const PersonaBadge = ({ persona }: Props) => {
  return (
    <div className="persona-badge">
      <span className="persona-emoji">{persona.emoji}</span>
      <div className="persona-text">
        <span className="persona-label">{persona.label}</span>
        <span className="persona-desc">{persona.description}</span>
      </div>
    </div>
  );
};