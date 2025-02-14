"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

// Define schema using Zod
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    message: z.string().min(5, "Message must be at least 5 characters"),
});

export default function ContactForm() {
    const [response, setResponse] = useState("");

    // ✅ Initialize form with `useForm`
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", message: "" },
    });

    // Form submission function
    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:5000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setResponse(result.message);
            form.reset(); // ✅ Reset form after submission
        } catch (error) {
            setResponse("Error submitting form. Try again.");
        }
    };

    return (
        <div className="">
            <div className="max-w-md mt-[20vh] mx-[40vh] p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Contact Form</h2>

                {/* ✅ Ensure `Form` receives `form` as a prop */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Name Field */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Email Field */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Message Field */}
                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your message here..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Submit Button */}
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

                {response && <p className="mt-4 text-sm text-green-600">{response}</p>}
            </div>
        </div>
    );
}
