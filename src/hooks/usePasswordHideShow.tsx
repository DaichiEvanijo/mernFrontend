import { useState } from 'react';

const usePasswordHideShow = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleMouseLeave = () => {
    setShowPassword(false);
  };

  return {
    showPassword,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  };
};

export default usePasswordHideShow
