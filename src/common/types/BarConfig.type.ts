import type { Color } from "./Color.type";

export interface BarConfig {
  name: string;
  isPublic: boolean;
  statusColor: Color;
  damagedColor: Color;
  backgroundColor: Color;
}
