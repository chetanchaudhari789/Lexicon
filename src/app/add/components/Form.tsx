"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookData {
  title: string;
  description: string;
  bookImage: string;
  bookPdfUrl: string;
  author: string;
  creatorName: string,
  creatorImage: string
}

const bookSchema = z.object({
  title: z.string({ required_error: "Title is required!" })
    .min(3, { message: "Book Name must be at least 5 characters" }),
  description: z.string({ required_error: "Description is required!" })
    .min(10, { message: "Description must be at least 10 characters" })
    .max(2000, { message: "Description must be no more than 200 characters" }),
  bookImage: z.string({ required_error: "Book Image URL is required!" })
    .url({ message: "Image URL is invalid" }),
  bookPdfUrl: z.string({ required_error: "Book PDF URL is required!" })
    .url({ message: "PDF URL is invalid" }),
  author: z.string({ required_error: "Author Name is required!" })
    .min(3, { message: "Author Name must be at least 5 characters" }),
  creatorName: z.string(),
  creatorImage: z.string()
});

const initialBookData: BookData = {
  title: "",
  description: "",
  bookImage: "",
  bookPdfUrl: "",
  author: "",
  creatorName: "",
  creatorImage: ""
};

const Form = () => {
  const [bookData, setBookData] = useState<BookData>(initialBookData);
  const [isAdding, setIsAdding] = useState<Boolean>(false)
  const router = useRouter()
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      setBookData((prevBookData) => ({
        ...prevBookData,
        creatorName: session.user?.name ?? "",
        creatorImage: session.user?.image ?? ""
      }));
    }
  }, [session]);

  if (status === "loading") {
    return <div className="h-[80vh] flex justify-center items-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    router.replace('/signin')
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };


  const addBook = async (e: any) => {
    e.preventDefault();

    const isServer = typeof window === 'undefined';

    const apiUrl = isServer
      ? `${process.env.FRONTEND_URL}/api/books/add`
      : '/api/books/add';

    if (!bookData.creatorName || !bookData.creatorImage) {
      return alert('Please fill in your name and image')
    }

    const result = bookSchema.safeParse(bookData);

    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }

    setIsAdding(true)
    try {
      const response = await axios.post(apiUrl, bookData);

      if (response.data.success) {
        toast.success("Book Added Successfully :)")
        router.push('/books')
      } else {
        toast.error("Something went wrong :(")
      }
    } catch (error: any) {
      let zodError = error?.response?.data?.msg;
      toast.error(`${zodError ? zodError : error}`)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="h-[83vh] flex justify-center items-center max-sm:px-2">
      <form className="flex flex-col gap-5 w-[40vw] max-sm:w-full" onSubmit={addBook}>
        <Input placeholder="Book Name" name="title" onChange={handleOnChange} className="h-10 dark:border-gray-200 border-gray-500" />
        <Input placeholder="Book Description" name="description" onChange={handleOnChange} className="h-10 dark:border-gray-200 border-gray-500" />
        <Input placeholder="Book Image Url" name="bookImage" onChange={handleOnChange} className="h-10 dark:border-gray-200 border-gray-500" />
        <Input placeholder="Book PDF Url" name="bookPdfUrl" onChange={handleOnChange} className="h-10 dark:border-gray-200 border-gray-500" />
        <Input placeholder="Author" name="author" onChange={handleOnChange} className="h-10 dark:border-gray-200 border-gray-500" />

        <Button>
          {isAdding ? 'Adding...' : 'Add Book'}
        </Button>
      </form>
    </div>
  );
};

export default Form;
