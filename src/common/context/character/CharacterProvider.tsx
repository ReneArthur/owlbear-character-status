import OBR from "@owlbear-rodeo/sdk";
import { createContext, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePlayer } from "../player/usePlayer";
import type { Character, SaveCharacter } from "@common/types/Character.type";
import type { Values } from "@common/types/ValueBarProps.type";
import type { ReactNode } from "react";
import { OBRMetadataId } from "@common/assets/OBRMetadataId";
import { isRoomMetadata } from "@common/utils/isRoomMetadata";

interface CharacterProviderProps {
  children: ReactNode;
  initialData: Character[];
}

interface CharacterContextValue {
  characters: Character[];
  addCharacter: (newCharacter: SaveCharacter) => Promise<void>;
  deleteCharacter: (uuid: string) => Promise<void>;
  editCharacter: (editedCharacter: Character) => Promise<void>;
  editBarValue: (
    characterId: string,
    barIndex: number,
    newValues: Partial<Values>
  ) => Promise<void>;
}

export const CharacterContext = createContext<CharacterContextValue>(
  {} as CharacterContextValue
);

function setCharacterMetadata(characters: Character[]): Promise<void> {
  return OBR.room.setMetadata({ [OBRMetadataId]: { characters } });
}

export function CharacterProvider({
  children,
  initialData,
}: CharacterProviderProps) {
  const [characters, setCharacters] = useState<Character[]>(initialData);
  const { player } = usePlayer();

  useEffect(() => {
    const handleSaveCharacters = (metadata: Record<string, unknown>) => {
      if (isRoomMetadata(metadata[OBRMetadataId])) {
        setCharacters(metadata[OBRMetadataId].characters);
      }
    };

    OBR.room.onMetadataChange(handleSaveCharacters);
  }, [setCharacters]);

  const addCharacter = useCallback(
    (newCharacter: SaveCharacter): Promise<void> =>
      new Promise((resolve, reject) => {
        const uuid = uuidv4();
        const newList = [
          ...characters,
          { id: uuid, playerId: player.id, ...newCharacter },
        ];
        setCharacterMetadata(newList).then(resolve, reject);
      }),
    [characters, player.id]
  );

  const deleteCharacter = useCallback(
    (characterId: string): Promise<void> =>
      new Promise((resolve, reject) => {
        if (player.role === "PLAYER") {
          const selectedCharacter = characters.find(
            (character) => character.id === characterId
          );
          if (!selectedCharacter) return;
          if (selectedCharacter.playerId !== player.id) return;
        }

        const newList = characters.filter(
          (character) => character.id !== characterId
        );
        setCharacterMetadata(newList).then(resolve, reject);
      }),
    [characters, player.id, player.role]
  );

  const editCharacter = useCallback(
    (editedCharacter: Character): Promise<void> =>
      new Promise((resolve, reject) => {
        if (player.role === "PLAYER" && editedCharacter.playerId !== player.id)
          return;

        const editedList = characters.map((character) =>
          character.id === editedCharacter.id ? editedCharacter : character
        );
        setCharacterMetadata(editedList).then(resolve, reject);
      }),
    [characters, player.id, player.role]
  );

  const editBarValue = useCallback(
    (
      characterId: string,
      barIndex: number,
      newValues: Partial<Values>
    ): Promise<void> =>
      new Promise((resolve, reject) => {
        if (player.role === "PLAYER") {
          const selectedCharacter = characters.find(
            (character) => character.id === characterId
          );
          if (!selectedCharacter) return;
          if (selectedCharacter.playerId !== player.id) return;
        }

        const editedList = characters.map((character) => {
          if (character.id === characterId) {
            const editedBarValues = character.barValues.map(
              (barValue, index) => {
                if (index === barIndex) {
                  return {
                    ...barValue,
                    ...newValues,
                  };
                }
                return barValue;
              }
            );
            return { ...character, barValues: editedBarValues };
          }
          return character;
        });
        setCharacterMetadata(editedList).then(resolve, reject);
      }),
    [characters, player.id, player.role]
  );

  return (
    <CharacterContext.Provider
      value={{
        characters,
        addCharacter,
        deleteCharacter,
        editCharacter,
        editBarValue,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}
