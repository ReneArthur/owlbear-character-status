import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Character, SaveCharacter } from "@common/types/Character.type";
import { Modal } from "@common/components/ui/Modal";
import { useCharacter } from "@common/context/character/useCharacter";
import { useConfig } from "@common/context/config/useConfig";

interface CharacterSheetProps {
  open: boolean;
  onClose: () => void;
  valuesForEdition?: Character;
}

export function CharacterSheet({
  open,
  onClose,
  valuesForEdition,
}: CharacterSheetProps) {
  const { bars: barsConfig } = useConfig();
  const { addCharacter, editCharacter } = useCharacter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<SaveCharacter>({
    defaultValues: valuesForEdition,
  });
  useEffect(() => {
    if (open && valuesForEdition) {
      setValue("name", valuesForEdition?.name);
      setValue("avatarImage", valuesForEdition?.avatarImage);
      valuesForEdition.barValues.forEach((bar, index) => {
        setValue(`barValues.${index}.total`, bar.total);
        setValue(`barValues.${index}.current`, bar.current);
      });
    }
  }, [open, setValue, valuesForEdition]);

  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //   // control, // control props comes from useForm (optional: if you are using FormContext)
  //   name: "test", // unique name for your Field Array
  //   rules:
  // });

  const handleSaveCharacter = async (data: SaveCharacter) => {
    if (valuesForEdition) {
      await editCharacter({
        id: valuesForEdition.id,
        playerId: valuesForEdition.playerId,
        ...data,
      });
    } else {
      await addCharacter(data);
    }
    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Personagem">
      <form onSubmit={handleSubmit(handleSaveCharacter)}>
        <Stack spacing={2} mt={2}>
          <TextField
            {...register("name", { required: "Nome é um campo obrigatório" })}
            id="new-character-name"
            label="Nome"
            placeholder="pingas"
            error={!!errors.name?.message}
            helperText={errors.name?.message}
          />
          <TextField
            {...register("avatarImage", {
              required: "Imagem é um campo obrigatório",
            })}
            id="new-character-image"
            label="Imagem"
            placeholder="www.link.com.br/foto.png"
            error={!!errors.avatarImage?.message}
            helperText={errors.avatarImage?.message}
          />
          {barsConfig?.map((bar, index) => (
            <Stack
              key={`${bar.name}-${bar.statusColor}${bar.backgroundColor}${bar.damagedColor}`}
              direction="row"
              spacing={2}
            >
              <TextField
                {...register(`barValues.${index}.current`, {
                  valueAsNumber: true,
                  required: `valor inicial da barra "${bar.name}" é um campo obrigatório`,
                })}
                id="new-character-value-current"
                type="number"
                label={`${bar.name} inicial`}
                error={
                  errors.barValues &&
                  !!errors.barValues[index]?.current?.message
                }
                helperText={
                  errors.barValues && errors.barValues[index]?.current?.message
                }
              />
              <TextField
                {...register(`barValues.${index}.total`, {
                  valueAsNumber: true,
                  required: `valor total da barra "${bar.name}" é um campo obrigatório`,
                })}
                id="new-character-value-total"
                type="number"
                label={`${bar.name} total`}
                error={
                  errors.barValues && !!errors.barValues[index]?.total?.message
                }
                helperText={
                  errors.barValues && errors.barValues[index]?.total?.message
                }
              />
            </Stack>
          ))}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress /> : "Salvar"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
