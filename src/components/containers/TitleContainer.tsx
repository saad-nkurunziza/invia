import React, { ReactNode } from "react";

const TitleContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold w-fit">{title}</h3>

      {children}
    </div>
  );
};

export default TitleContainer;
