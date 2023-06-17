import OBR from "@owlbear-rodeo/sdk";
import { createContext, useCallback, useEffect, useState } from "react";
import type { BarConfig } from "@common/types/BarConfig.type";
import type { Config as ConfigType } from "@common/types/Config.type";
import type { ReactNode } from "react";
import { OBRMetadataId } from "@common/assets/OBRMetadataId";
import { isRoomMetadata } from "@common/utils/isRoomMetadata";

interface ConfigProviderProps {
  children: ReactNode;
  initialData: Partial<ConfigType>;
}

function setConfigMetadata(config: ConfigType): Promise<void> {
  return OBR.room.setMetadata({ [OBRMetadataId]: { config } });
}

const configBarsDefault: BarConfig[] = [
  {
    name: "PV",
    isPublic: true,
    statusColor: "#E2FF00",
    damagedColor: "#FF3202",
    backgroundColor: "#878787",
  },
  {
    name: "PE",
    isPublic: true,
    statusColor: "#E2FF00",
    damagedColor: "#FF3202",
    backgroundColor: "#878787",
  },
  {
    name: "SAN",
    isPublic: true,
    statusColor: "#E2FF00",
    damagedColor: "#FF3202",
    backgroundColor: "#878787",
  },
];

type ConfigContextValue = ConfigType & {
  changeBars: (changedBars: Partial<BarConfig>[]) => Promise<void>;
};

export const ConfigContext = createContext<ConfigContextValue>(
  {} as ConfigContextValue
);

export function ConfigProvider({ children, initialData }: ConfigProviderProps) {
  const [config, setConfig] = useState<Partial<ConfigType>>(initialData);

  const changeBars = useCallback(
    (changedBars: Partial<BarConfig>[]): Promise<void> =>
      new Promise((resolve, reject) => {
        const newBarsConfig = changedBars.map((barConfig, index) => ({
          ...(config.bars ? config.bars[index] : configBarsDefault[index]),
          ...barConfig,
        }));
        setConfigMetadata({ ...config, bars: newBarsConfig }).then(
          resolve,
          reject
        );
      }),
    [config]
  );

  useEffect(() => {
    const handleSaveConfig = (metadata: Record<string, unknown>) => {
      if (isRoomMetadata(metadata[OBRMetadataId])) {
        setConfig(metadata[OBRMetadataId].config ?? {});
      }
    };
    OBR.room.onMetadataChange(handleSaveConfig);
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        bars: config.bars ?? configBarsDefault,
        changeBars,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
