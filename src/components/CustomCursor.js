import React, { forwardRef } from 'react';

const CustomCursor = forwardRef((props, ref) => {
  return <div ref={ref} className="custom-cursor" />;
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;