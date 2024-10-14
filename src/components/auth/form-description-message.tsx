import React, { FC } from "react";

interface Props {
  message: string | null;
  type: "error" | "success" | null;
}
const FormDescriptionMessage: FC<Props> = ({ message, type }) => {
  if (!message || !type) return null;

  const textColor =
    type === "success"
      ? "text-emerald-500 bg-emerald-500/15"
      : "bg-destructive/15 text-destructive";

  return (
    <div className={`py-2 px-2 rounded text-[0.8rem] font-medium ${textColor}`}>
      {message}
    </div>
  );
};

export default FormDescriptionMessage;
