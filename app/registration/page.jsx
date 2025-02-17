"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"; // ✅ Ensure this import is correct

// Define schema using Zod
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    dob: z.date({
        required_error: "A date of birth is required.",
    }),
});

export default function ContactForm() {
    const [response, setResponse] = useState("");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", message: "", dob: undefined },
    });

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:5000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setResponse(result.message);
            form.reset();
        } catch (error) {
            setResponse("Error submitting form. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Contact Form</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Field */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Email Field */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Message Field */}
                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your message here..." {...field} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Date of Birth Field (Fixed Popover) */}
                        <FormField control={form.control} name="dob" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className="w-full text-left font-normal"
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2 bg-white shadow-md z-50">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(date) => field.onChange(date)} // ✅ Updates state correctly
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus // ✅ Ensures focus is set on open
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Your date of birth is used to calculate your age.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>

                {/* Response Message */}
                {response && <p className="mt-4 text-center text-sm text-green-600">{response}</p>}
            </div>
        </div>
    );
}
