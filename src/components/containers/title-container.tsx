import React, { ReactNode } from "react";
import { CardTitle } from "../ui/card";

const TitleContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="space-y-5">
      <CardTitle>{title}</CardTitle>

      {children}
    </div>
  );
};

export default TitleContainer;
