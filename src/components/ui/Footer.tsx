import { Plus } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "./input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CARD_TYPE_NAMES, GOV_CARDS } from "@/constants";
import { fileToBase64 } from "@/lib/utils";
import { addCard } from "@/lib/db";
import { DialogClose } from "@radix-ui/react-dialog";
import { Separator } from "./separator";

type FooterProps = {
  onAddCard: () => Promise<void>;
};

const Footer = ({ onAddCard }: FooterProps) => {
  const CardFormSchema = z.object({
    id: z.string().min(2).max(50),
    cardType: z.enum(CARD_TYPE_NAMES, {
      errorMap: () => ({ message: "Please select a card type" }),
    }),
    frontPicture: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "File must be an image",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image must be smaller than 5MB",
      }),
    backPicture: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "File must be an image",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image must be smaller than 5MB",
      })
      .optional(),
  });

  async function onSubmit(values: z.infer<typeof CardFormSchema>) {
    const frontImgBase64 = await fileToBase64(values.frontPicture);
    const backImgBase64 = values.backPicture
      ? await fileToBase64(values.backPicture)
      : undefined;
    await addCard({
      id: values.id,
      name: values.cardType,
      logo: GOV_CARDS.find((card) => card.name === values.cardType)?.logo || "",
      frontPicture: frontImgBase64,
      backPicture: backImgBase64,
    });
    await onAddCard();
    form.reset();
  }

  const form = useForm<z.infer<typeof CardFormSchema>>({
    resolver: zodResolver(CardFormSchema),
    defaultValues: {
      id: "",
      cardType: undefined,
      frontPicture: undefined,
      backPicture: undefined,
    },
  });

  return (
    <footer className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="size-20 sm:size-20 p-0 rounded-full flex items-center justify-center">
            <Plus className="size-7 sm:size-7" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="text-left">
                <DialogTitle>Add Card</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 items-center gap-4">
                      <FormLabel> ID No.</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardType"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 items-center gap-4">
                      <FormLabel> Card Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a card type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {CARD_TYPE_NAMES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h1>Upload Section</h1>
                <Separator />
                <FormField
                  control={form.control}
                  name="frontPicture"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="grid grid-cols-1 items-center gap-4">
                      <FormLabel>Front Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...fieldProps}
                          accept="image/*"
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backPicture"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="grid grid-cols-1 items-center gap-4">
                      <FormLabel>Back Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...fieldProps}
                          accept="image/*"
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                {!form.formState.isValid ? (
                  <Button type="submit" disabled>
                    Save changes
                  </Button>
                ) : (
                  <DialogClose asChild>
                    <Button type="submit">Save changes</Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
