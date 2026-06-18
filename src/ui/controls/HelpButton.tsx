import { useState } from "react";

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1px solid #444",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          cursor: "pointer",
          userSelect: "none",
          zIndex: 10
        }}
      >
        i
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            top: 60,
            right: 12,
            width: 220,
            padding: 10,
            background: "rgba(0,0,0,0.85)",
            border: "1px solid #444",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: 12,
            zIndex: 10
          }}
        >
          <div style={{ marginBottom: 6 }}>Comandos</div>
          <div>* Click: spawn corpo parado</div>
          <div>* Shift + Click: spawn orbital</div>
          <div>* F: seguir/sol</div>
          <div>* Scroll: zoom</div>
          <div>* Click Qualquer corpo = aura</div>
          <div>* Espaço: pausar/resume</div>
          <div>* 1/2/5/0: velocidade</div>
          <div>* Del: deleta um planeta</div>
        </div>
      )}
    </>
  );
}