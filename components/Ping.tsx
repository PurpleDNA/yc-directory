import React from "react";

const Ping = () => {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-1">
        <span className="flex size-[11px]">
          <span className="aboslute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75">
            <span className="realative inline-flex size-[11px] rounded-full bg-primary"></span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Ping;
