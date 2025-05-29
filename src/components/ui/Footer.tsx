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
import { CARD_TYPE_NAMES } from "@/constants";

const Footer = () => {
  const CardFormSchema = z.object({
    id: z.string().min(2).max(50),
    cardType: z.enum(CARD_TYPE_NAMES, {
      errorMap: () => ({ message: "Please select a card type" }),
    }),
    picture: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "File must be an image",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        // 5MB limit
        message: "Image must be smaller than 5MB",
      }),
  });

  function onSubmit(values: z.infer<typeof CardFormSchema>) {
    console.log(form.formState.errors);
    console.log(values);
  }

  const form = useForm<z.infer<typeof CardFormSchema>>({
    resolver: zodResolver(CardFormSchema),
    defaultValues: {
      id: "",
      cardType: undefined,
      picture: undefined,
    },
  });

  return (
    <footer className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="size-12 sm:size-20 p-0 rounded-full flex items-center justify-center">
            <Plus className="size-5 sm:size-7" />
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
                        <Select onValueChange={field.onChange} {...field}>
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
                  name="picture"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="grid grid-cols-1 items-center gap-4">
                      <FormLabel>Upload Card</FormLabel>
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
