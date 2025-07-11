'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileEdit, Send, Sparkles } from 'lucide-react';
import type { NotificationData } from '@/lib/types';
import { generateMessageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  body: z.string().min(1, 'Body is required.'),
  iconUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  layoutTemplate: z.string().min(10, 'Please provide a more descriptive layout.'),
  tone: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface NotificationFormProps {
  templateData: NotificationData;
  onTemplateChange: (data: NotificationData) => void;
  onSendTest: (data: NotificationData) => void;
}

export function NotificationForm({ templateData, onTemplateChange, onSendTest }: NotificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...templateData,
      layoutTemplate: 'A notification with a title, body, and large feature image.',
      tone: 'Friendly',
    },
  });

  const handleFormChange = () => {
    onTemplateChange(form.getValues());
  };

  const onSubmit = (values: FormValues) => {
    onSendTest(values);
  };
  
  const handleGenerateMessage = () => {
    startTransition(async () => {
      const { layoutTemplate, tone } = form.getValues();
      if (!layoutTemplate) {
        form.setError('layoutTemplate', { message: 'Layout description is required to generate a message.' });
        return;
      }
      
      const result = await generateMessageAction({ layoutTemplate, tone });
      if (result.success) {
        form.setValue('body', result.message, { shouldValidate: true });
        handleFormChange();
      } else {
        toast({
          title: 'Generation Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="h-5 w-5" />
          Template Editor
        </CardTitle>
        <CardDescription>
          Design your notification layout and content here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" onChange={handleFormChange}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notification Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notification body text..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/icon.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 rounded-md border bg-muted/50 p-4">
              <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />AI Message Generator</h3>
               <FormField
                  control={form.control}
                  name="layoutTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the layout for the AI..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Example: "A short, urgent alert with a title and body."
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); handleFormChange(); }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Friendly">Friendly</SelectItem>
                          <SelectItem value="Formal">Formal</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                          <SelectItem value="Playful">Playful</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="button" onClick={handleGenerateMessage} disabled={isPending} className="w-full">
                {isPending ? 'Generating...' : 'Generate with AI'}
                {!isPending && <Sparkles />}
              </Button>
            </div>
            
            <Button type="submit" className="w-full">
              <Send />
              Send Local Test Notification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
