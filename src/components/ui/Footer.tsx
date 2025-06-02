import { CalendarIcon, Plus } from "lucide-react";
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
import { cn, fileToBase64 } from "@/lib/utils";
import { addCard } from "@/lib/db";
import { DialogClose } from "@radix-ui/react-dialog";
import { Separator } from "./separator";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Calendar } from "./calendar";

type FooterProps = {
  onAddCard: () => Promise<void>;
};

const CardFormSchema = z.object({
  id: z.string().min(2).max(50),
  cardType: z.enum(CARD_TYPE_NAMES, {
    errorMap: () => ({ message: "Please select a card type" }),
  }),
  dov: z.date().optional(),
  frontPicture: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be smaller than 5MB",
    })
    .optional(),
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

type CardFormValues = z.infer<typeof CardFormSchema>;

const Footer = ({ onAddCard }: FooterProps) => {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(CardFormSchema),
    defaultValues: {
      id: "",
      cardType: undefined,
      frontPicture: undefined,
      backPicture: undefined,
    },
  });

  async function onSubmit(values: CardFormValues) {
    const frontImgBase64 = values.frontPicture
      ? await fileToBase64(values.frontPicture)
      : undefined;
    const backImgBase64 = values.backPicture
      ? await fileToBase64(values.backPicture)
      : undefined;
    await addCard({
      id: values.id,
      name: values.cardType,
      type: values.cardType,
      logo: GOV_CARDS.find((card) => card.name === values.cardType)?.logo || "",
      frontPicture: frontImgBase64,
      backPicture: backImgBase64,
    });
    await onAddCard();
    form.reset();
  }

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
                <DialogTitle>
                  <b>Add Card</b>
                </DialogTitle>
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
                <FormField
                  control={form.control}
                  name="dov"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 items-center gap-4">
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-white bg-opacity-90 shadow-lg z-5"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h1 className="text-md font-semibold text-gray-700">
                  <b>Upload Section</b>
                </h1>
                <Separator />
                <FormField
                  control={form.control}
                  name="frontPicture"
                  render={(
                    { field: { onChange, value, ...fieldProps } } // eslint-disable-line @typescript-eslint/no-unused-vars
                  ) => (
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
                  render={(
                    { field: { onChange, value, ...fieldProps } } // eslint-disable-line @typescript-eslint/no-unused-vars
                  ) => (
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
                  <Button disabled className="w-full">
                    Save changes
                  </Button>
                ) : (
                  <DialogClose asChild>
                    <Button type="submit" className="w-full">
                      Save changes
                    </Button>
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
