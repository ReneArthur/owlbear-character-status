import MuiBox from "@mui/material/Box";
import { motion } from "framer-motion";
import React from "react";

import type { BoxProps } from "@mui/material/Box";

const BoxComponent = React.forwardRef(function BoxComponent(
  props: BoxProps,
  ref
) {
  return <MuiBox {...props} ref={ref} />;
});

const MotionBox = motion(BoxComponent);

export default MotionBox;
